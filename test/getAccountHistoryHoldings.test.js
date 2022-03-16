const {expect} = require("chai");
const {getAccountHistoryHoldings} = require('../src/service/getAccountHistoryHoldings')

describe('test getTokenBalances', function () {
    it('should return token balances for one address', async function () {
        const tokenBalances = await getAccountHistoryHoldings("0x8cD96764d9c51c474F62A316DE72bB72a17c20f4");
        expect(tokenBalances.length).to.be.equal(2);
        expect(tokenBalances[0].tokenTicker).to.be.equal("USDT");
        expect(tokenBalances[0].token).to.be.equal("Tether USD");
        expect(tokenBalances[0].decimals).to.be.equal(6);
        expect(tokenBalances[0].averageBalance).to.be.greaterThan(0);
        expect(tokenBalances[0].averageValue).to.be.greaterThan(0);
        expect(tokenBalances[1].tokenTicker).to.be.equal("ETH");
        expect(tokenBalances[1].token).to.be.equal("Ether");
        expect(tokenBalances[1].decimals).to.be.equal(18);
        expect(tokenBalances[1].averageBalance).to.be.greaterThan(0);
        expect(tokenBalances[1].averageValue).to.be.greaterThan(0);
    });

    it('should return token balances for another address', async function () {
        const tokenBalances = await getAccountHistoryHoldings("0xc2380ded7219198f5195117c395d18c2b1ed50a3");
        expect(tokenBalances.length).to.be.equal(13);
        tokenBalances.forEach(balance => {
            expect(balance.tokenTicker).to.be.an("string");
            expect(balance.token).to.be.an("string");
            expect(balance.decimals).to.be.greaterThanOrEqual(1);
            expect(balance.averageBalance).to.be.greaterThan(0);
            expect(balance.averageValue).to.be.greaterThan(0);
        })
    });
});