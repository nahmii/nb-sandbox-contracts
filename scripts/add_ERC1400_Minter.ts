import { ethers } from 'hardhat'

async function main() {
  const erc1400ContractAddress = `${process.env.CBS_TOKEN_ADDRESS}`
  const tokenSwapAddress = `${process.env.TOKEN_SWAP_ADDRESS}`

  const contract = await ethers.getContractAt('ERC1400', erc1400ContractAddress)
  const addMinter = await contract.addMinter(tokenSwapAddress)
  await addMinter.wait()
  console.log('isMinter', await contract.isMinter(tokenSwapAddress))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
