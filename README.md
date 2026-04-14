# DeskTimr

A browser-based productivity app for **tracking sitting vs. standing time** at your desk and running **Pomodoro-style focus sessions**—two modes in one interface.

## What it does

### Desk mode

- **Timer** for your current posture (sitting or standing): **stopwatch** or **countdown**; play, pause, and clear the session.
- **Posture reminders**: optional sounds and notifications when a countdown ends, plus a chime after each full hour spent sitting while the timer runs.
- **Weekly standing goal** and **workweek badges** for gamified consistency.
- **Weekly sitting summary**, rotating **wellness facts**, and an **activity log** (today + week) with optional **Excel export** (`.xlsx`) of your data.
- **Celebrations** (confetti) when you hit standing-time milestones.

### Pomodoro mode

- Classic **Pomodoro / short break / long break** phases with a task list: add tasks, pick an active task for the current focus block, and check items off.

Data for desk mode is stored **locally in the browser** (`localStorage`). The app works as a static site with no backend required.

## Tech stack

| Layer        | Choice |
| ------------ | ------ |
| UI           | [React](https://react.dev/) 19 |
| Language     | [TypeScript](https://www.typescriptlang.org/) |
| Build & dev  | [Vite](https://vite.dev/) 8 |
| Linting      | [ESLint](https://eslint.org/) 9 + TypeScript ESLint |
| Extras       | [canvas-confetti](https://www.npmjs.com/package/canvas-confetti), [SheetJS `xlsx`](https://sheetjs.com/) for spreadsheet export |

## Prerequisites

- **Node.js 20.19+** (see `engines` in `package.json`)

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Other scripts

| Command           | Purpose |
| ----------------- | ------- |
| `npm run build`   | Typecheck and production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint`    | Run ESLint |

## Deploy (e.g. Vercel)

This project is a **static Vite SPA**. Use **Node.js 20.19+** on the host.

1. Push the repo to GitHub (or another Git provider).
2. In [Vercel](https://vercel.com), **Add New → Project** and import the repository.
3. Set **Build Command** to `npm run build` and **Output Directory** to `dist` (Vite defaults are usually correct).
4. Deploy. The included `vercel.json` rewrites routes to `index.html` for client-side routing if you add a router later.

---

Built as a portfolio / open-source project.
