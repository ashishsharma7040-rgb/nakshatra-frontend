# ✦ Nakshatra AI — Frontend

> Vedic Astrology powered by Artificial Intelligence

![React](https://img.shields.io/badge/React-18-61dafb?style=flat&logo=react)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat&logo=vercel)
![PWA](https://img.shields.io/badge/PWA-Ready-purple?style=flat)

---

## What Is This?

Nakshatra AI is a Vedic astrology web app that:
- Generates your Vedic birth chart (Ascendant, planets, houses, nakshatras)
- Calculates your Vimshottari Dasha periods
- Gives AI-powered predictions via Google Gemini
- Provides a daily horoscope based on your personal chart
- Works as a PWA — users can add it to phone home screen like an app

## Live Demo
https://nakshatra-ai.vercel.app

## Tech Stack
- React 18
- CSS-in-JS styling
- Google Fonts (Cinzel Decorative + Cormorant Garamond)
- Razorpay payments
- Deployed on Vercel

## Folder Structure
```
nakshatra-frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── index.js
│   ├── App.jsx        ← All 5 screens
│   └── api.js         ← Backend API connector
└── package.json
```

## Environment Variable (add in Vercel before deploy)
```
REACT_APP_API_URL = https://nakshatra-backend.onrender.com
```

## Run Locally
```
npm install
npm start
```

## Deploy
1. Push to GitHub
2. Import in Vercel
3. Add REACT_APP_API_URL environment variable
4. Deploy

## Related
- Backend repo: https://github.com/YOUR_USERNAME/nakshatra-backend

© 2024 Nakshatra AI — Private
