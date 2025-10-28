import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with", deployer.address);

  const unrevealedURI = "ipfs://QmPlaceholder/unrevealed.json";
  const mUsdAddress = process.env.MUSD_ADDRESS;
  const lineaTokenAddress = process.env.LINEA_TOKEN_ADDRESS;
  const creatorWallet = process.env.CREATOR_WALLET;
  const potMultisig = process.env.POT_MULTISIG;
  const vrfCoordinator = process.env.VRF_COORDINATOR;
  const vrfKeyHash = process.env.VRF_KEY_HASH;
  const vrfSubscriptionId = process.env.VRF_SUBSCRIPTION_ID;
  const vrfConfirmationsEnv = process.env.VRF_REQUEST_CONFIRMATIONS;
  const vrfCallbackGasLimitEnv = process.env.VRF_CALLBACK_GAS_LIMIT;

  if (!mUsdAddress || !lineaTokenAddress || !creatorWallet || !potMultisig || !vrfCoordinator || !vrfKeyHash || !vrfSubscriptionId) {
    throw new Error("Missing required environment variables");
  }

  const vrfRequestConfirmations = vrfConfirmationsEnv ? Number(vrfConfirmationsEnv) : 3;
  const vrfCallbackGasLimit = vrfCallbackGasLimitEnv ? Number(vrfCallbackGasLimitEnv) : 300_000;

  if (!Number.isInteger(vrfRequestConfirmations) || vrfRequestConfirmations <= 0) {
    throw new Error("VRF_REQUEST_CONFIRMATIONS must be a positive integer");
  }

  if (!Number.isInteger(vrfCallbackGasLimit) || vrfCallbackGasLimit <= 0) {
    throw new Error("VRF_CALLBACK_GAS_LIMIT must be a positive integer");
  }

  const HoneyPotBee = await ethers.getContractFactory("HoneyPotBee");
  const bee = await HoneyPotBee.deploy(unrevealedURI);
  await bee.waitForDeployment();
  console.log("Bee collection deployed at", await bee.getAddress());

  const dailyAmount = ethers.parseUnits("1", 18);
  const HoneyPotGame = await ethers.getContractFactory("HoneyPotGame");
  const game = await HoneyPotGame.deploy(mUsdAddress, await bee.getAddress(), dailyAmount);
  await game.waitForDeployment();
  console.log("Game deployed at", await game.getAddress());

  const TreasurySplitter = await ethers.getContractFactory("TreasurySplitter");
  const splitter = await TreasurySplitter.deploy(
    potMultisig,
    creatorWallet,
    await bee.getAddress(),
    vrfCoordinator,
    vrfKeyHash,
    BigInt(vrfSubscriptionId),
    vrfRequestConfirmations,
    vrfCallbackGasLimit
  );
  await splitter.waitForDeployment();
  console.log("Splitter deployed at", await splitter.getAddress());

  const ConversionAdapter = await ethers.getContractFactory("ConversionAdapter");
  const adapter = await ConversionAdapter.deploy(mUsdAddress, lineaTokenAddress, await game.getAddress());
  await adapter.waitForDeployment();
  console.log("Adapter deployed at", await adapter.getAddress());

  const MINTER_ROLE = await bee.MINTER_ROLE();
  await (await bee.grantRole(MINTER_ROLE, await game.getAddress())).wait();
  console.log("Game granted MINTER_ROLE");

  const OPERATOR_ROLE = await adapter.OPERATOR_ROLE();
  await (await adapter.grantRole(OPERATOR_ROLE, deployer.address)).wait();
  console.log("Deployer granted adapter OPERATOR_ROLE");

  await (await bee.grantRole(await bee.DEFAULT_ADMIN_ROLE(), deployer.address)).wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
