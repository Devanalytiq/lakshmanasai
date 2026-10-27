# Karumuri Lakshmana Sai — Portfolio

A premium, futuristic, cyberpunk-glassmorphism personal portfolio built as a **100% static website** — no frameworks, no build tools, no npm required.

🔗 Live demo: deploy directly to Vercel, Netlify, GitHub Pages, or Cloudflare Pages (see below).

## ✨ Highlights

- Dark, neon-glow, glassmorphic cyberpunk aesthetic
- Interactive Three.js hero scene (floating wireframe geometry, starfield, mouse-reactive lighting & parallax)
- Canvas 2D particle network background with mouse repulsion
- Custom animated cursor (dot + trailing ring)
- Magnetic buttons, 3D tilt cards, animated counters, skill progress bars
- Scroll-triggered reveal animations, animated timeline, typewriter hero subtitle
- Infinite tech-stack marquee
- Testimonial carousel with autoplay
- Fully validated contact form (vanilla JS, no dependencies)
- Loading screen, back-to-top button, smooth scrolling, mobile-first responsive layout
- SEO metadata, Open Graph tags, `sitemap.xml`, `robots.txt`, `manifest.json`, favicon

## 🧱 Tech Stack

- HTML5 / CSS3 / Vanilla JavaScript (ES6+)
- [Three.js](https://threejs.org/) r128 (CDN) — 3D hero scene
- [GSAP](https://gsap.com/) 3.12 + ScrollTrigger (CDN) — loaded for future scroll-animation extensions
- [Font Awesome 6](https://fontawesome.com/) (CDN) — iconography
- Google Fonts: Orbitron (display), Sora (body), JetBrains Mono (accents)

No React, Vue, Angular, Node.js, Tailwind, TypeScript, npm, Vite or Webpack — this project runs by simply opening `index.html`.

## 📁 File Structure

```
/
├── index.html
├── css/
│   ├── style.css          # variables, layout, components
│   ├── animations.css     # keyframes & scroll-reveal states
│   └── responsive.css     # breakpoints
├── js/
│   ├── main.js            # loader, cursor, nav, forms, sliders
│   ├── animations.js      # scroll reveals, counters, tilt, typewriter
│   ├── three-scene.js     # Three.js hero scene
│   └── particles.js       # canvas 2D particle background
├── assets/
│   ├── images/            # icons, OG cover (SVG, no build step needed)
│   ├── icons/
│   └── resume.pdf         # downloadable resume
├── favicon.ico
├── robots.txt
├── sitemap.xml
├── manifest.json
└── README.md
```

## 🚀 Running Locally

Just open `index.html` in a browser. For best results (some browsers restrict `file://` fetches), serve it with any static server:

```bash
# Python
python3 -m http.server 8080

# Node (no install needed)
npx serve .
```

Then visit `http://localhost:8080`.

## ☁️ Deployment

**Vercel**
```bash
npm i -g vercel   # optional CLI
vercel
```
Or drag-and-drop the project folder into the Vercel dashboard. No build command needed — set "Output Directory" to `.`.

**Netlify**
Drag-and-drop the folder onto [app.netlify.com/drop](https://app.netlify.com/drop), or connect the repo with build command `none` and publish directory `.`.

**GitHub Pages**
Push this folder to a repo, then enable Pages on the `main` branch (root).

**Cloudflare Pages**
Connect the repo, set build command to empty and output directory to `.`.

## 🎨 Customization

- Colors & fonts: edit CSS variables at the top of `css/style.css` (`:root`)
- Content: edit the relevant section directly in `index.html`
- Replace `assets/resume.pdf` with your latest resume (keep the same filename, or update the `href` in `index.html`)
- Replace placeholder project icons in `.project-image-placeholder` with real screenshots by swapping the `<div>` for an `<img>` tag
- Update `sitemap.xml` and `robots.txt` with your real production domain before deploying

## ♿ Accessibility & Performance

- Semantic HTML5 landmarks (`header`, `main`, `section`, `footer`, `nav`)
- Reduced-motion friendly: animations rely on transform/opacity for GPU-accelerated performance
- Cursor and hover-only effects are disabled automatically on touch devices
- Particle & geometry counts scale down on smaller viewports for performance

---

Built for **Karumuri Lakshmana Sai** — AI & Data Science Engineer.
