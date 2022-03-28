const {expect} = require("chai");

const {getAccountLifetime, calculateAccountLifetimeScore} = require('../src/service/getAccountLifetime')
const {formatMomentAsDate} = require('../src/service/helpers')

describe('test getAccountLifetime', function () {
    it('should return correct lifetime from first transactions', async function () {
        const lifetime = await getAccountLifetime("0x8A03E0daB7E83076Af7200B09780Af7856F0298D");
        expect(lifetime.lifetimeInDays).to.be.greaterThanOrEqual(356);
        expect(formatMomentAsDate(lifetime.created)).to.be.equal("24 March 2021");
    });

    it('should return undefined if address does not have transactions', async function () {
        const lifetime = await getAccountLifetime("0x12cD21D7DACc71C631f8E645240d80aD560F0161");
        expect(lifetime.lifetimeInDays).to.equal(undefined);
        expect(lifetime.created).to.equal(undefined);
    });

    it('should calculate score for 1 day account', () => {
        const score = calculateAccountLifetimeScore({lifetimeInDays: 1, created: "1"});
        expect(score).to.be.equal(2.73972602739726);
    });

    it('should calculate score for 200 days account', () => {
        const score = calculateAccountLifetimeScore({lifetimeInDays: 200, created: "1"});
        expect(score).to.be.equal(547.945205479452);
    });

    it('should calculate score for 700 days account', () => {
        const score = calculateAccountLifetimeScore({lifetimeInDays: 700, created: "1"});
        expect(score).to.be.equal(1000);
    });
});