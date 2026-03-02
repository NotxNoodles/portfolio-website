# Abdullah Qazi — Portfolio Website

A personal portfolio built with a dark gradient theme, scroll-triggered animations, and a password-protected admin panel for managing projects on the fly.

**Live site:** _coming soon (Vercel)_

## Features

- Dark UI with purple-to-cyan gradient accents and smooth scroll animations
- Filterable project cards loaded dynamically from the server
- Resume timeline with downloadable CV
- Contact form (opens email client)
- Admin panel (`/admin.html`) — login to add, edit, or delete projects without touching code

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | HTML, CSS, JavaScript (vanilla) |
| Backend | Node.js, Express |
| Auth | JWT + bcrypt |
| Storage | JSON file (no database) |
| Deployment | Vercel |

## Getting Started

```bash
git clone https://github.com/NotxNoodles/portfolio-website.git
cd portfolio-website
npm install
```

Create a `.env` file in the root:

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<bcrypt hash>
JWT_SECRET=<random secret string>
PORT=3000
```

Generate a password hash:

```bash
node -e "require('bcryptjs').hash('YOUR_PASSWORD', 10).then(h => console.log(h))"
```

Start the server:

```bash
npm start
```

Then open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Import this repo in the [Vercel dashboard](https://vercel.com/new)
2. Add the environment variables (`ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET`) in **Settings → Environment Variables**
3. Deploy — Vercel will use the included `vercel.json` config automatically

## Admin Panel

Navigate to `/admin.html` and sign in with your credentials to manage projects (add, edit, delete) directly from the browser.

## License

MIT
