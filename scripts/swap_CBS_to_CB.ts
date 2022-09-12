import { ethers } from "hardhat";

const { BigNumber } = require("@ethersproject/bignumber");

const ETHER = BigNumber.from(10).pow(BigNumber.from(18));
const getTokenValue = (value: number) => BigNumber.from(value).mul(ETHER);

async function main() {
  const tokenSwapAddress = `${process.env.TOKEN_SWAP_ADDRESS}`;
  const tokenSwapContract = await ethers.getContractAt(
    "TokenSwap",
    tokenSwapAddress
  );
  const partition = `${process.env.ISSUE_PARTITION}`;
  const operatorData = `${process.env.OPERATOR_DATA}`;
  const tokenHolder = `${process.env.TOKEN_HOLDER}`;
  const value = getTokenValue(50);

  const redeem = await tokenSwapContract.swapCbsToCb(
    partition,
    tokenHolder,
    value,
    operatorData
  );

  await redeem.wait();
  console.log("redeem", redeem);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
