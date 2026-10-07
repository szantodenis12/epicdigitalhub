# Reels pe paginile de studiu de caz

Fiecare pagină `/case-studies/<slug>` are secțiunea „Reels & video".

**Ca să schimbi sau să adaugi un reel:**

1. Comprimă reelul (9:16) pentru web:
   ```
   ffmpeg -i REEL.mp4 -vf "scale='min(720,iw)':-2" -c:v libx264 -crf 27 \
     -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart <slug>-N.mp4
   ffmpeg -ss 1 -i <slug>-N.mp4 -frames:v 1 -q:v 4 <slug>-N.jpg
   ```
2. Pune ambele fișiere aici (`public/video/cases/`).
3. Adaugă / editează rândul în `caseVideos` din
   `src/app/_content/case-studies.ts` (src, poster, titlu RO+EN).

Slugs: hotel-maxim · dentalnet · agro-salso · kgm-chery-oradea ·
harmony-garden · origins-cafe · thermx

Surse actuale: reels Remotion din `my-video/out/`, finals din `CLIENTI/*/ASSETS/`,
Origins = reels Silviu (Drive EPIC → arhivate în
`CLIENTI/OriginsCafe/ASSETS/REELS_SILVIU_2026-09/`).
