import { ethers } from "hardhat";

async function main() {
  const CBSToken = await ethers.getContractFactory("ERC1400");
  const controller = `${process.env.CONTROLLER}`;
  const partition1 =
    "0x7265736572766564000000000000000000000000000000000000000000000000"; // reserved in hex
  const partition2 =
    "0x6973737565640000000000000000000000000000000000000000000000000000"; // issued in hex
  const partition3 =
    "0x6c6f636b65640000000000000000000000000000000000000000000000000000"; // locked in hex
  const partitions = [partition1, partition2, partition3];
  const chainID = `${process.env.CHAIN_ID}`;

  const cBSToken = await CBSToken.deploy(
    "CBSToken",
    "CBST",
    1,
    [controller],
    partitions,
    chainID
  );

  await cBSToken.deployed();

  console.log("Token deployed to:", cBSToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
