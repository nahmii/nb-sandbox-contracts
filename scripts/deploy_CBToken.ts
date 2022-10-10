import { ethers } from 'hardhat'

async function main() {
  const tokenName = `${process.env.TOKEN_NAME}`
  const tokenSymbol = `${process.env.TOKEN_SYMBOL}`
  const CBToken = await ethers.getContractFactory('CBToken')
  const token = await CBToken.deploy(tokenName, tokenSymbol, 4)

  await token.deployed()

  console.log('Token deployed to:', token.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
