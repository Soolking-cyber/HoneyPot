import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.DEPLOYER_KEY ?? "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    linea: {
      url: process.env.LINEA_RPC_URL ?? "https://rpc.linea.build",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    linea_sepolia: {
      url: process.env.LINEA_SEPOLIA_RPC_URL ?? "https://rpc.sepolia.linea.build",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      linea: process.env.LINEASCAN_API_KEY ?? "",
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_KEY ?? undefined,
  },
};

export default config;
