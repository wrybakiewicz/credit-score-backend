const {expect} = require("chai");
const {getCreditScore} = require('../src/service/getCreditScore')

describe('test getCreditScore', function () {
    it('should return credit score', async function () {
        const creditScore = await getCreditScore("0x8A03E0daB7E83076Af7200B09780Af7856F0298D");
        expect(creditScore.score).to.be.equal(500);
        expect(creditScore.details.addressCreation.lifetimeInDays).to.be.greaterThanOrEqual(356);
        expect(creditScore.details.addressCreation.created).to.be.equal("03/24/2021");
    });
});