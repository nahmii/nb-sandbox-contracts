import { ethers } from "hardhat";

async function main() {
  const signer = (await ethers.getSigners())[0];
  const CBTAddress = `${process.env.CB_TOKEN_ADDRESS}`;
  const tokenSwapAddress = `${process.env.TOKEN_SWAP_ADDRESS}`;
  const tokenSwapContract = await ethers.getContractAt(
    "TokenSwap",
    tokenSwapAddress
  );

  const cBTokenContract = await ethers.getContractAt("CBToken", CBTAddress);

  const value = 30;
  const approve = await cBTokenContract.approve(tokenSwapAddress, value);

  await approve.wait();
  console.log(
    "Approved ",
    value,
    "for",
    tokenSwapAddress,
    "on",
    cBTokenContract.address
  );
  console.log(
    tokenSwapAddress,
    "allowance for",
    signer.address,
    "on",
    cBTokenContract.address,
    ": ",
    await cBTokenContract.allowance(signer.address, tokenSwapAddress)
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
  const swap = await tokenSwapContract.swapCbToCbs(
    partition1,
    tokenHolder,
    value,
    ZERO_BYTES32
  );

  await swap.wait();
  console.log("swap", swap);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
