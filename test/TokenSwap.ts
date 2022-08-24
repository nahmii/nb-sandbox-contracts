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
  let TokenSwap: any;
  let tokenSwap: any;
  before(async () => {
    signers = await hre.ethers.getSigners();
    CBToken = await ethers.getContractFactory("CBToken");
    CBSToken = await ethers.getContractFactory("CBSToken");
    TokenSwap = await ethers.getContractFactory("TokenSwap");
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

  describe("TokenSwap", async () => {
    it("Should deploy TokenSwap contract", async () => {
      tokenSwap = await TokenSwap.deploy(cbToken.address, cbsToken.address);
      await tokenSwap.deployed();
      console.log(tokenSwap.address);
    });

    it("approve TokenSwap contract to spend an amount of CBToken", async () => {
      await cbToken.approve(tokenSwap.address, getTokenValue(10));
    });

    it("approve TokenSwap contract to spend an amount of CBSToken", async () => {
      await cbsToken.approve(tokenSwap.address, getTokenValue(10));
    });

    it("grant TokenSwap contract a minter role to mint CBSToken", async () => {
      await cbsToken.grantRole(
        "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
        tokenSwap.address
      );
    });

    it("grant TokenSwap contract a burner role to burn CBSToken", async () => {
      await cbsToken.grantRole(
        "0x3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848",
        tokenSwap.address
      );
    });

    it("it should mutate CBToken to CBSToken and mint CBSToken", async () => {
      await tokenSwap.swapCbToCbs(getTokenValue(10));
      const expected = ethers.utils.formatEther(await cbsToken.totalSupply());
      //   console.log("new tSupply", expected);
      const tokenSwapCbTokenBalance = ethers.utils.formatEther(
        await cbToken.balanceOf(tokenSwap.address)
      );
      //   console.log("tokenSwapCbTokenBalance", tokenSwapCbTokenBalance);

      const senderCbsTokenBalance = ethers.utils.formatEther(
        await cbsToken.balanceOf(signers[0].address)
      );
      //   console.log("senderCbsTokenBalance", senderCbsTokenBalance);
      expect(senderCbsTokenBalance).equal(
        ethers.utils.formatEther(getTokenValue(10))
      );
      expect(tokenSwapCbTokenBalance).equal(ethers.utils.formatEther(getTokenValue(10)));
      //   console.log("token", ethers.utils.formatEther(getTokenValue(10)));
      expect(expected).to.equal(ethers.utils.formatEther(getTokenValue(10)));
    });

    it("it should mutate CBSToken to CBToken and burn CBSToken", async () => {
      await tokenSwap.swapCbsToCb(getTokenValue(10));
      const expected = ethers.utils.formatEther(await cbsToken.totalSupply());
      const tokenSwapCbTokenBalance = ethers.utils.formatEther(
        await cbToken.balanceOf(tokenSwap.address)
      );
      const senderCbsTokenBalance = ethers.utils.formatEther(
        await cbsToken.balanceOf(signers[0].address)
      );

      //   console.log("new tSupply", expected);
      //   console.log("token", ethers.utils.formatEther(getTokenValue(10)));
      expect(senderCbsTokenBalance).equal(
        ethers.utils.formatEther(getTokenValue(0))
      );
      expect(tokenSwapCbTokenBalance).equal(ethers.utils.formatEther(getTokenValue(0)));
      expect(expected).to.equal(ethers.utils.formatEther(getTokenValue(0)));
    });
  });
});
