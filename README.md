# ChequeCraft (Cheque Generator)

A lightweight React + Vite web/Electron app to create, format, and print cheques with an integrated AI chat assistant for guidance (amounts in words, formatting tips, etc.).

## Features
- __Cheque builder__: form-driven cheque details with PDF/print support
- __AI Chat__: floating assistant with custom greeting and glassy UI
- __Keyboard & UX__: Escape to close chat; click outside panel to dismiss
- __Branding__: Gradient header title (ChequeCraft) and clickable logo
- __Electron packaging__: Build desktop apps for Win/Mac/Linux

## Tech Stack
- __Frontend__: React 18, React Router, TypeScript, Tailwind CSS, Vite
- __PDF__: jsPDF
- __Desktop__: Electron + electron-builder

## Quick Start

Prereqs: Node 18+

```bash
# Install
npm install

# Start web dev server
npm run dev
# Open the printed URL (usually http://localhost:5173)

# Electron during development (runs Vite + Electron)
npm run electron-dev
```

## Available Scripts (`package.json`)
- `dev`: Start Vite dev server
- `build`: Type-check and build production bundle
- `preview`: Preview the production build
- `electron`: Run Electron against current build
- `electron-dev`: Vite dev server + auto-start Electron
- `electron-build`: Build web bundle then launch Electron
- `dist`: Build and package Electron app for all platforms
- `dist-win` | `dist-mac` | `dist-linux`: OS-specific packaging

## Environment Variables (AI)
Set in a `.env` file at the project root or via system env vars.

- `VITE_AI_API_URL`: Your chat API endpoint (if using your own backend)
- `VITE_AI_API_KEY`: Bearer token for `VITE_AI_API_URL`
- `VITE_GEMINI_API_KEY`: Google Generative Language API key (if using Gemini)
- `VITE_GEMINI_MODEL`: Gemini model id (default: `gemini-1.5-flash`)

The chat will pick one of:
1) Custom API (`VITE_AI_API_URL` + `VITE_AI_API_KEY`)
2) Gemini REST (`VITE_GEMINI_API_KEY`)
3) Local demo echo (no keys provided)

## Project Structure
```
project/
├─ src/
│  ├─ components/
│  │  ├─ ChatWidget.tsx          # Floating chat widget
│  │  └─ ...
│  ├─ pages/
│  ├─ config/chequeFields.json
│  ├─ index.css                  # Tailwind + custom styles
│  └─ main.tsx, App.tsx
├─ public/
├─ dist/                         # Vite build output
├─ electron/                     # Electron main & preload
├─ assets/
├─ package.json
└─ README.md
```

## Styling Notes
- Chat header uses gradient brand: `Cheque` + `Craft`
- Initial chat greeting is custom-styled (Hello / How can I help you today?)
- Outside-click and Escape close behavior in `src/components/ChatWidget.tsx`

## Build (Web)
```bash
npm run build
npm run preview  # serve built files
```

## Package (Electron)
```bash
# All platforms (from host OS capabilities)
npm run dist

# Per-OS
npm run dist-win
npm run dist-mac
npm run dist-linux
```
Artifacts are placed in `dist-electron/` (see `build` in `package.json`).

## Troubleshooting
- __Tailwind warnings in editors__: Language servers may flag `@tailwind`/`@apply` in `src/index.css`. Vite build processes them correctly.
- __Blank AI responses__: Ensure env vars are set; check network tab for errors.
- __Electron app not loading dev server__: Use `npm run electron-dev` so Electron waits for Vite.


