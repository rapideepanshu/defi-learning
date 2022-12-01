import { ethers } from "hardhat";
import { WETH, WETH_WHALE, DAI, DAI_WHALE } from "./config";
describe("TestUniswapLiquidity", () => {
  const TOKEN_A = WETH;
  const TOKEN_A_WHALE = WETH_WHALE;
  const TOKEN_B = DAI;
  const TOKEN_B_WHALE = DAI_WHALE;
  const TOKEN_A_AMOUNT = ethers.BigNumber.from("1000000000000000000");
  const TOKEN_B_AMOUNT = ethers.BigNumber.from("1000000000000000000");

  let tokenA: any, tokenB: any, contract: any, CALLER: any;
  beforeEach(async () => {
    [CALLER] = await ethers.getSigners();
    tokenA = await ethers.getContractAt("IERC20", TOKEN_A);
    tokenB = await ethers.getContractAt("IERC20", TOKEN_B);

    const Contract = await ethers.getContractFactory("TestUniswapLiquidity");
    contract = await Contract.deploy();
    await contract.deployed();

    await tokenA
      .connect(await ethers.getImpersonatedSigner(TOKEN_A_WHALE))
      .transfer(CALLER.address, TOKEN_A_AMOUNT);
    await tokenB
      .connect(await ethers.getImpersonatedSigner(TOKEN_B_WHALE))
      .transfer(CALLER.address, TOKEN_B_AMOUNT);

    await tokenA.connect(CALLER).approve(contract.address, TOKEN_A_AMOUNT);

    await tokenB.connect(CALLER).approve(contract.address, TOKEN_B_AMOUNT);
  });

  it("add liquidity and remove liquidity", async () => {
    let tx = await contract
      .connect(CALLER)
      .addLiquidity(
        tokenA.address,
        tokenB.address,
        TOKEN_A_AMOUNT,
        TOKEN_B_AMOUNT
      );
    const tx_completed = await tx.wait();
    tx_completed.events.forEach((element) => {
      if (element.event) {
        console.log(element);
      }
    });

    let txr = await contract
      .connect(CALLER)
      .removeLiquidity(tokenA.address, tokenB.address);

    const txr_completed = await tx.wait();
    txr_completed.events.forEach((element) => {
      if (element.event) {
        console.log(element);
      }
    });
  });
});
