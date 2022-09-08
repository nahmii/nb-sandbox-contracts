import { ethers } from "hardhat";

async function main() {
  const tokenSwapAddress = `${process.env.TOKEN_SWAP_ADDRESS}`;
  const tokenSwapContract = await ethers.getContractAt(
    "TokenSwap",
    tokenSwapAddress
  );

  const partition1 =
    "0x7265736572766564000000000000000000000000000000000000000000000000"; // "reserved" in hex
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
