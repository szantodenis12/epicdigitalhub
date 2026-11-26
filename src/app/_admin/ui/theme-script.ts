/* ============================================================================
   Tema panoului, partea care trebuie să existe ÎNAINTE de primul pixel.

   Modul simplu (fără "use client"), ca să poată fi importat și de layout-ul de
   server, care injectează scriptul, și de butonul din client, care îl schimbă.

   De ce două locuri de păstrare pentru o singură alegere:

     localStorage  e sursa de adevăr. Supraviețuiește închiderii browserului și
                   nu se trimite la server la fiecare cerere.
     cookie        e copia pe care o poate citi și serverul. Nu e citită în
                   layout, intenționat - `cookies()` într-un root layout scoate
                   tot ce e dedesubt din prerandare - dar e citită de scriptul
                   de mai jos ca rezervă, și e singurul loc din care tema se
                   poate afla dacă localStorage e blocat (Safari în mod privat,
                   politici de întreprindere, iframe).

   Scriptul rulează sincron, în <head>, în timp ce HTML-ul e încă parsat: pune
   atributul pe <html> înainte de prima pictare, deci nu există cadrul alb de
   dinaintea hidratării. Tot ce e în el e într-un try/catch - dacă stocarea
   aruncă, panoul rămâne pe tema întunecată, care e oricum cea implicită.
   ========================================================================= */

export const THEME_ATTR = "data-admin-theme";
export const THEME_KEY = "edh:admin-theme";
export const THEME_COOKIE = "edh_admin_theme";

export type AdminTheme = "dark" | "light";
export const DEFAULT_THEME: AdminTheme = "dark";

/** Un an. Alegerea e o preferință, nu o sesiune. */
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/* Scriptul injectat. Scris pe o singură expresie, cu `var`, fără funcții
   săgeată: e cod care rulează înaintea oricărui bundle, deci nu trece prin
   niciun transpilator și trebuie să fie valabil ca atare.

   `=== "light"` și nu "orice altceva decât dark": o valoare stricată în
   stocare (sau una dintr-o versiune viitoare) trebuie să ducă la tema
   implicită, nu la o temă inexistentă scrisă în atribut. */
export const THEME_SCRIPT =
  "try{" +
  `var k=${JSON.stringify(THEME_KEY)},c=${JSON.stringify(THEME_COOKIE)};` +
  "var v=null;try{v=localStorage.getItem(k)}catch(e){}" +
  "if(!v){var m=document.cookie.match(new RegExp('(?:^|; )'+c+'=([^;]*)'));" +
  "if(m)v=decodeURIComponent(m[1])}" +
  `document.documentElement.setAttribute(${JSON.stringify(THEME_ATTR)},v==="light"?"light":"dark")` +
  "}catch(e){}";
