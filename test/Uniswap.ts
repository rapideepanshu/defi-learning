import { ethers } from "hardhat";
import { describe } from "mocha";

describe("TestUniswap", () => {
  const getAccounts = async () => {
    const [addr1] = await ethers.getSigners();
    return addr1.address;
  };

  const DAI_WHALE = "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d";
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";

  const addr1 = getAccounts();

  const WHALE = DAI_WHALE;
  const AMOUNT_IN = ethers.BigNumber.from("10000000000000000000000");
  const AMOUNT_OUT_MIN = 1;
  const TOKEN_IN = DAI;
  const TOKEN_OUT = WBTC;
  const TO = addr1;

  it("Should swap", async () => {
    const tokenIn = await ethers.getContractAt("IERC20", TOKEN_IN);
    const tokenOut = await ethers.getContractAt("IERC20", TOKEN_OUT);
    const testUniswap = await ethers.getContractFactory("TestUniswap");
    const uniswap = await testUniswap.deploy();
    await uniswap.deployed();
    const address = uniswap.address;

    await tokenIn
      .connect(await ethers.getImpersonatedSigner(WHALE))
      .approve(address, AMOUNT_IN);

    await uniswap
      .connect(await ethers.getImpersonatedSigner(WHALE))
      .swap(tokenIn.address, tokenOut.address, AMOUNT_IN, AMOUNT_OUT_MIN, TO);

    console.log(`in ${AMOUNT_IN}`);
    console.log(`out ${await tokenOut.balanceOf(TO)}`);
  });
});
