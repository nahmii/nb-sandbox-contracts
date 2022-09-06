import { expect } from "chai";
import { ethers } from "hardhat";
const hre = require("hardhat");

const { BigNumber } = require("@ethersproject/bignumber");

const ETHER = BigNumber.from(10).pow(BigNumber.from(18));
const getTokenValue = (value: number) => BigNumber.from(value).mul(ETHER);

async function main() {
  const cbContractAddress = `${process.env.CB_TOKEN_ADDRESS}`;
  const actorAddress = `${process.env.ACTOR_ADDRESS}`;

  const contract = await ethers.getContractAt("CBToken", cbContractAddress);

  const grantApproval = await contract.approve(
    "0x3dd46dbd61d9015dbed7b28cdcf79857e35229bf",
    getTokenValue(50)
  );
  await grantApproval.wait();
  console.log(
    "allowance",
    await contract.allowance(
      "0x67123583f175ccc1014c4c8a600f3a059d5265d9",
      "0x3dd46dbd61d9015dbed7b28cdcf79857e35229bf"
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
