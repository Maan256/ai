# Bistro Byte Food Ordering App

A full-stack food ordering app with a React frontend and an Express backend.

## Project structure

- `backend/` — REST API for menu data and order creation
- `frontend/` — Vite + React UI

## 1) Install Node.js

Download and install the LTS version from: https://nodejs.org/

Verify it works:

```bash
node -v
npm -v
```

## 2) Install dependencies

From the project root:

```bash
npm install
npm run install:all
```

## 3) Run the app locally

```bash
npm run dev
```

The frontend will run on http://localhost:5173 and the backend on http://localhost:5000.

## 4) Build for production

```bash
npm run build
```

## 5) Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace the GitHub URL with your own repository.

## Notes

- The frontend uses a Vite proxy so it can call the backend without CORS issues.
- The backend stores menu data in memory and accepts new orders in JSON format.
