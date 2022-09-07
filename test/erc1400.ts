import { ethers } from "hardhat";
const hre = require("hardhat");

const { BigNumber } = require("@ethersproject/bignumber");

describe("Deploy ERC1400", function () {
  let signers: any;
  let controller: any;
  let ERC1400: any;
  let tokenHolder: any;
  let partition1: any;
  let partition2: any;
  let partition3: any;
  let partitions: any;

  before(async () => {
    ERC1400 = await ethers.getContractFactory("ERC1400");
    signers = await hre.ethers.getSigners();
    partition1 =
      "0x7265736572766564000000000000000000000000000000000000000000000000"; // reserved in hex
    partition2 =
      "0x6973737565640000000000000000000000000000000000000000000000000000"; // issued in hex
    partition3 =
      "0x6c6f636b65640000000000000000000000000000000000000000000000000000"; // locked in hex
    partitions = [partition1, partition2, partition3];
  });

  describe("Deploy ERC1400", async () => {
    it("Should deploy erc1400 and issue token", async () => {
      const controller = signers[0].address;
      const erc1400 = await ERC1400.deploy(
        "CBSToken",
        "CBST",
        1,
        [controller],
        partitions,
        1337
      );
      await erc1400.deployed();
      console.log("ERC1400 deployed to:", erc1400.address);
    });
  });
});
