const {getPoaps, calculatePoapsCreditScore} = require("../src/service/getPoaps");
const {expect} = require("chai");
const {examplePoap1, examplePoap2} = require("../testData/examplePoaps");

describe('test getPoaps', function () {
    it('should return poap list for address', async function () {
        const poaps = await getPoaps("0x660f26fbc540ec5def5639a7a6018869298590cc");
        expect(poaps.length).to.be.greaterThanOrEqual(3);
        expect(poaps[0].name).to.be.equal("Bit.Country & Metaverse.Network Demo Day");
        expect(poaps[0].imageUrl).to.be.equal("https://assets.poap.xyz/bitcountry-metaversenetwork-demo-day-2021-logo-1637645164601.png");
        expect(poaps[0].dateTime).to.be.equal("12/07/2021");
        expect(poaps[0].holdingDurationInDays).to.be.greaterThanOrEqual(0);
        poaps.forEach(poap => {
            expect(poap.name).to.be.an("string");
            expect(poap.imageUrl).to.be.an("string");
            expect(poap.dateTime).to.be.an("string");
            expect(poap.holdingDurationInDays).to.be.greaterThanOrEqual(0);
        });
    });

    it('should calculate score empty array', () => {
        const score = calculatePoapsCreditScore([]);
        expect(score).to.be.equal(0);
    });

    it('should calculate score for one element array', () => {
        const score = calculatePoapsCreditScore([examplePoap1]);
        expect(score).to.be.equal(273.972602739726);
    });

    it('should calculate score for two element array', () => {
        const score = calculatePoapsCreditScore([examplePoap1, examplePoap2]);
        expect(score).to.be.equal(1000);
    });

});