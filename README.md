# Abdullah Qazi — Portfolio Website

A personal portfolio built with a dark gradient theme, scroll-triggered animations, and filterable project cards.

**Live site:** _coming soon (Vercel)_

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

Commit, push, and Vercel will redeploy automatically.

## Local Development

Open `public/index.html` directly in a browser, or serve the `public/` folder with any static server:

```bash
npx serve public
```

## Deploying to Vercel

1. Import this repo in the [Vercel dashboard](https://vercel.com/new)
2. Vercel will detect the `vercel.json` and serve the `public/` directory
3. Deploy — no environment variables needed

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | HTML, CSS, JavaScript (vanilla) |
| Data | Static JSON file |
| Deployment | Vercel (static) |

## License

MIT
