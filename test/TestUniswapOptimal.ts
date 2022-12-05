import { ethers } from "hardhat";

import { DAI, DAI_WHALE, WETH } from "./config";

describe("TestUniwapOptimal", () => {
  const WHALE = DAI_WHALE;
  const AMOUNT = ethers.BigNumber.from("1000000000000000000000");

  let contract: any, fromToken: any, toToken: any, pair: any;

  beforeEach(async () => {
    fromToken = await ethers.getContractAt("IERC20", DAI);
    toToken = await ethers.getContractAt("IERC20", WETH);
    const Contract = await ethers.getContractFactory("TestUniswapOptimal");
    contract = await Contract.deploy();

    pair = await ethers.getContractAt(
      "IERC20",
      await contract.getPair(fromToken.address, toToken.address)
    );

    fromToken
      .connect(await ethers.getImpersonatedSigner(WHALE))
      .approve(contract.address, AMOUNT);
  });

  const snapshot = async () => {
    return {
      lp: await pair.balanceOf(contract.address),
      fromToken: await fromToken.balanceOf(contract.address),
      toToken: await toToken.balanceOf(contract.address),
    };
  };

  it("Optimal Swap", async () => {
    await contract
      .connect(await ethers.getImpersonatedSigner(WHALE))
      .zap(fromToken.address, toToken.address, AMOUNT);

    const after = await snapshot();

    console.log("lp", after.lp.toString());
    console.log("from", after.fromToken.toString());
    console.log("to", after.toToken.toString());
  });

  it("Sub optimal Swap", async () => {
    await contract
      .connect(await ethers.getImpersonatedSigner(WHALE))
      .subOptimalZap(fromToken.address, toToken.address, AMOUNT);

    const after = await snapshot();

    console.log("lp------", after.lp.toString());
    console.log("from-----", after.fromToken.toString());
    console.log("to-----", after.toToken.toString());
  });
});
