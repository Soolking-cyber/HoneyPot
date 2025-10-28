# HoneyPot Game Frontend

A Next.js frontend for the HoneyPot Game - a blockchain-based NFT game where players can collect and trade bee NFTs.

## Features

- 🐝 Bee NFT Collection and Trading
- 🌐 Web3 Integration with RainbowKit and Wagmi
- 🎨 Modern UI with Tailwind CSS
- ⚡ Next.js 15 with App Router
- 🔗 Blockchain connectivity

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: RainbowKit, Wagmi, Viem
- **Animation**: React Lottie Player
- **Icons**: Lucide React

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── landing/         # Landing page components
│   ├── layout/          # Layout components
│   ├── sections/        # Page sections
│   └── ui/              # UI components
├── data/                # Static data
└── lib/                 # Utility functions
```

## Deployment

This project lives at the repository root. Deploying to Vercel only needs the
default Next.js settings:

1. Push your code to GitHub.
2. Create a new Vercel project and select the repo.
3. Accept the default install/build commands—Vercel auto-detects Next.js.
4. Add the required environment variables (see below) for Preview and Production.
5. Trigger a deploy—every push to `main` will rebuild automatically.

## Environment Variables

Make sure to set up:

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` – WalletConnect/AppKit project ID.

## Contracts Workspace

The Hardhat project remains in `contracts/`. Change into that directory for any
solidity work:

```bash
cd contracts
npm install
npx hardhat test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
