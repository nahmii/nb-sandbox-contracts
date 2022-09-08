import { ethers } from "hardhat";

async function main() {
  const tokenSwapAddress = `${process.env.TOKEN_SWAP_ADDRESS}`;
  const tokenSwapContract = await ethers.getContractAt(
    "TokenSwap",
    tokenSwapAddress
  );

  const partition1 =
    "0x7265736572766564000000000000000000000000000000000000000000000000"; // reserved in hex
  const partition2 =
    "0x6973737565640000000000000000000000000000000000000000000000000000"; // issued in hex
  const partition3 =
    "0x6c6f636b65640000000000000000000000000000000000000000000000000000"; // locked in hex
  const ZERO_BYTES32 =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  const DATA =
    "0x1100000000000000000000000000000000000000000000000000000000000000";
  const tokenHolder = `${process.env.TOKEN_HOLDER}`;

  const redeem = await tokenSwapContract.swapCbsToCb(
    partition1,
    tokenHolder,
    10,
    DATA
  );

  await redeem.wait();
  console.log("redeem", redeem);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
