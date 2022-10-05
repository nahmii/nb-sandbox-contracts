import { expect } from 'chai'
import * as hre from 'hardhat'
import { Wallet } from 'ethers'
const { ethers } = hre

const getWei = (value: number) => ethers.utils.parseEther(value.toString())

const transferValues = [
  getWei(10),
  getWei(20),
  getWei(30),
  getWei(40),
  getWei(50),
]

const getTotalTransferValue = () => {
  let total = transferValues[0]
  for (let i = 1; i < transferValues.length; i++) {
    total = total.add(transferValues[i])
  }
  return total
}

const cbsControllers = ['0xBc5C5A1C8AD76d40Ce8742e404a053ecE7B6253c']

const cbsPartitions = [
  '0x7265736572766564000000000000000000000000000000000000000000000000',
  '0x6973737565640000000000000000000000000000000000000000000000000000',
  '0x6c6f636b65640000000000000000000000000000000000000000000000000000',
]

describe('DisperseWithData', function () {
  let signer: any
  let recipients: any
  let recipientsAddresses: any
  let CBToken: any
  let cbToken: any
  let CBSToken: any
  let cbsToken: any
  let DisperseWithData: any
  let disperseWithData: any

  before(async () => {
    ;[signer, ...recipients] = (await hre.ethers.getSigners()).slice(0, 6)
    recipientsAddresses = recipients.map(
      (recipient: Wallet) => recipient.address
    )
    CBToken = await ethers.getContractFactory('CBToken')
    CBSToken = await ethers.getContractFactory('CBSToken')
    DisperseWithData = await ethers.getContractFactory('DisperseWithData')
  })

  beforeEach(async () => {
    cbToken = await CBToken.deploy('CBToken', 'CBT', 18)
    await cbToken.deployed()

    cbsToken = await CBSToken.deploy(
      'CBSToken',
      'CBST',
      1,
      cbsControllers,
      cbsPartitions
    )
    await cbToken.deployed()
    await cbsToken.issue(signer.address, getWei(1_000_000), '0x')

    disperseWithData = await DisperseWithData.deploy()
    await disperseWithData.deployed()
  })

  describe('#getDataLength()', async () => {
    it('should return the length of the messageData state variable', async () => {
      const dataLength = await disperseWithData.getDataLength()
      expect(dataLength).to.equal(ethers.constants.Zero)
    })
  })

  describe('#disperseEther()', async () => {
    let recipientPreBalances: any

    beforeEach(async () => {
      recipientPreBalances = await Promise.all(
        recipients.map((recipient: any) => recipient.getBalance('latest'))
      )
    })

    it('should disperse ETH transfers by direct transfer to recipients', async () => {
      await disperseWithData.disperseEther(
        recipientsAddresses,
        transferValues,
        {
          value: ethers.utils.parseEther('1000'),
        }
      )

      const expectedDataLength = await disperseWithData.getDataLength()
      expect(expectedDataLength).to.equal(ethers.constants.Zero)

      for (const [i, recipient] of recipients.entries()) {
        const postBalance = await recipient.getBalance('latest')
        expect(postBalance).to.equal(
          recipientPreBalances[i].add(transferValues[i])
        )
      }
    })
  })

  describe('#disperseEtherWithData()', async () => {
    let data: any
    let recipientPreBalances: any

    beforeEach(async () => {
      data = ethers.utils.hexlify(ethers.utils.randomBytes(32))
      recipientPreBalances = await Promise.all(
        recipients.map((recipient: any) => recipient.getBalance('latest'))
      )
    })

    it('should disperse ETH transfers by direct transfer to recipients', async () => {
      await disperseWithData.disperseEtherWithData(
        recipientsAddresses,
        transferValues,
        data,
        {
          value: ethers.utils.parseEther('1000'),
        }
      )

      const expectedDataLength = await disperseWithData.getDataLength()
      expect(expectedDataLength).to.equal(ethers.constants.One)
      const expectedData = await disperseWithData.data(ethers.constants.Zero)
      expect(expectedData).to.equal(data)

      for (const [i, recipient] of recipients.entries()) {
        const postBalance = await recipient.getBalance('latest')
        expect(postBalance).to.equal(
          recipientPreBalances[i].add(transferValues[i])
        )
      }
    })
  })

  describe('#disperseToken()', async () => {
    describe('with ERC20 token', async () => {
      beforeEach(async () => {
        await cbToken.approve(disperseWithData.address, getTotalTransferValue())
      })

      it('should disperse ERC20 transfers by direct transfer to recipients', async () => {
        await disperseWithData.disperseToken(
          cbToken.address,
          recipientsAddresses,
          transferValues
        )

        const expectedDataLength = await disperseWithData.getDataLength()
        expect(expectedDataLength).to.equal(ethers.constants.Zero)

        for (const [i, recipient] of recipientsAddresses.entries()) {
          const balance = await cbToken.balanceOf(recipient)
          expect(balance).to.equal(transferValues[i])
        }
      })
    })

    describe('with ERC1400 token', async () => {
      beforeEach(async () => {
        await cbsToken.approve(
          disperseWithData.address,
          getTotalTransferValue()
        )
      })

      it('should disperse ERC1400 transfers by direct transfer to recipients', async () => {
        await disperseWithData.disperseToken(
          cbsToken.address,
          recipientsAddresses,
          transferValues
        )

        const expectedDataLength = await disperseWithData.getDataLength()
        expect(expectedDataLength).to.equal(ethers.constants.Zero)

        for (const [i, recipient] of recipientsAddresses.entries()) {
          const balance = await cbsToken.balanceOf(recipient)
          expect(balance).to.equal(transferValues[i])
        }
      })
    })
  })

  describe('#disperseTokenWithData()', async () => {
    let data: any

    beforeEach(async () => {
      data = ethers.utils.hexlify(ethers.utils.randomBytes(32))
    })

    describe('with ERC20 token', async () => {
      beforeEach(async () => {
        await cbToken.approve(disperseWithData.address, getTotalTransferValue())
      })

      it('should disperse ERC20 transfers by direct transfer to recipients', async () => {
        await disperseWithData.disperseTokenWithData(
          cbToken.address,
          recipientsAddresses,
          transferValues,
          data
        )

        const expectedDataLength = await disperseWithData.getDataLength()
        expect(expectedDataLength).to.equal(ethers.constants.One)
        const expectedData = await disperseWithData.data(ethers.constants.Zero)
        expect(expectedData).to.equal(data)

        for (const [i, recipient] of recipientsAddresses.entries()) {
          const balance = await cbToken.balanceOf(recipient)
          expect(balance).to.equal(transferValues[i])
        }
      })
    })

    describe('with ERC1400 token', async () => {
      beforeEach(async () => {
        await cbsToken.approve(
          disperseWithData.address,
          getTotalTransferValue()
        )
      })

      it('should disperse ERC1400 transfers by direct transfer to recipients', async () => {
        await disperseWithData.disperseTokenWithData(
          cbsToken.address,
          recipientsAddresses,
          transferValues,
          data
        )

        const expectedDataLength = await disperseWithData.getDataLength()
        expect(expectedDataLength).to.equal(ethers.constants.One)
        const expectedData = await disperseWithData.data(ethers.constants.Zero)
        expect(expectedData).to.equal(data)

        for (const [i, recipient] of recipientsAddresses.entries()) {
          const balance = await cbsToken.balanceOf(recipient)
          expect(balance).to.equal(transferValues[i])
        }
      })
    })
  })

  describe('#disperseTokenSimple()', async () => {
    describe('with ERC20 token', async () => {
      beforeEach(async () => {
        await cbToken.approve(disperseWithData.address, getTotalTransferValue())
      })

      it('should disperse ERC20 transfers by direct transfer to recipients', async () => {
        await disperseWithData.disperseTokenSimple(
          cbToken.address,
          recipientsAddresses,
          transferValues
        )

        const expectedDataLength = await disperseWithData.getDataLength()
        expect(expectedDataLength).to.equal(ethers.constants.Zero)

        for (const [i, recipient] of recipientsAddresses.entries()) {
          const balance = await cbToken.balanceOf(recipient)
          expect(balance).to.equal(transferValues[i])
        }
      })
    })

    describe('with ERC1400 token', async () => {
      beforeEach(async () => {
        await cbsToken.approve(
          disperseWithData.address,
          getTotalTransferValue()
        )
      })

      it('should disperse ERC1400 transfers by direct transfer to recipients', async () => {
        await disperseWithData.disperseTokenSimple(
          cbsToken.address,
          recipientsAddresses,
          transferValues
        )

        const expectedDataLength = await disperseWithData.getDataLength()
        expect(expectedDataLength).to.equal(ethers.constants.Zero)

        for (const [i, recipient] of recipientsAddresses.entries()) {
          const balance = await cbsToken.balanceOf(recipient)
          expect(balance).to.equal(transferValues[i])
        }
      })
    })
  })

  describe('#disperseTokenWithDataSimple()', async () => {
    let data: any

    beforeEach(async () => {
      data = ethers.utils.hexlify(ethers.utils.randomBytes(32))
    })

    describe('with ERC20 token', async () => {
      beforeEach(async () => {
        await cbToken.approve(disperseWithData.address, getTotalTransferValue())
      })

      it('should disperse ERC20 transfers by direct transfer to recipients', async () => {
        await disperseWithData.disperseTokenWithDataSimple(
          cbToken.address,
          recipientsAddresses,
          transferValues,
          data
        )

        const expectedDataLength = await disperseWithData.getDataLength()
        expect(expectedDataLength).to.equal(ethers.constants.One)
        const expectedData = await disperseWithData.data(ethers.constants.Zero)
        expect(expectedData).to.equal(data)

        for (const [i, recipient] of recipientsAddresses.entries()) {
          const balance = await cbToken.balanceOf(recipient)
          expect(balance).to.equal(transferValues[i])
        }
      })
    })

    describe('with ERC1400 token', async () => {
      beforeEach(async () => {
        await cbsToken.approve(
          disperseWithData.address,
          getTotalTransferValue()
        )
      })

      it('should disperse ERC1400 transfers by direct transfer to recipients', async () => {
        await disperseWithData.disperseTokenWithDataSimple(
          cbsToken.address,
          recipientsAddresses,
          transferValues,
          data
        )

        const expectedDataLength = await disperseWithData.getDataLength()
        expect(expectedDataLength).to.equal(ethers.constants.One)
        const expectedData = await disperseWithData.data(ethers.constants.Zero)
        expect(expectedData).to.equal(data)

        for (const [i, recipient] of recipientsAddresses.entries()) {
          const balance = await cbsToken.balanceOf(recipient)
          expect(balance).to.equal(transferValues[i])
        }
      })
    })
  })
})
