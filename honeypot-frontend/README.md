# HoneyPot Monorepo

This repository contains:

- `honeypot-frontend`: Next.js 15 app (React 19) deployed on Vercel
- `contracts`: Hardhat workspace for smart contracts

## Deploy on Vercel

Vercel is configured via the root `vercel.json` to build only the frontend:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rootDirectory": "honeypot-frontend",
  "framework": "nextjs"
}
```

Steps:

1. Push this repo to GitHub.
2. Import the repo into Vercel.
3. Leave install/build settings as defaults. Vercel will auto-detect Next.js.
4. Add any required environment variables in Vercel Project Settings.

## Local Development

Frontend:

```bash
cd honeypot-frontend
npm install
npm run dev
```

Contracts:

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test
```

## Notes

- `.gitignore` excludes `node_modules`, Next.js/Hardhat caches, and `build-info`.
- If the frontend needs ABIs, import them from `contracts/artifacts/` or copy the required JSONs into the frontend.
