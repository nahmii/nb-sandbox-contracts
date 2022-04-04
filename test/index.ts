import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("CBToken", function () {
  const NAME = "Bergen";
  const SYMBOL = "BRG";
  const DECIMALS = 6;
  const TOTAL_SUPPLY_DECIMAL = "0".repeat(DECIMALS);
  const INITIAL_TOTAL_SUPPLY = "1000000".concat(TOTAL_SUPPLY_DECIMAL);

  let token: Contract;
  let owner: SignerWithAddress;
  let address1: SignerWithAddress;

  before(async () => {
    [owner, address1] = await ethers.getSigners();

    const CBToken = await ethers.getContractFactory("CBToken");
    token = await CBToken.deploy(NAME, SYMBOL, DECIMALS);

    await token.deployed();
  });

  it("Should return the correct number of decimals", async () => {
    expect(await token.decimals()).to.equal(DECIMALS);
  });

  it("Should return the correct total supply", async () => {
    expect(await token.totalSupply()).to.equal(
      ethers.BigNumber.from(INITIAL_TOTAL_SUPPLY)
    );
  });
});
