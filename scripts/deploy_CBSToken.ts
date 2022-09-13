import { ethers } from "hardhat";

async function main() {
  const cBSToken = await ethers.getContractFactory("CBSToken");
  const controller = `${process.env.CONTROLLER}`;
  const partition1 = `${process.env.PARTITION_1}`;
  const partition2 = `${process.env.PARTITION_2}`;
  const partition3 = `${process.env.PARTITION_3}`;

  const partitions = [partition1, partition2, partition3];
  const chainID = `${process.env.CHAIN_ID}`;

  const cbsToken = await cBSToken.deploy(
    "CBSToken",
    "CBST",
    1,
    [controller],
    partitions,
    chainID
  );

  await cbsToken.deployed();
  console.log("CBSToken deployed to:", cbsToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
