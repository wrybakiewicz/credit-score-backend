const {expect} = require("chai");
const {getCreditScore} = require('../src/service/getCreditScore')

describe('test getCreditScore', function () {
    it('should return credit score', async function () {
        const creditScore = await getCreditScore("0x8A03E0daB7E83076Af7200B09780Af7856F0298D");
        expect(creditScore.score).to.be.greaterThanOrEqual(0);
        expect(creditScore.basicScore).to.be.greaterThanOrEqual(0);
        //address creation details
        expect(creditScore.details.addressCreation.lifetimeInDays).to.be.greaterThanOrEqual(356);
        expect(creditScore.details.addressCreation.created).to.be.equal("03/24/2021");
        expect(creditScore.details.addressCreation.score).to.be.greaterThanOrEqual(0);
        expect(creditScore.details.addressCreation.wage).to.be.equal(0.3);
        //token holdings details
        expect(creditScore.details.tokenHoldingDetails.details.length).to.be.equal(1);
        expect(creditScore.details.tokenHoldingDetails.score).to.be.greaterThanOrEqual(0);
        expect(creditScore.details.tokenHoldingDetails.wage).to.be.equal(0.7);
        expect(creditScore.details.tokenHoldingDetails.details[0].tokenTicker).to.be.an("string");
        expect(creditScore.details.tokenHoldingDetails.details[0].token).to.be.an("string");
        expect(creditScore.details.tokenHoldingDetails.details[0].decimals).to.be.greaterThanOrEqual(1);
        expect(creditScore.details.tokenHoldingDetails.details[0].averageBalance).to.be.greaterThan(0);
        expect(creditScore.details.tokenHoldingDetails.details[0].averageValue).to.be.greaterThan(0);

    });
});