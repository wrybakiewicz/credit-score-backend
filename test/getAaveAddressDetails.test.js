const {expect} = require("chai");
const {getAaveAddressDetails} = require("../src/service/getAaveAddressDetails");


describe('test getAaveAddressDetails', function () {
    it('should return aave details for address', async function () {
        const aaveDetails = await getAaveAddressDetails("0x0005f124d6a49c29764b1db08546108ca0afeb68");
        expect(aaveDetails.borrowHistory.length).to.be.greaterThanOrEqual(16);
        expect(aaveDetails.liquidationHistory.length).to.be.greaterThanOrEqual(3);
        expect(aaveDetails.repayHistory.length).to.be.greaterThanOrEqual(4);
        //TODO: more tests
    });

});