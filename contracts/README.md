# HoneyPot Contracts

Smart contract workspace for the HoneyPot staking game on Consensus + Linea.

## Packages

- `HoneyPotBee.sol` – ERC-721 collection for 999 Bee NFTs plus the hidden Bear.
- `HoneyPotGame.sol` – core staking logic that enforces 1 mUSD daily deposits and survivor rewards.
- `TreasurySplitter.sol` – splits mint revenue (50% pot, 40% creator) and routes 10% to a VRF-selected Bee holder.
- `ConversionAdapter.sol` – adapter that hands off converted LINEA liquidity into the pot treasury.

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Copy `.env.example`

   ```bash
   cp .env.example .env
   ```

   | Variable | Description |
   | --- | --- |
   | `DEPLOYER_KEY` | Private key for deployments (0x-prefixed). |
   | `MUSD_ADDRESS` | Consensus mUSD ERC-20 address. |
   | `LINEA_TOKEN_ADDRESS` | LINEA token address used for payouts. |
  | `POT_MULTISIG` | Multisig that escrows the HoneyPot rewards. |
  | `CREATOR_WALLET` | Creator fee recipient. |
  | `VRF_COORDINATOR` | Chainlink VRF coordinator on Linea. |
  | `VRF_KEY_HASH` | Key hash for the VRF job you are using. |
  | `VRF_SUBSCRIPTION_ID` | Subscription funding the VRF request (uint64). |
  | `VRF_REQUEST_CONFIRMATIONS` | Minimum confirmations before VRF fulfillment (defaults to 3). |
  | `VRF_CALLBACK_GAS_LIMIT` | Gas limit allocated to the VRF callback. |
  | `LINEA_RPC_URL` | Linea mainnet RPC endpoint. |
  | `LINEA_SEPOLIA_RPC_URL` | Linea Sepolia/testnet RPC endpoint. |

3. Compile contracts

   ```bash
   npm run compile
   ```

4. Deploy

   ```bash
   npm run deploy:sepolia
   ```

   The deploy script wires up the Bee collection, Game, Treasury Splitter, and Conversion Adapter contracts.

## Tests

Test scaffolding lives in `test/`. Add Forge/Hardhat tests to simulate deposits, eliminations, and reward claims before production launches.
