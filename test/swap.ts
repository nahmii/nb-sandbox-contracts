import { expect } from "chai";
import { ethers } from "hardhat";
const hre = require("hardhat");

const { BigNumber } = require("@ethersproject/bignumber");

const ETHER = BigNumber.from(10).pow(BigNumber.from(18));
const getTokenValue = (value: number) => BigNumber.from(value).mul(ETHER);

describe("", function () {
  let signers: any;
  let CBToken: any;
  let cbToken: any;
  let cbsToken: any;
  let CBSToken: any;
  let Swap: any;
  let swap: any;
  before(async () => {
    signers = await hre.ethers.getSigners();
    CBToken = await ethers.getContractFactory("CBToken");
    CBSToken = await ethers.getContractFactory("CBSToken");
    Swap = await ethers.getContractFactory("TokenSwap");
  });

  describe("Deploy CBToken", async () => {
    it("Should deploy and mint 1000000  CBToken", async () => {
      cbToken = await CBToken.deploy("CBToken", "CBToken", 18);
      await cbToken.deployed();

      let balance = await cbToken.balanceOf(signers[0].address);
      balance = ethers.utils.formatEther(balance);
      const expected = ethers.utils.formatEther(await cbToken.totalSupply());
      console.log("total supply", expected);
      expect(balance).to.equal(expected);
    });
  });

  describe("Deploy CBSToken", async () => {
    it("Should deploy and total balance should be 0", async () => {
      cbsToken = await CBSToken.deploy("CBToken", "CBToken", 18);
      await cbsToken.deployed();

      let balance = await cbsToken.balanceOf(signers[0].address);
      balance = ethers.utils.formatEther(balance);
      const expected = ethers.utils.formatEther(await cbsToken.totalSupply());
      console.log("nok token total supply", expected);
      expect(balance).to.equal(expected);
    });
  });

  describe("Swap", async () => {
    it("Should deploy Swap contract", async () => {
      swap = await Swap.deploy(cbToken.address, cbsToken.address);
      await swap.deployed();
      console.log(swap.address);
    });

    it("approve swap contract to spend an amount of CBToken", async () => {
      await cbToken.approve(swap.address, getTokenValue(10));
    });

    it("approve swap contract to spend an amount of CBSToken", async () => {
      await cbsToken.approve(swap.address, getTokenValue(10));
    });

    it("grant swap contract a minter role to mint CBSToken", async () => {
      await cbsToken.grantRole(
        "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
        swap.address
      );
    });

    it("grant swap contract a burner role to burn CBSToken", async () => {
      await cbsToken.grantRole(
        "0x3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848",
        swap.address
      );
    });

    it("it should mutate nok to nok-s token", async () => {
      await swap.swapNok(getTokenValue(10));
      const expected = ethers.utils.formatEther(await cbsToken.totalSupply());
      //   console.log("new tSupply", expected);
      const swapNokBalance = ethers.utils.formatEther(
        await cbToken.balanceOf(swap.address)
      );
      //   console.log("swapNokbalace", swapNokBalance);

      const senderNokSBalance = ethers.utils.formatEther(
        await cbsToken.balanceOf(signers[0].address)
      );
      //   console.log("sender", senderNokSBalance);
      expect(senderNokSBalance).equal(
        ethers.utils.formatEther(getTokenValue(10))
      );
      expect(swapNokBalance).equal(ethers.utils.formatEther(getTokenValue(10)));
      //   console.log("token", ethers.utils.formatEther(getTokenValue(10)));
      expect(expected).to.equal(ethers.utils.formatEther(getTokenValue(10)));
    });

    it("it should mutate nok-s to nok token and burn nok-s", async () => {
      await swap.swapNokS(getTokenValue(10));
      const expected = ethers.utils.formatEther(await cbsToken.totalSupply());
      const swapNokBalance = ethers.utils.formatEther(
        await cbToken.balanceOf(swap.address)
      );
      const senderNokSBalance = ethers.utils.formatEther(
        await cbsToken.balanceOf(signers[0].address)
      );

      //   console.log("new tSupply", expected);
      //   console.log("token", ethers.utils.formatEther(getTokenValue(10)));
      expect(senderNokSBalance).equal(
        ethers.utils.formatEther(getTokenValue(0))
      );
      expect(swapNokBalance).equal(ethers.utils.formatEther(getTokenValue(0)));
      expect(expected).to.equal(ethers.utils.formatEther(getTokenValue(0)));
    });
  });
});
