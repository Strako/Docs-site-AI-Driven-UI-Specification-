# AI-Driven UI Specification — Docs Site

Documentation site for the [AI-Driven UI Specification & QA Automation Suite](https://github.com/Strako/AI-Driven-UI-Specification-QA-Automation-Suite) Claude Code plugin.

Built with **React 18 + Vite**, deployed as a static site via GitHub Pages.

---

## What's inside

| Page | Purpose |
|---|---|
| `/` | Landing — hero, feature overview, and quick-start CTA |
| `/tutorial` | Step-by-step interactive walkthrough (15 animated terminal slides) |
| `/docs` | Full reference documentation with sidebar navigation |

---

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

---

## Project structure

```
src/
├── pages/
│   ├── Landing.jsx       # hero + features
│   ├── Tutorial.jsx      # 15-step animated terminal walkthrough
│   └── Docs.jsx          # full reference docs with sidebar
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── TerminalWindow.jsx  # animated terminal slide renderer
└── data/
    └── slides.js           # tutorial step definitions (phases, terminal lines)
```

---

## Plugin overview

The plugin automates the full UI testing lifecycle inside Claude Code:

```
URL  →  spec-wizard-generate  →  spec file
                                     ↓
                           spec-wizard-improve  (optional)
                                     ↓
                           spec-wizard-pipeline
                                     ↓
                  qa-coordinator  →  test-generation  →  test-cases.md
                                                    →  test-data.md  (you fill)
                                     ↓
                             test-execution  →  test-report.md + screenshots
```

**Key agents**

| Agent | Role |
|---|---|
| `spec-wizard-generate` | Navigates a live page with Playwright MCP and writes a structured spec |
| `spec-wizard-improve` | Interactive 9-section wizard to refine the spec |
| `spec-wizard-pipeline` | Summarizes the spec and launches the QA pipeline |
| `qa-coordinator` | Orchestrates generation → pause → execution |
| `test-generation` | Produces `test-cases.md` + `test-data.md` from the spec |
| `test-execution` | Runs all tests via Playwright MCP and writes the report |

---

## Stack

- React 18 · React Router v6 (hash routing)
- Vite 5
- Mermaid (diagram rendering in Docs)
- Vanilla CSS (no framework)

---

## License

MIT
