import { expect } from "chai";
import { ethers } from "hardhat";
const hre = require("hardhat");

const { BigNumber } = require("@ethersproject/bignumber");

const ETHER = BigNumber.from(10).pow(BigNumber.from(18));
const getTokenValue = (value: number) => BigNumber.from(value).mul(ETHER);

const values = [
  getTokenValue(10),
  getTokenValue(20),
  getTokenValue(30),
  getTokenValue(40),
  getTokenValue(50),
];

const getTotal = () => {
  let total = values[0];
  for (let i = 1; i < values.length; i++) {
    total = total.add(values[i]);
  }
  return total;
};

describe("Disperse", function () {
  let signers: any;
  let CBToken: any;
  let cbToken: any;
  let Disperse: any;
  let disperse: any;
  let recipients: any;

  before(async () => {
    signers = await hre.ethers.getSigners();
    CBToken = await ethers.getContractFactory("CBToken");
    Disperse = await ethers.getContractFactory("Disperse");
    recipients = [
      signers[1].address,
      signers[2].address,
      signers[3].address,
      signers[4].address,
      signers[5].address,
    ];
  });

  describe("Deploy CBToken", async () => {
    it("Should deploy and mint 1000000  CBToken", async () => {
      cbToken = await CBToken.deploy("CBToken", "CBToken", 18);
      await cbToken.deployed();

      let balance = await cbToken.balanceOf(signers[0].address);
      balance = ethers.utils.formatEther(balance);
      const expected = ethers.utils.formatEther(await cbToken.totalSupply());
      expect(balance).to.equal(expected);
    });
  });

  describe("Disperse Token", async () => {
    it("Should deploy Disperse contract and send approval to withdraw tokens", async () => {
      disperse = await Disperse.deploy();
      await disperse.deployed();
    });

    it("Send approval Disperse contract to withdraw amount and disperse", async () => {
      const approve = await cbToken.approve(disperse.address, getTotal());
    });

    it("Should disperse ERC20 transfers by direct transfer to recipient", async () => {
      const disperseToken = await disperse.disperseToken(
        cbToken.address,
        recipients,
        values
      );
    });

    it("Verify balance of recipients", async () => {
      for (let i = 0; i < recipients.length; i++) {
        let balance = await cbToken.balanceOf(recipients[i]);
        balance = ethers.utils.formatEther(balance);
        const expected = ethers.utils.formatEther(values[i]);

        expect(balance).to.equal(expected);
      }
    });
  });
});