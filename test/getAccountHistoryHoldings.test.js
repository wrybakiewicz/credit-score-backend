const {expect} = require("chai");
const {getAccountHistoryHoldings, calculateAccountHistoryHoldingsScore} = require('../src/service/getAccountHistoryHoldings')
const {exampleHoldings1, exampleHoldings2} = require("../testData/exampleHoldings");

describe('test getAccountHistoryHoldings', function () {
    it('should return token balances for one address', async function () {
        const holdings = await getAccountHistoryHoldings("0x8cD96764d9c51c474F62A316DE72bB72a17c20f4");
        expect(holdings.length).to.be.equal(2);
        expect(holdings[0].tokenTicker).to.be.equal("USDT");
        expect(holdings[0].token).to.be.equal("Tether USD");
        expect(holdings[0].decimals).to.be.equal(6);
        expect(holdings[0].averageBalance).to.be.greaterThan(0);
        expect(holdings[0].averageValue).to.be.greaterThan(0);
        expect(holdings[1].tokenTicker).to.be.equal("ETH");
        expect(holdings[1].token).to.be.equal("Ether");
        expect(holdings[1].decimals).to.be.equal(18);
        expect(holdings[1].averageBalance).to.be.greaterThan(0);
        expect(holdings[1].averageValue).to.be.greaterThan(0);
    });

    it('should return token balances for another address', async function () {
        const holdings = await getAccountHistoryHoldings("0xc2380ded7219198f5195117c395d18c2b1ed50a3");
        expect(holdings.length).to.be.equal(14);
        holdings.forEach(holding => {
            expect(holding.tokenTicker).to.be.an("string");
            expect(holding.token).to.be.an("string");
            expect(holding.decimals).to.be.greaterThanOrEqual(1);
            expect(holding.averageBalance).to.be.greaterThan(0);
            expect(holding.averageValue).to.be.greaterThan(0);
        });
    });

    it('should calculate score base on example holdings 1', () => {
        const score = calculateAccountHistoryHoldingsScore(exampleHoldings1);
        expect(score).to.be.equal(8.316414641379312);
    });

    it('should calculate score base on example holdings 2', () => {
        const score = calculateAccountHistoryHoldingsScore(exampleHoldings2);
        expect(score).to.be.equal(1000);
    });
});