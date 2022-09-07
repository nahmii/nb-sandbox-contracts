import { ethers } from "hardhat";

async function main() {
  // ========DEPLOY CB TOKEN============
  const CBToken = await ethers.getContractFactory("CBToken");
  const cbToken = await CBToken.deploy("CBToken", "CBT", 18);

  await cbToken.deployed();
  console.log("CBToken deployed to:", cbToken.address);

  // ========DEPLOY CBS TOKEN============
  const ERC1400 = await ethers.getContractFactory("ERC1400");
  const controller = `${process.env.CONTROLLER}`;
  const partition1 =
    "0x7265736572766564000000000000000000000000000000000000000000000000"; // reserved in hex
  const partition2 =
    "0x6973737565640000000000000000000000000000000000000000000000000000"; // issued in hex
  const partition3 =
    "0x6c6f636b65640000000000000000000000000000000000000000000000000000"; // locked in hex
  const partitions = [partition1, partition2, partition3];
  const chainID = `${process.env.CHAIN_ID}`;

  const erc1400 = await ERC1400.deploy(
    "CBSToken",
    "CBST",
    1,
    [controller],
    partitions,
    chainID
  );

  await erc1400.deployed();
  console.log("CBSToken deployed to:", erc1400.address);

  // ========DEPLOY TOKENSWAP ============
  const TokenSwap = await ethers.getContractFactory("TokenSwap");
  const cBTokenAddress = cbToken.address;
  const cBSTokenAddress = cbToken.address;
  const tokenSwap = await TokenSwap.deploy(cBTokenAddress, cBSTokenAddress);

  await tokenSwap.deployed();
  console.log("TokenSwap deployed to:", tokenSwap.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
