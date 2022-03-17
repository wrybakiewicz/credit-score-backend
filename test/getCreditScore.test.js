const {expect} = require("chai");
const {getCreditScore} = require('../src/service/getCreditScore')

describe('test getCreditScore', function () {
    it('should return credit score', async function () {
        const creditScore = await getCreditScore("0x660f26fbc540ec5def5639a7a6018869298590cc");
        expect(creditScore.score).to.be.greaterThanOrEqual(0);
        expect(creditScore.basicScore).to.be.greaterThanOrEqual(0);
        //address creation details
        expect(creditScore.details.addressCreation.lifetimeInDays).to.be.greaterThanOrEqual(469);
        expect(creditScore.details.addressCreation.created).to.be.equal("12/02/2020");
        expect(creditScore.details.addressCreation.score).to.be.greaterThanOrEqual(0);
        expect(creditScore.details.addressCreation.wage).to.be.equal(0.25);
        //token holdings details
        expect(creditScore.details.tokenHoldingDetails.details.length).to.be.equal(4);
        expect(creditScore.details.tokenHoldingDetails.score).to.be.greaterThanOrEqual(0);
        expect(creditScore.details.tokenHoldingDetails.wage).to.be.equal(0.7);
        creditScore.details.tokenHoldingDetails.details.forEach(details => {
            expect(details.tokenTicker).to.be.an("string");
            expect(details.token).to.be.an("string");
            expect(details.decimals).to.be.greaterThanOrEqual(1);
            expect(details.averageBalance).to.be.greaterThan(0);
            expect(details.averageValue).to.be.greaterThan(0);
        });
        //poaps
        expect(creditScore.details.poapsDetails.score).to.be.equal(1000);
        expect(creditScore.details.poapsDetails.wage).to.be.equal(0.05);
        expect(creditScore.details.poapsDetails.poaps.length).to.be.equal(3);
        creditScore.details.poapsDetails.poaps.forEach(poap => {
            expect(poap.name).to.be.an("string");
            expect(poap.imageUrl).to.be.an("string");
            expect(poap.dateTime).to.be.an("string");
            expect(poap.holdingDurationInDays).to.be.an("number");
        });
    });
});