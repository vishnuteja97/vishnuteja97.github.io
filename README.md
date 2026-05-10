# Vishnu Bondalakunta — Portfolio

Static single-page portfolio styled with the Neon design system (electric lime + cyan on a dark surface). No build step.

## Run locally

Any static file server works. Examples:

```bash
# Python (built in)
cd /home/v/vishnub/portfolio
python3 -m http.server 5173

# Or Node (no install needed if you have npx)
npx serve -l 5173 .
```

Then open http://localhost:5173.

## Deploy

Drop the entire folder onto any static host:

- **GitHub Pages** — push to a repo and enable Pages on the root.
- **Netlify / Vercel / Cloudflare Pages** — point the project at this folder; no build command, publish dir = `/`.

## File map

```
portfolio/
├── index.html              # all content lives here, in semantic sections
├── styles/
│   ├── tokens.css          # Neon design tokens (colors, spacing, type, glow)
│   ├── base.css            # reset, fonts, typography, layout primitives
│   └── components.css      # nav, hero, cards, chips, buttons, timeline, footer
├── scripts/
│   └── main.js             # nav toggle, project filter, IntersectionObserver
├── assets/
│   └── icons/              # (currently inline SVGs in index.html)
└── README.md
```

## Editing content

All copy lives in `index.html`. The most common edits:

| What you want to change   | Where                                                              |
| ------------------------- | ------------------------------------------------------------------ |
| Name, role, hero tagline  | `<section id="hero">` near the top of `index.html`                 |
| About paragraph + chips   | `<section id="about">`                                             |
| Projects (9 cards)        | `<section id="projects">` — each is an `<article class="card">`   |
| Project filter tags       | `data-tags="..."` attribute on each project article                |
| Skills buckets            | `<section id="skills">`                                            |
| Education timeline        | `<section id="education">`                                         |
| Research / presentations  | `<section id="research">`                                          |
| Contact links             | `<section id="contact">` — Email, GitHub, LinkedIn cards          |
| Color tokens / glow       | `styles/tokens.css`                                                |

### Adding a project

Copy any `<article class="card project-card">` block in the projects section and update the title, dates, institution, bullets, and `data-tags`. Filter chips automatically pick up any tag listed in the chip rail.

### Editing social links

The Contact section has three live cards: email (`mailto:vteja.bon997@gmail.com`),
GitHub (`https://github.com/vishnuteja97`), and LinkedIn
(`https://www.linkedin.com/in/vishnu-bondalakunta-613464142/`). To change them, edit
the `<a class="card contact-card">` blocks in `<section id="contact">`.

### Adding a resume link

To add a CV button, drop `resume.pdf` at `/home/v/vishnub/portfolio/resume.pdf` and
add a `<a class="btn btn-ghost" href="resume.pdf">Download CV</a>` next to the
existing buttons inside `.hero-actions`.

## Design system

Tokens follow the Neon skill foundations:

- **Colors**: primary `#BBF351` (lime), secondary `#00BCFF` (cyan), success `#16A34A`, warning `#D97706`, danger `#DC2626`. Dark surfaces (`#0A0E1A` bg, `#111827` cards) chosen so the glow effects read well.
- **Typography**: STIX Two Text (display), Roboto (body), Source Code Pro (chips/code).
- **Spacing scale**: 4 / 8 / 12 / 16 / 24 / 32.
- **Type scale**: 14 / 16 / 18 / 24 / 32 / 40.

A light theme is wired into `styles/tokens.css` under `[data-theme="light"]` for future use; the page currently runs dark.

## Accessibility

- Skip-to-main link is the first focusable element.
- All interactive elements have a visible 2px focus ring (offset 3px).
- Animations (name pulse, reveal-on-scroll) are gated by `prefers-reduced-motion`.
- Semantic landmarks: `header`, `nav`, `main`, `section`, `article`, `footer`. Icon-only links carry `aria-label`.
