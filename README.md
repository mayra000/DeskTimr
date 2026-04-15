# DeskTimr

A browser-based productivity app that combines **desk posture tracking** (sitting vs. standing) with a **Pomodoro timer** and task list. Switch between the two experiences from the header; your choice is remembered for the next visit.

## What it does

### Desk mode (standing timer)

- **Posture**: Track **sitting** or **standing** while the timer runs. Use **Switch to standing / Switch to sitting** to change posture (the current session time resets; if the timer was running, it keeps running).
- **Stopwatch vs. countdown**: **Stopwatch** counts up the time you have been in the current posture. **Countdown** counts down from a target you set. Toggle modes with the clock/stopwatch control; switching modes pauses and clears the current session segment.
- **Countdown editing**: When countdown is selected and the timer is **not** running, set **hours, minutes, and seconds** with number inputs and caret buttons (5-minute-friendly steps for duration changes where applicable).
- **Controls**: **Play** (first press may ask for **browser notification** permission), **Pause**, and **Clear** when paused to zero out the session.
- **Visual feedback**: A **posture-colored background fill** builds as time progresses. The page theme follows **sitting** vs. **standing**.
- **Alerts**:
  - When a **countdown** finishes: **chime** plus a **desktop notification** (if allowed), tailored to sitting vs. standing.
  - While **sitting** with the timer running: a **chime and notification at each full hour** of sitting, with rotating stretch hints.
  - While **standing** with the timer running: **confetti** every **30 minutes** of continuous standing in that session.
- **Weekly sitting summary**: Large display of **time spent sitting this week** (hours / minutes / seconds). **Clear** (with confirmation) wipes saved sitting/standing logs, weekly totals, and resets the desk timer state.
- **Standing goal**: Adjustable **daily standing target** (default **1 hour**, adjustable in **5-minute** steps between **5 minutes** and **8 hours**). Used with **Mon–Fri rings**: each weekday shows progress toward the goal (complete, in-progress ring, missed, or future).
- **Wellness facts**: A **carousel** of short facts with **source links**; facts **auto-advance** on a timer and you can move **previous / next** manually.
- **Activity log** (“Your log”): **Today** and **this week** (Monday-based week) for sitting vs. standing—only time **while the desk timer is running** counts. Export as **JSON** or **Excel** (`.xlsx`).

### Pomodoro mode

- **Phases**: **Pomodoro** (25 min), **short break** (5 min), **long break** (15 min). Use tabs to pick a phase when idle; starting the timer runs the current phase.
- **Flow**: Completing a Pomodoro advances to a **short break**; after every **4th** completed Pomodoro, the next break is a **long break**. Completing a break returns to Pomodoro.
- **Timer**: **START / PAUSE** toggles the countdown; remaining time is kept accurately across pauses.
- **Tasks**: Add tasks (including with **Enter**), **mark done**, **select the active task** for focus (shown during Pomodoro), and **remove** tasks. Tasks (and active selection) persist in the browser.
- **Feedback**: **Confetti** when you finish a Pomodoro. A short **in-app article** explains the Pomodoro Technique with an **external source** link.

### Data & privacy

- **No server**: Everything runs in the browser as a **static site**.
- **Local storage**: Desk session state, logs, goals, and facts index live in **`localStorage`** (desk data). Pomodoro tasks use a **separate** key. **App mode** (desk vs. Pomodoro) is remembered separately.
- Clearing data from the weekly summary **only affects desk-mode** saved data (not Pomodoro tasks).

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
