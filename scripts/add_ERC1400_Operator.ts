import { expect } from "chai";
import { ethers } from "hardhat";
const hre = require("hardhat");

async function main() {
  const erc1400ContractAddress = `${process.env.CBS_TOKEN_ADDRESS}`;
  const tokenSwapAddress = `${process.env.TOKEN_SWAP_ADDRESS}`;
  const partition = `${process.env.ISSUE_PARTITION}`;

  const tokenHolder = `${process.env.TOKEN_HOLDER}`;

  const contract = await ethers.getContractAt(
    "ERC1400",
    erc1400ContractAddress
  );
  const addOperator = await contract.authorizeOperatorByPartition(
    partition,
    tokenSwapAddress
  );
  await addOperator.wait();
  console.log(
    "isOperator",
    await contract.isOperatorForPartition(
      partition,
      tokenSwapAddress,
      tokenHolder
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
