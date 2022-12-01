import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      forking: {
        url: "https://mainnet.infura.io/v3/391511e84300430abbe0b3b240b16a0f",
      },
    },
  },
};

export default config;
