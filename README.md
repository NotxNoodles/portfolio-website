# Abdullah Qazi — Portfolio Website

A personal portfolio built with a dark gradient theme, scroll-triggered animations, and filterable project cards.

**Live site:** https://portfolio-website-7idvmgofz-aaq1795-gmailcoms-projects.vercel.app/

## Features

- Dark UI with purple-to-cyan gradient accents and smooth scroll animations
- Filterable project cards loaded from `public/data/projects.json`
- Resume timeline with downloadable CV
- Contact form (opens email client)
- Fully static — no backend, no database

## Adding / Editing Projects

Edit `public/data/projects.json`. Each project has this shape:

```json
{
  "id": "1",
  "title": "Project Name",
  "description": "Short description of the project.",
  "imageUrl": "https://...",
  "tags": ["React", "Node.js"],
  "githubUrl": "https://github.com/...",
  "liveUrl": "https://...",
  "category": "Web App"
}
```

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | HTML, CSS, JavaScript (vanilla) |
| Data | Static JSON file |
| Deployment | Vercel (static) |


Vibecoded with Cursor

## License

MIT
