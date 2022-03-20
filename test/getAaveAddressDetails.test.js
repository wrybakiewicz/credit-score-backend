const {expect} = require("chai");
const {getAaveAddressDetails, calculateAaveAddressDetailsScore} = require("../src/service/getAaveAddressDetails");
const {emptyAaveAddressDetails, exampleAaveAddressDetails} = require("../testData/exampleAaaveAddressDetails");


describe('test getAaveAddressDetails', function () {
    it('should return aave details for address', async function () {
        const aaveDetails = await getAaveAddressDetails("0x0005f124d6a49c29764b1db08546108ca0afeb68");
        expect(aaveDetails.borrowHistory.length).to.be.greaterThanOrEqual(16);
        expect(aaveDetails.liquidationHistory.length).to.be.greaterThanOrEqual(3);
        expect(aaveDetails.repayHistory.length).to.be.greaterThanOrEqual(4);
        aaveDetails.liquidationHistory.forEach(element => {
            expect(element.amount).to.be.greaterThanOrEqual(0);
            expect(element.decimals).to.be.greaterThanOrEqual(0);
            expect(element.currentEthPrice).to.be.greaterThanOrEqual(0);
            expect(element.name).to.be.an('string');
            expect(element.symbol).to.be.an('string');
            expect(element.dateTime).to.be.an('string');
        });
        aaveDetails.borrowHistory.forEach(element => {
            expect(element.amount).to.be.greaterThanOrEqual(0);
            expect(element.decimals).to.be.greaterThanOrEqual(0);
            expect(element.currentEthPrice).to.be.greaterThanOrEqual(0);
            expect(element.name).to.be.an('string');
            expect(element.symbol).to.be.an('string');
            expect(element.dateTime).to.be.an('string');
        });
        aaveDetails.repayHistory.forEach(element => {
            expect(element.amount).to.be.greaterThanOrEqual(0);
            expect(element.decimals).to.be.greaterThanOrEqual(0);
            expect(element.currentEthPrice).to.be.greaterThanOrEqual(0);
            expect(element.name).to.be.an('string');
            expect(element.symbol).to.be.an('string');
            expect(element.dateTime).to.be.an('string');
        });
    });

    it('should calculate score for aave details', () => {
        const score = calculateAaveAddressDetailsScore(exampleAaveAddressDetails);
        expect(score).to.be.equal(853.7267599977874);
    });

    it('should calculate score for aave with no borrows', () => {
        const score = calculateAaveAddressDetailsScore(emptyAaveAddressDetails);
        expect(score).to.be.equal(500);
    });
});