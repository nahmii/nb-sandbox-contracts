import { expect } from "chai";
import { ethers } from "hardhat";
import { ERC1400 } from "../typechain";
const hre = require("hardhat");

const { BigNumber } = require("@ethersproject/bignumber");

// const ETHER = BigNumber.from(10).pow(BigNumber.from(18));
// const getTokenValue = (value: number) => BigNumber.from(value).mul(ETHER);

// const values = [
//   getTokenValue(10),
//   getTokenValue(20),
//   getTokenValue(30),
//   getTokenValue(40),
//   getTokenValue(50),
// ];

// const getTotal = () => {
//   let total = values[0];
//   for (let i = 1; i < values.length; i++) {
//     total = total.add(values[i]);
//   }
//   return total;
// };

describe("Disperse", function () {
  let signers: any;
  let controller: any;
  let ERC1400: any;
  let tokenHolder: any;
  let ZERO_BYTES32: any;
  let issuanceAmount: any;
  let partition1: any;
  let partition2: any;
  let partition3: any;
  let partitions: any;

  before(async () => {
    ERC1400 = await ethers.getContractFactory("ERC1400");
    signers = await hre.ethers.getSigners();
  });

  describe("Deploy ERC1400", async () => {
    it("Should deploy erc1400 and issue token", async () => {
      const controller = signers[0].address;
      const tokenHolder = signers[0].address;
      const ZERO_BYTES32 =
        "0x0000000000000000000000000000000000000000000000000000000000000000";
      const issuanceAmount = 1;

      const partition1 =
        "0x7265736572766564000000000000000000000000000000000000000000000000"; // reserved in hex
      const partition2 =
        "0x6973737565640000000000000000000000000000000000000000000000000000"; // issued in hex
      const partition3 =
        "0x6c6f636b65640000000000000000000000000000000000000000000000000000"; // locked in hex
      const partitions = [partition1, partition2, partition3];
      const erc1400 = await ERC1400.deploy(
        "CBSToken",
        "CBST",
        1,
        [controller],
        partitions
        // { gasLimit: 30000000 }
      );
      await erc1400.deployed();
      console.log("ERC1400 deployed to:", erc1400.address);
      //   await erc1400.issueByPartition(partition1, tokenHolder, 1, ZERO_BYTES32);
    });
  });
});
