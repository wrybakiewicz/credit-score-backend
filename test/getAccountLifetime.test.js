const {expect} = require("chai");
const moment = require("moment");

const {getAccountLifetime} = require('../src/service/getAccountLifetime')
const {formatMoment} = require('../src/service/helpers')

describe('test getAccountLifetime', function () {
    it('should return correct lifetime from first transactions', async function () {
        const lifetime = await getAccountLifetime("0x8A03E0daB7E83076Af7200B09780Af7856F0298D");
        expect(lifetime.lifetimeInDays).to.be.greaterThanOrEqual(356);
        expect(formatMoment(lifetime.created)).to.be.equal("03/24/2021");
    });

    it('should return 0 if address does not have transactions', async function () {
        const lifetime = await getAccountLifetime("0x12cD21D7DACc71C631f8E645240d80aD560F0161");
        expect(lifetime.lifetimeInDays).to.equal(0);
        expect(formatMoment(lifetime.created)).to.equal(formatMoment(moment()));
    });
});