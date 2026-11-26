-- Lead-urile de pe epicdigitalhub.ro, mutate din Upstash Redis în Postgres.
-- Se rulează o singură dată, în Supabase → SQL Editor, pe proiectul echipei
-- (același pe care rulează platforma de tichete).
--
-- DE CE MUTAREA: baza Upstash a fost ștearsă în noiembrie 2026 și nu a putut fi
-- recuperată. Fusese creată prin integrarea Vercel Marketplace, deci nu era
-- administrabilă din consola Upstash, iar Vercel o arăta în continuare
-- „connected" după ce dispăruse. Lead-urile scrise acolo s-au pierdut; singura
-- copie au rămas emailurile de notificare. Postgres cu backup, pe un proiect pe
-- care echipa îl deschide zilnic, închide fix această clasă de surpriză.

create table public.site_leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),

  -- din ce formular a venit; aceleași trei nume ca în aplicație
  kind        text not null check (kind in ('contact', 'audit', 'apply')),

  -- comune tuturor formularelor
  name        text not null default '',
  email       text not null default '',
  locale      text not null default 'ro',

  -- contact: pagina de pe care a scris
  page        text,

  -- audit: site-ul analizat
  url         text,

  -- aplicații
  business    text,
  city        text,
  niche       text,
  website     text,
  goal        text,
  budget      text,
  status      text,

  /* Orice câmp viitor al unui formular, fără migrație: formularele se mai
     schimbă, iar un lead pierdut pentru că a apărut o întrebare nouă ar fi
     exact greșeala pe care o reparăm aici. */
  extra       jsonb not null default '{}'
);

/* Panoul citește mereu „cele mai noi întâi", iar graficul taie pe interval de
   timp. Un singur index descrescător pe dată le servește pe amândouă. */
create index site_leads_created_idx on public.site_leads (created_at desc);
create index site_leads_kind_idx on public.site_leads (kind, created_at desc);

-- ───────────────────────── Limitarea pe IP ─────────────────────────
-- Înlocuiește contoarele `rl:<bucket>:<ip>` din Redis. Un rând per fereastră.

create table public.site_rate_limits (
  bucket      text not null,
  ip          text not null,
  window_start timestamptz not null,
  count       int not null default 1,
  primary key (bucket, ip, window_start)
);

create index site_rate_limits_window_idx on public.site_rate_limits (window_start);

/* Incrementează și spune dacă s-a depășit, într-un singur apel: altfel între
   citire și scriere încap două cereri care trec amândouă. `security definer`
   pentru că tabelul nu e expus nimănui. */
create or replace function public.site_rate_hit(
  p_bucket text,
  p_ip text,
  p_max int,
  p_window_seconds int
) returns boolean
language plpgsql security definer set search_path = public as $$
declare
  w timestamptz;
  n int;
begin
  -- începutul ferestrei fixe în care cade momentul de acum
  w := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);

  insert into site_rate_limits (bucket, ip, window_start, count)
  values (p_bucket, p_ip, w, 1)
  on conflict (bucket, ip, window_start)
    do update set count = site_rate_limits.count + 1
  returning count into n;

  return n > p_max;
end $$;

/* Curățenie: rândurile vechi nu mai spun nimic. Se șterg la fiecare apel, cu
   probabilitate mică, ca să nu fie nevoie de un cron doar pentru atât. */
create or replace function public.site_rate_sweep() returns void
language sql security definer set search_path = public as $$
  delete from site_rate_limits where window_start < now() - interval '2 days';
$$;

-- ───────────────────────── Nișele ocupate ─────────────────────────
-- Era `taken-niches` în Redis: o listă pe care adminul o edita din consolă.

create table public.taken_niches (
  id      uuid primary key default gen_random_uuid(),
  city    text not null,
  niche   text not null,
  client  text not null default ''
);

-- ───────────────────────── RLS: nimeni, în afară de server ─────────
/* Toate trei au RLS pornit și NICIO politică. Asta nu e o scăpare, e intenția:
   fără politici, `anon` și `authenticated` nu pot citi nimic, iar site-ul și
   panoul scriu și citesc cu cheia de service, care ocolește RLS.
   `site_leads` conține nume, emailuri și numere de telefon ale unor oameni
   reali - o politică greșită aici ar fi mai scumpă decât orice funcționalitate
   pe care ar debloca-o. */
alter table public.site_leads       enable row level security;
alter table public.site_rate_limits enable row level security;
alter table public.taken_niches     enable row level security;

-- ───────────────────────── Cine poate chema funcțiile ─────────────
/* PostgREST expune automat funcțiile din `public` către `anon`, iar ale
   noastre sunt `security definer` - adică ocolesc RLS prin construcție. Fără
   rândurile de mai jos, oricine are cheia publishable (care stă în browser, e
   făcută să fie publică) putea chema `site_rate_hit` cu orice IP: nu vedea
   niciun lead, dar putea umfla contoarele până când un vizitator real primea
   „ai trimis prea multe cereri". Verificat: răspundea 200.

   Doar serverul, deci. */
revoke all on function public.site_rate_hit(text, text, int, int) from public, anon, authenticated;
revoke all on function public.site_rate_sweep() from public, anon, authenticated;
grant execute on function public.site_rate_hit(text, text, int, int) to service_role;
grant execute on function public.site_rate_sweep() to service_role;
