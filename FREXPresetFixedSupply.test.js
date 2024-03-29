const { BN, constants, expectEvent, createContract, account } = require("@bininvest/frex-test-helpers");
const { ZERO_ADDRESS_ETH } = constants;

const { expect } = require("chai");

const FREXPresetFixedSupply = artifacts.require("FREXPresetFixedSupply");

contract("FREXPresetFixedSupply", function (accounts) {
    const [deployer, owner] = accounts;

    const name = "Freedom";
    const symbol = "FREX";

    const initialSupply = new BN("50000");
    const amount = new BN("10000");

    before(async function () {
        account.setDefault(deployer);
        this.token = await createContract(FREXPresetFixedSupply, name, symbol, initialSupply.toFixed(), owner);
    });

    it("deployer has the balance equal to initial supply", async function () {
        expect(BN.fromHex(await this.token.balanceOf(owner).call())).to.be.bignumber.equal(initialSupply);
    });

    it("total supply is equal to initial supply", async function () {
        expect(BN.fromHex(await this.token.totalSupply().call())).to.be.bignumber.equal(initialSupply);
    });

    describe("burning", function () {
        it("holders can burn their tokens", async function () {
            account.setDefault(owner);
            const remainingBalance = initialSupply.minus(amount);
            const txId = await this.token.burn(amount.toFixed()).send();
            await expectEvent.inTransaction(txId, this.token, "Transfer",
                {
                    from: account.toHexAddress(owner, true),
                    to: ZERO_ADDRESS_ETH,
                    value: amount,
                });
            expect(BN.fromHex(await this.token.balanceOf(owner).call())).to.be.bignumber.equal(remainingBalance);
        });

        it("decrements totalSupply", async function () {
            const expectedSupply = initialSupply.minus(amount);
            expect(BN.fromHex(await this.token.totalSupply().call())).to.be.bignumber.equal(expectedSupply);
        });
    });
});
