/* ============================================================================
   SERVICE DEVICE — the one graphic on the service pages.

   From Roland's handoff: the mark's 23.6° cut, an emerald beam with fine
   hairlines, varied per page only in position, mirror and weight. The angle
   is the logo's own - the E bars in logo.tsx slope 28 across 64 up
   ("M0,0H209L237,64H28Z"), atan(28/64) = 23.6° - and it never changes.
   tan(23.6°) ≈ 0.437 -> dx = ±109 over the 500-tall viewBox.

   Recoloured for this site: the beam is the brand accent #1FDB93, the
   hairlines and the faint fill take `currentColor`, so the same device reads
   on the cream pages (ink lines) and on the dark panels (white lines).

   `draw` strokes the lines in on arrival. It rides the same `intro-done`
   class as the header entrance (see globals.css), so it is pure CSS, starts
   after first paint, and is skipped under prefers-reduced-motion.
   ========================================================================= */

type CutConfig = {
  /** x of the beam's centre at mid-height (viewBox 0–600) */
  x: number;
  /** beam stroke width */
  w: number;
  /** mirrored = "/" instead of "\" */
  mirror?: boolean;
  /** hairline offsets from the beam, along x (signed) */
  hairlines: number[];
  /** faint filled side: everything left of the beam */
  fill?: boolean;
};

const DX = 109;

const CONFIG: Record<string, CutConfig> = {
  "campanii-ppc": { x: 300, w: 14, hairlines: [102, -102], fill: true },
  "seo-geo": { x: 360, w: 10, mirror: true, hairlines: [-70, -140] },
  "social-media-management": { x: 240, w: 10, mirror: true, hairlines: [80, 160] },
  "continut-video": { x: 330, w: 14, hairlines: [-90], fill: true },
  "magazine-online": { x: 270, w: 8, hairlines: [70, 140] },
  "website-uri-prezentare": { x: 380, w: 12, mirror: true, hairlines: [-100], fill: true },
  "design-grafic": { x: 300, w: 6, hairlines: [50, -50] },
  "email-marketing": { x: 250, w: 10, mirror: true, hairlines: [-80, 90] },
  "tracking-date": { x: 340, w: 16, hairlines: [-60, -120] },
  "consultanta-marketing": { x: 300, w: 20, hairlines: [90] },
};

export function ServiceDevice({
  slug,
  draw = false,
  cover = false,
  className = "",
}: {
  slug: string;
  /** stroke the lines in on arrival (the page hero) */
  draw?: boolean;
  /** fill a box of any shape, cropping the device (the hub's row media) */
  cover?: boolean;
  className?: string;
}) {
  const c = CONFIG[slug];
  if (!c) return null;

  const dir = c.mirror ? -1 : 1;
  const topX = (x: number) => x + dir * DX;
  const botX = (x: number) => x - dir * DX;
  // pathLength=1 normalises every line to the same dash length for the draw
  const line = draw ? "device-line" : undefined;

  return (
    <svg
      viewBox="0 0 600 500"
      preserveAspectRatio={cover ? "xMidYMid slice" : undefined}
      className={`block ${className}`}
      aria-hidden
    >
      {c.fill && (
        <polygon
          points={`0,0 ${topX(c.x)},0 ${botX(c.x)},500 0,500`}
          fill="currentColor"
          fillOpacity=".05"
          className={draw ? "device-fill" : undefined}
        />
      )}
      <line
        x1={topX(c.x)}
        y1="0"
        x2={botX(c.x)}
        y2="500"
        stroke="#1FDB93"
        strokeWidth={c.w}
        pathLength={1}
        className={line}
        style={{ "--intro-delay": "0.35s" } as React.CSSProperties}
      />
      {c.hairlines.map((off, i) => (
        <line
          key={off}
          x1={topX(c.x + off)}
          y1="0"
          x2={botX(c.x + off)}
          y2="500"
          stroke="currentColor"
          strokeOpacity=".55"
          strokeWidth="3"
          pathLength={1}
          className={line}
          style={{ "--intro-delay": `${0.55 + i * 0.15}s` } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}

/* ============================================================================
   DEVICE BAND — the cut at full width, as a chapter break.

   The one moment on a service page that stops the scroll: a field of the
   same 23.6° cut, tiled across the viewport, with the service name over it.

   Drawn on its own wide viewBox rather than by cropping the small device:
   `preserveAspectRatio="slice"` on a short, wide box scales by WIDTH, which
   multiplied every stroke by ~2.4 and turned the beam into a slab. Authoring
   the geometry at band proportions keeps the strokes at the weights the mark
   uses. Spacing, beam frequency and direction all come from the same
   per-service CONFIG, so no two service pages get the same field.
   ========================================================================= */

const BAND_W = 1600;
const BAND_H = 500;
/** dx across the band height, for the mark's own 23.6°: 500 * tan(23.6°). */
const BAND_DX = Math.round(BAND_H * 0.437);

function BandLines({ slug }: { slug: string }) {
  const c = CONFIG[slug];
  if (!c) return null;

  const dir = c.mirror ? -1 : 1;
  const step = 120 + c.w * 6;
  // every nth line is the emerald beam; the rest are bone hairlines
  const beamEvery = c.hairlines.length + 2;
  const lines = [];
  for (let i = 0, x = -BAND_DX - step; x < BAND_W + BAND_DX; i++, x += step) {
    const beam = i % beamEvery === 0;
    lines.push(
      <line
        key={x}
        x1={x + dir * BAND_DX}
        y1="0"
        x2={x - dir * BAND_DX}
        y2={BAND_H}
        stroke={beam ? "#1FDB93" : "currentColor"}
        strokeOpacity={beam ? 1 : 0.28}
        strokeWidth={beam ? c.w : 3}
      />,
    );
  }

  return (
    <svg
      viewBox={`0 0 ${BAND_W} ${BAND_H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      {lines}
    </svg>
  );
}

export function DeviceBand({
  slug,
  label,
  title,
}: {
  slug: string;
  label: string;
  title: string;
}) {
  return (
    <section
      data-nav-bg="dark"
      /* Fixed heights, not vh: this sits mid-page, where a viewport-tall
         block just costs a scroll with nothing new in it. */
      className="relative flex h-[380px] w-full items-end overflow-hidden bg-[#0F0F0F] text-[#F5F2F2] md:h-[520px]"
    >
      <BandLines slug={slug} />
      <div className="relative mx-auto w-full max-w-[1440px] px-4 pb-12 md:pb-16">
        <p className="text-[11px] tracking-[0.1em] text-white/60 uppercase">{label}</p>
        <h2 className="mt-5 max-w-[16ch] text-[11vw] leading-[0.92] font-medium tracking-[-0.03em] uppercase md:text-[5.6vw]">
          {title}
        </h2>
      </div>
    </section>
  );
}
