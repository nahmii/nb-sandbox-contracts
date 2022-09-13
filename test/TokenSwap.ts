import {expect} from "chai";
import {ethers} from "hardhat";

const hre = require("hardhat");

const PARTITION_1 = "0x7265736572766564000000000000000000000000000000000000000000000000"; // "reserved" in hex
const PARTITION_2 = "0x6973737565640000000000000000000000000000000000000000000000000000"; // "issued" in hex
const PARTITION_3 = "0x6c6f636b65640000000000000000000000000000000000000000000000000000"; // "locked" in hex
const defaultPartitions = [PARTITION_1, PARTITION_2, PARTITION_3];

const DECIMALS = 4;

describe.skip("TokenSwap", function () {
    let provider: any;
    let signer: any;
    let CBToken: any;
    let cbToken: any;
    let cbsToken: any;
    let CBSToken: any;
    let TokenSwap: any;
    let tokenSwap: any;

    let value = ethers.utils.parseUnits('10', DECIMALS);
    let cbTokenTotalSupply: any;

    before(async () => {
        provider = hre.ethers.provider;
        signer = (await hre.ethers.getSigners())[0];
        CBToken = await ethers.getContractFactory("CBToken");
        CBSToken = await ethers.getContractFactory("ERC1400");
        TokenSwap = await ethers.getContractFactory("TokenSwap");

        cbToken = await CBToken.deploy("CBToken", "CBT", DECIMALS);
        await cbToken.deployed();

        const {chainId} = await provider.getNetwork();
        cbsToken = await CBSToken.deploy("CBSToken", "CBST", DECIMALS, [signer.address], defaultPartitions, chainId);
        await cbsToken.deployed();

        cbTokenTotalSupply = await cbToken.totalSupply();
        console.log("CB token total supply", ethers.utils.formatUnits(cbTokenTotalSupply, DECIMALS));
        expect(await cbToken.balanceOf(signer.address)).to.equal(cbTokenTotalSupply);

        const cbsTokenTotalSupply = await cbsToken.totalSupply();
        console.log("CBS token total supply", ethers.utils.formatUnits(cbsTokenTotalSupply, DECIMALS));
        expect(cbsTokenTotalSupply).to.equal(ethers.constants.Zero)
        expect(await cbsToken.balanceOf(signer.address)).to.equal(ethers.constants.Zero);
    });

    it("Should deploy TokenSwap contract", async () => {
        tokenSwap = await TokenSwap.deploy(cbToken.address, cbsToken.address);
        await tokenSwap.deployed();
    });

    it("Should approve TokenSwap contract to spend an amount of CBToken", async () => {
        await cbToken.approve(tokenSwap.address, value);
    });

    it("Should grant TokenSwap contract a minter role to mint/issue CBSToken", async () => {
        await cbsToken.addMinter(tokenSwap.address);
    });

    it("Should set TokenSwap contract as controller of CBSToken", async () => {
        await cbsToken.authorizeOperatorByPartition(PARTITION_2, tokenSwap.address);
    });

    it("Should transfer CB tokens to the swap contract and issue CBS tokens", async () => {
        await tokenSwap.swapCbToCbs(PARTITION_2, value, ethers.constants.HashZero);

        expect(await cbToken.balanceOf(signer.address)).to.equal(cbTokenTotalSupply.sub(value));
        expect(await cbToken.balanceOf(tokenSwap.address)).to.equal(value);
        expect(await cbsToken.balanceOf(signer.address)).to.equal(value);
    });

    it("Should redeem CBS tokens and transfer CB tokens to msg.sender", async () => {
        await tokenSwap.swapCbsToCb(PARTITION_2, value, ethers.constants.HashZero);

        expect(await cbToken.balanceOf(signer.address)).to.equal(cbTokenTotalSupply);
        expect(await cbToken.balanceOf(tokenSwap.address)).to.equal(ethers.constants.Zero);
        expect(await cbsToken.balanceOf(signer.address)).to.equal(ethers.constants.Zero);
    });
});
