# Interactive Phonics Trial Lesson

Static Next.js + TypeScript + TailwindCSS web lesson converted from the provided 29-page phonics trial PPT.

This is the slim GitHub upload version. It keeps only the source files and assets used by the current lesson, so it can be uploaded through GitHub's web file uploader without hitting the 100-file limit.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The app uses `output: "export"` in `next.config.mjs`, so it is ready for Vercel, Netlify, or static hosting.

## Deploy to GitHub Pages

This app uses root-relative assets such as `/assets/...`, so the recommended GitHub Pages repository name is:

```text
penny00703-crypto.github.io
```

After creating that repository on GitHub, upload the contents of this folder or run these commands from this folder:

```bash
git init
git branch -M main
git add .
git commit -m "Deploy phonics trial lesson"
git remote add origin https://github.com/penny00703-crypto/penny00703-crypto.github.io.git
git push -u origin main
```

GitHub Actions will build and publish the static site automatically. Once the Pages workflow finishes, the lesson will be available at:

```text
https://penny00703-crypto.github.io/
```

## Source Content Coverage

- Preserves the useful original anchors: opening class reminders, teacher diagnosis, and CEFR ability benchmark.
- Keeps the Aa `/æ/` and Ee `/e/` knowledge points.
- Keeps all visible vocabulary and practice items: ant, ax, pat, rat, mat, jam, alligator, apple, bed, pet, pen, net, get, set, leg, jet, red.
- Uses the original MP3 files where provided.
- Replaces most watermark-prone PPT visuals with one cohesive generated phonics illustration system plus programmatic sound/letter/word cards.
- Adds mobile-first interactions, feedback, progress tracking, score tracking, optional voice recording, and a final report.
