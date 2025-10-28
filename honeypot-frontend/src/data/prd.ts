export const nftSupply = {
  bees: 124,
  bear: 1,
  supply: 125,
};

export const economics = {
  nftPrice: 10,
  creatorSplit: 0.4,
  potSplit: 0.5,
  bearSplit: 0.1,
  dailyDeposit: 1,
  totalDays: 69,
};

export const liveMetrics = {
  potLinea: 18_420,
  activeBees: 37,
  eliminatedBees: 12,
  currentDay: 18,
  streakLeaders: [
    { wallet: "0xBEE...069", streak: 18 },
    { wallet: "0xC0M...BEE", streak: 17 },
    { wallet: "0xH1V...EEE", streak: 17 },
  ],
  nextCutoff: "2025-06-01T19:00:00Z",
};

export const mintStatus = {
  price: 10,
  mintCurrency: "mUSD",
  totalSupply: 125,
  minted: 92,
  whitelistActive: true,
  publicMintOpens: "2024-11-30T16:00:00Z",
  perks: [
    "Guaranteed Season 01 Bee slot",
    "Keeper bot fee discounts",
    "Bear reveal airdrop eligibility",
    "Legendary Bear NFT receives 10% of mint revenue",
  ],
};

export const gameSettings = {
  totalPlayers: 124,
  totalDays: 69,
  mintPrice: 10,
  mintCurrency: "mUSD",
  mintWindowDays: 7,
  bearSlot: 17,
};

export const hiveSnapshot = {
  bearSlot: 17,
  deposited: [
    1, 2, 3, 5, 6, 9, 11, 13, 17, 19, 21, 22, 25, 31, 33, 37, 42, 48, 52, 57,
  ],
  awaitingDeposit: [
    4, 7, 8, 10, 12, 14, 15, 16, 18, 20, 23, 24, 26, 27, 28, 29, 30,
  ],
  eliminated: [
    32, 34, 35, 36, 38, 39, 40, 41, 43, 44, 45, 46,
  ],
};

export const gameplayLoop = [
  {
    title: "Mint your Bee",
    description:
      "Claim one of 124 Bee NFTs to join the honeycomb. Each Bee is soulbound to your wallet for this season.",
    cta: "Mint Bee",
  },
  {
    title: "Deposit daily",
    description:
      "Commit 1 mUSD every 24h for 69 days. Each day&apos;s mUSD auto-swaps to LINEA before midnight and settles in the HoneyPot contract.",
    cta: "Deposit 1 mUSD",
  },
  {
    title: "Share the pot",
    description:
      "Survive all 69 days to split the accumulated LINEA balance equally with the other Bees.",
    cta: "View Pot",
  },
];

export const potBreakdown = [
  {
    label: "Initial sale → Pot",
    value: 50,
    description: "Half of the mint revenue bootsraps the reward contract on day zero.",
  },
  {
    label: "Daily deposits",
    value: 45,
    description: "Ongoing mUSD commitments auto-convert to LINEA and amplify the pot.",
  },
  {
    label: "Liquid staking yield",
    value: 5,
    description: "Linea staking returns are recycled back into the HoneyPot for survivors.",
  },
];

export const roadmap = [
  {
    phase: "Phase 1",
    label: "Prototype",
    details: [
      "ERC-721 Bee + Bear mint",
      "Reveal automation with Linea RNG",
      "Manual deposit flow",
    ],
    status: "done",
  },
  {
    phase: "Phase 2",
    label: "Beta Launch",
    details: [
      "Automated elimination engine",
      "Realtime dashboards + notifications",
      "Linea testnet dry-run",
    ],
    status: "current",
  },
  {
    phase: "Phase 3",
    label: "Mainnet",
    details: [
      "124 Bee drop",
      "Bear reveal ceremony",
      "Creator & Bear payouts",
    ],
    status: "upcoming",
  },
  {
    phase: "Phase 4",
    label: "Expansion",
    details: [
      "SuperBee power ups",
      "Hive versus hive seasons",
      "DAO vote on Season 2",
    ],
    status: "upcoming",
  },
];

export const faqs = [
  {
    question: "What happens if I miss a daily deposit?",
    answer:
      "Your Bee is flagged inactive immediately and you forfeit any claim to the HoneyPot. Past deposits remain locked in the pot for the survivors.",
  },
  {
    question: "How is the Bear NFT winner selected?",
    answer:
      "Once all 124 Bees are minted, the contract requests randomness from Linea VRF and assigns the Bear to one wallet at reveal.",
  },
  {
    question: "Can I transfer or sell my Bee mid-season?",
    answer:
      "Bees are non-transferable during the season to prevent bypassing elimination. Secondary trading unlocks only after final settlement.",
  },
  {
    question: "Where does the LINEA in the pot come from?",
    answer:
      "Daily mUSD deposits are auto-swapped through the Consensus liquidity route and streamed into the LINEA reward contract.",
  },
];
