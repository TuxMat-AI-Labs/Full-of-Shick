# Hosting this kit for review

This folder is a self-contained static site. The gallery `index.html`
at the root is the entry point and links into all eight designs. No
build step, no dependencies to install.

It is already set up as a Git repository with an initial commit.

---

## Option A — GitHub + GitHub Pages (the "host on Git" path)

1. Create a new, empty repository on GitHub (e.g. `tuxmat-web-concepts`).
   Do not add a README or .gitignore there; this folder already has them.

2. From this folder, connect it and push:

   ```
   cd ~/Desktop/tuxmat-landing-kit
   git remote add origin https://github.com/<your-username>/tuxmat-web-concepts.git
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages → Source: "Deploy from a branch" →
   Branch: `main` / folder: `/ (root)` → Save.**

4. Wait about a minute. Your review link will be:

   ```
   https://<your-username>.github.io/tuxmat-web-concepts/
   ```

   Send that to your CEO. It opens straight to the gallery; every card
   links into a live design, videos and carts included.

**Public vs private:** GitHub Pages is free on **public** repos. Serving
Pages from a **private** repo requires a paid GitHub plan (Pro/Team). If
the concepts should stay unlisted, either keep the repo public with an
obscure name, or use Option B.

---

## Option B — Netlify Drop (fastest private link, no Git needed)

1. Go to https://app.netlify.com/drop
2. Drag this whole folder (or `tuxmat-landing-kit.zip`) onto the page.
3. You get an instant, shareable URL in seconds. Optionally set a
   password under Site settings → Access control.

Vercel (https://vercel.com) works the same way via "Add New → Project".

---

## Notes for whoever hosts it

- Serve over HTTP(S), not `file://`, so the hero videos autoplay and the
  carts behave. All three host options above do this automatically.
- Total size is ~104 MB, mostly cinematic video. Largest single file is
  ~30 MB, within GitHub's 100 MB per-file limit. Git LFS is not required.
- All pricing, vehicle data, and checkouts are demo/sample for the live
  Shopify catalog to replace. No payment is processed anywhere.
- Per-design notes are in each folder's own `README.md`; the kit
  overview is in `README.md`.
