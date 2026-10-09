# The Zero Eight — Coming Soon Website

A responsive, animated one-page site built from the supplied visual reference.

## Files

- `index.html` — semantic page structure and links
- `styles.css` — full styling, responsive breakpoints, visual effects and animations
- `main.js` — reveal motion, animated particles, subtle mouse parallax, and continuously cycling illustrative progress counter and loading bar
- `assets/zero-eight-mark.png` — exact logo artwork extracted from the user-supplied reference image (transparent background)
- `assets/sculpture.webp` — newly generated high-resolution Möbius-lattice 3D sculpture with soft transparency (1380×586)
- `assets/ambient-background.webp` — atmospheric background texture
- `assets/favicon.svg` — matching favicon

## Run locally

Open `index.html` in your browser. No build step, libraries, API keys, or external dependencies are required.

Optionally serve locally for testing:

```sh
python3 -m http.server 8080
```

Then open http://localhost:8080/.

## Publish

Upload `index.html`, `styles.css`, `main.js`, and the complete `assets/` directory to your hosting provider (Netlify, Vercel, cPanel, GitHub Pages, etc.). Preserve file names and paths. Works as a static site.

## Contact buttons

- Instagram: https://www.instagram.com/thezeroeight.in/
- Email: mailto:contact@thezeroeight.in

## Notes

The animated loading bar and percentage begin at 82%, fill to 100%, reset, and repeat. These are **illustrative only**, not live telemetry. The existing brand mark stays consistent with your original screenshot; the new sculpture replaces the pixelated extracted image.

The site honors system `prefers-reduced-motion` settings and its primary links work without JavaScript.
