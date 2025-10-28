import { expect } from "chai";
import { ethers } from "hardhat";

describe("HoneyPotGame", () => {
  it("deploys the suite", async () => {
    const [deployer] = await ethers.getSigners();
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const stake = await MockERC20.deploy("Mock mUSD", "mUSD", ethers.parseUnits("1000", 18));
    await stake.waitForDeployment();

    const Bee = await ethers.getContractFactory("HoneyPotBee");
    const bee = await Bee.deploy("ipfs://unrevealed.json");
    await bee.waitForDeployment();

    const Game = await ethers.getContractFactory("HoneyPotGame");
    const game = await Game.deploy(await stake.getAddress(), await bee.getAddress(), ethers.parseUnits("1", 18));
    await game.waitForDeployment();

    const MINTER_ROLE = await bee.MINTER_ROLE();
    await bee.grantRole(MINTER_ROLE, await game.getAddress());

    expect(await game.dailyAmount()).to.equal(ethers.parseUnits("1", 18));
    expect(await game.seasonStart()).to.be.greaterThan(0);
  });
});
