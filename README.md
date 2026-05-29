<div align="center">
  <img src="app/icon.svg" alt="vow logo" width="120" />
  
  # Handy & Sharon -- Wedding Invitation
  **A wedding invitation website for Handy and Sharon** 💌
  
  [![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![Motion](https://img.shields.io/badge/Motion-0055FF?style=flat-square&logo=framer&logoColor=white)](https://motion.dev/)
  
  [Live Demo](https://your-domain.vercel.app) • [Report a Bug](https://github.com/fernandohalim/vow/issues)
</div>

## Features

* **Personal Invite Links:** open `/?to=ella-and-max` and the site greets them by name, knows their plus-one count, and quietly remembers their answer.
* **Cinematic Editorial Design:** masked text reveals, parallax photography, film grain, and a cover that lifts away like a letter — typeset in cormorant garamond + jost.
* **RSVP that Actually Behaves:** one response per guest, locked across browsers and devices, freely editable when they change their mind. no spreadsheets, no duplicates.
* **Wishes & Blessings:** a public guestbook that guests can write to and edit later, laid out as an asymmetric masonry wall.
* **Live Countdown:** real-time tick down to the exact moment of the ceremony, day after day.
* **WhatsApp Share Generator:** the admin builds a personal invite message per guest — copy, share, sent. opens whatsapp directly in one tap.
* **Private Admin Dashboard:** visit `/manage/<secret>` to search, sort, paginate, see who's pending, and delete with a styled confirmation modal. no login form — just an unguessable url.
* **Lightweight by Default:** next.js server components handle the heavy lifting; the firebase free tier handles everything else. deploys cleanly on Vercel.

## Tech Stack

This project was built with a modern, focused stack:

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
* **Library:** [React 19](https://react.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Animation:** [Motion](https://motion.dev/)
* **Database & Rules:** [Cloud Firestore](https://firebase.google.com/products/firestore)
* **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

You'll need node.js installed, a Firebase project with Firestore enabled (native mode), and a few environment variables ready.

```bash
# clone the repository
git clone https://github.com/fernandohalim/handy-sharon-wedding.git

# jump into the directory
cd handy-sharon-wedding

# install the dependencies
npm install

# add your firebase keys + admin secret to .env.local
# NEXT_PUBLIC_FIREBASE_API_KEY=...
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# NEXT_PUBLIC_FIREBASE_APP_ID=...
# FIREBASE_PROJECT_ID=...
# FIREBASE_CLIENT_EMAIL=...
# FIREBASE_PRIVATE_KEY="..."
# ADMIN_SECRET=...

# start the local development server
npm run dev
```

Then open:

* `/` — the invitation (without `?to=`, you'll see the "honored guest" fallback)
* `/?to=<slug>` — the personal invite for a guest you've added
* `/manage/<ADMIN_SECRET>` — the admin dashboard

Full setup notes (Firestore rules, customising the couple's details, deploying to Vercel) live in the project docs.

## License

This project is licensed under the MIT License — see the **LICENSE** file for details.