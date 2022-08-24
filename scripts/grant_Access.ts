import { ethers } from "hardhat";

async function main() {
  const CBSTokenAddress = `${process.env.cBSTokenAddress}`;
  const swapperAddress = `${process.env.swapperAddress}`;

  const CBSToken = await ethers.getContractAt("CBToken", CBSTokenAddress);
  const minterRole =
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
  const burnerRole =
    "0x3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848";
  const grantMinterRole = await CBSToken.grantRole(minterRole, swapperAddress);
  const grantBurnerRole = await CBSToken.grantRole(burnerRole, swapperAddress);
  await grantMinterRole.wait();
  await grantBurnerRole.wait();

  console.log(
    "Swapper has minting role:",
    await CBSToken.hasRole(minterRole, swapperAddress)
  );
  console.log(
    "Swapper has burning role:",
    await CBSToken.hasRole(burnerRole, swapperAddress)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
