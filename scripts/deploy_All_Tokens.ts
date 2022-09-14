import { ethers } from "hardhat";

async function main() {
  // ========DEPLOY CB TOKEN============
  const CBToken = await ethers.getContractFactory("CBToken");
  const cbToken = await CBToken.deploy("CBToken", "CBT", 4);

  await cbToken.deployed();
  console.log("CBToken deployed to:", cbToken.address);

  // ========DEPLOY CBS TOKEN============
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
    4,
    [controller],
    partitions,
    chainID
  );

  await cbsToken.deployed();
  console.log("CBSToken deployed to:", cbsToken.address);

  // ========DEPLOY CBS ERC1400============
  const _cBSToken = await ethers.getContractFactory("ERC1400");
  const _controller = `${process.env.CONTROLLER}`;
  const _partition1 = `${process.env.PARTITION_1}`;
  const _partition2 = `${process.env.PARTITION_2}`;
  const _partition3 = `${process.env.PARTITION_3}`;

  const _partitions = [_partition1, _partition2, _partition3];
  const _chainID = `${process.env.CHAIN_ID}`;

  const _cbsToken = await cBSToken.deploy(
    "CBSToken",
    "CBST",
    4,
    [_controller],
    _partitions,
    _chainID
  );

  await _cbsToken.deployed();
  console.log("CBSToken deployed to:", _cbsToken.address);

  // ========DEPLOY TOKENSWAP ============
  const TokenSwap = await ethers.getContractFactory("TokenSwap");
  const cBTokenAddress = cbToken.address;
  const cBSTokenAddress = cbsToken.address;
  const tokenSwap = await TokenSwap.deploy(cBTokenAddress, cBSTokenAddress);

  await tokenSwap.deployed();
  console.log("TokenSwap deployed to:", tokenSwap.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
