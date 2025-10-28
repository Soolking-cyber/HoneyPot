import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

async function deploySplitterFixture() {
  const [deployer, pot, creator, alice, bob] = await ethers.getSigners();

  const HoneyPotBee = await ethers.getContractFactory("HoneyPotBee");
  const bee = await HoneyPotBee.deploy("ipfs://placeholder");
  await bee.waitForDeployment();

  const minterRole = await bee.MINTER_ROLE();
  await bee.grantRole(minterRole, deployer.address);

  await bee.mintBee(alice.address);
  await bee.mintBee(bob.address);

  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const token = await MockERC20.deploy("Mock USD", "mUSD", ethers.parseUnits("1000", 18));
  await token.waitForDeployment();

  const VRFCoordinatorV2Mock = await ethers.getContractFactory(
    "contracts/mocks/VRFCoordinatorV2Mock.sol:VRFCoordinatorV2Mock"
  );
  const baseFee = ethers.parseUnits("0.25", 18);
  const gasPriceLink = ethers.parseUnits("1", 9);
  const vrfCoordinator = await VRFCoordinatorV2Mock.deploy(baseFee, gasPriceLink);
  await vrfCoordinator.waitForDeployment();

  const subId = await vrfCoordinator.createSubscription.staticCall();
  await vrfCoordinator.createSubscription();
  await vrfCoordinator.fundSubscription(subId, ethers.parseUnits("10", 18));

  const keyHash = ethers.keccak256(ethers.toUtf8Bytes("test-key-hash"));
  const requestConfirmations = 3;
  const callbackGasLimit = 500_000;

  const TreasurySplitter = await ethers.getContractFactory("TreasurySplitter");
  const splitter = await TreasurySplitter.deploy(
    pot.address,
    creator.address,
    await bee.getAddress(),
    await vrfCoordinator.getAddress(),
    keyHash,
    subId,
    requestConfirmations,
    callbackGasLimit
  );
  await splitter.waitForDeployment();

  await vrfCoordinator.addConsumer(subId, await splitter.getAddress());

  return { deployer, pot, creator, alice, bob, bee, token, splitter, vrfCoordinator, subId };
}

describe("TreasurySplitter", function () {
  it("selects a random bear and pays out ERC20 rewards", async function () {
    const { deployer, pot, creator, bob, token, splitter, vrfCoordinator } = await loadFixture(deploySplitterFixture);

    const depositAmount = ethers.parseUnits("100", 18);
    await token.connect(deployer).approve(await splitter.getAddress(), depositAmount);

    await expect(splitter.connect(deployer).splitToken(await token.getAddress(), depositAmount))
      .to.emit(splitter, "TokenSplit")
      .withArgs(await token.getAddress(), depositAmount);

    expect(await token.balanceOf(pot.address)).to.equal(ethers.parseUnits("50", 18));
    expect(await token.balanceOf(creator.address)).to.equal(ethers.parseUnits("40", 18));
    expect(await splitter.bearTokenBalances(await token.getAddress())).to.equal(ethers.parseUnits("10", 18));

    const expectedRequestId = await splitter.requestBearSelection.staticCall();
    await splitter.requestBearSelection();

    await expect(
      vrfCoordinator.fulfillRandomWordsWithOverride(
        expectedRequestId,
        await splitter.getAddress(),
        [BigInt(5)]
      )
    ).to.emit(splitter, "BearSelected");

    expect(await splitter.bearWinner()).to.equal(bob.address);
    expect(await splitter.bearTokenBalances(await token.getAddress())).to.equal(0n);
    expect(await token.balanceOf(bob.address)).to.equal(ethers.parseUnits("10", 18));
  });

  it("routes deposits made after selection directly to the winner", async function () {
    const { deployer, pot, creator, bob, token, splitter, vrfCoordinator } = await loadFixture(deploySplitterFixture);

    const firstDeposit = ethers.parseUnits("100", 18);
    await token.connect(deployer).approve(await splitter.getAddress(), firstDeposit);
    await splitter.connect(deployer).splitToken(await token.getAddress(), firstDeposit);

    const expectedRequestId = await splitter.requestBearSelection.staticCall();
    await splitter.requestBearSelection();
    await vrfCoordinator.fulfillRandomWordsWithOverride(expectedRequestId, await splitter.getAddress(), [BigInt(5)]);

    const secondDeposit = ethers.parseUnits("20", 18);
    await token.connect(deployer).approve(await splitter.getAddress(), secondDeposit);

    const bobBalanceBefore = await token.balanceOf(bob.address);

    await splitter.connect(deployer).splitToken(await token.getAddress(), secondDeposit);

    expect(await token.balanceOf(pot.address)).to.equal(ethers.parseUnits("60", 18));
    expect(await token.balanceOf(creator.address)).to.equal(ethers.parseUnits("48", 18));
    expect(await splitter.bearTokenBalances(await token.getAddress())).to.equal(0n);
    expect(await token.balanceOf(bob.address)).to.equal(bobBalanceBefore + ethers.parseUnits("2", 18));
  });
});
