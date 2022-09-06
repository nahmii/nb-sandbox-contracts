import { expect } from "chai";
import { ethers } from "hardhat";
const hre = require("hardhat");

async function main() {
  const erc1400ContractAddress = `${process.env.ERC1400_TOKEN_ADDRESS}`;
  const tokenSwapAddress = `${process.env.TOKEN_SWAP_ADDRESS}`;
  const partition =
    "0x7265736572766564000000000000000000000000000000000000000000000000";

  const tokenHolder = "0x86c27807859624B5DaD00c67743A06ed33c8E6b5";

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
