const {expect} = require("chai");
const {getCreditScore} = require('../src/service/getCreditScore')

describe('test getCreditScore', function () {
    it('should return credit score', async function () {
        const creditScore = await getCreditScore("0x660f26fbc540ec5def5639a7a6018869298590cc");
        expect(creditScore.score).to.be.greaterThanOrEqual(0);
        //address creation details
        expect(creditScore.details.addressCreation.details.lifetimeInDays).to.be.greaterThanOrEqual(469);
        expect(creditScore.details.addressCreation.details.created).to.be.equal("02-12-2020");
        expect(creditScore.details.addressCreation.score).to.be.greaterThanOrEqual(0);
        expect(creditScore.details.addressCreation.wage).to.be.equal(0.25);
        //token holdings details
        expect(creditScore.details.tokenHoldingDetails.details.tokenHoldingList.length).to.be.equal(4);
        expect(creditScore.details.tokenHoldingDetails.score).to.be.greaterThanOrEqual(0);
        expect(creditScore.details.tokenHoldingDetails.wage).to.be.equal(0.3);
        creditScore.details.tokenHoldingDetails.details.tokenHoldingList.forEach(details => {
            expect(details.tokenTicker).to.be.an("string");
            expect(details.token).to.be.an("string");
            expect(details.decimals).to.be.greaterThanOrEqual(1);
            expect(details.averageBalance).to.be.greaterThan(0);
            expect(details.averageValue).to.be.greaterThan(0);
        });
        //poaps
        expect(creditScore.details.poapsDetails.score).to.be.equal(1000);
        expect(creditScore.details.poapsDetails.wage).to.be.equal(0.05);
        expect(creditScore.details.poapsDetails.details.poaps.length).to.be.equal(3);
        creditScore.details.poapsDetails.details.poaps.forEach(poap => {
            expect(poap.name).to.be.an("string");
            expect(poap.imageUrl).to.be.an("string");
            expect(poap.dateTime).to.be.an("string");
            expect(poap.holdingDurationInDays).to.be.an("number");
        });
        //aave details
        expect(creditScore.details.aaveAddressDetails.wage).to.be.equal(0.1);
        expect(creditScore.details.aaveAddressDetails.score).to.be.equal(0);
        expect(creditScore.details.aaveAddressDetails.details.borrowHistory.length).to.be.equal(0);
        expect(creditScore.details.aaveAddressDetails.details.liquidationHistory.length).to.be.equal(0);
        expect(creditScore.details.aaveAddressDetails.details.repayHistory.length).to.be.equal(0);
        //friends social score
        expect(creditScore.details.friendsSocialScore.wage).to.be.equal(0.1);
        expect(creditScore.details.friendsSocialScore.score).to.be.equal(0);
    });

    it('should return credit score for address with aave details', async function () {
        const creditScore = await getCreditScore("0x0005f124d6a49c29764b1db08546108ca0afeb68");
        expect(creditScore.score).to.be.greaterThanOrEqual(0);
        //address creation details
        expect(creditScore.details.addressCreation.details.lifetimeInDays).to.be.greaterThanOrEqual(0);
        expect(creditScore.details.addressCreation.details.created).to.be.equal("25-12-2020");
        expect(creditScore.details.addressCreation.score).to.be.greaterThanOrEqual(0);
        expect(creditScore.details.addressCreation.wage).to.be.equal(0.25);
        //token holdings details
        expect(creditScore.details.tokenHoldingDetails.details.tokenHoldingList.length).to.be.equal(5);
        expect(creditScore.details.tokenHoldingDetails.score).to.be.greaterThanOrEqual(0);
        expect(creditScore.details.tokenHoldingDetails.wage).to.be.equal(0.3);
        creditScore.details.tokenHoldingDetails.details.tokenHoldingList.forEach(details => {
            expect(details.tokenTicker).to.be.an("string");
            expect(details.token).to.be.an("string");
            expect(details.decimals).to.be.greaterThanOrEqual(1);
            expect(details.averageBalance).to.be.greaterThan(0);
            expect(details.averageValue).to.be.greaterThan(0);
        });
        //poaps
        expect(creditScore.details.poapsDetails.score).to.be.equal(0);
        expect(creditScore.details.poapsDetails.wage).to.be.equal(0.05);
        expect(creditScore.details.poapsDetails.details.poaps.length).to.be.equal(0);
        //aave details
        expect(creditScore.details.aaveAddressDetails.wage).to.be.equal(0.1);
        expect(creditScore.details.aaveAddressDetails.score).to.be.greaterThan(360);
        expect(creditScore.details.aaveAddressDetails.details.borrowHistory.length).to.be.greaterThanOrEqual(16);
        expect(creditScore.details.aaveAddressDetails.details.liquidationHistory.length).to.be.greaterThanOrEqual(3);
        expect(creditScore.details.aaveAddressDetails.details.repayHistory.length).to.be.greaterThanOrEqual(4);
        creditScore.details.aaveAddressDetails.details.borrowHistory.forEach(details => {
            expect(details.amount).to.be.greaterThanOrEqual(0);
            expect(details.decimals).to.be.greaterThanOrEqual(1);
            expect(details.currentEthPrice).to.be.greaterThan(0);
            expect(details.name).to.be.an('string');
            expect(details.symbol).to.be.an('string');
            expect(details.dateTime).to.be.an('string');
        });
        creditScore.details.aaveAddressDetails.details.liquidationHistory.forEach(details => {
            expect(details.amount).to.be.greaterThanOrEqual(0);
            expect(details.decimals).to.be.greaterThanOrEqual(1);
            expect(details.currentEthPrice).to.be.greaterThan(0);
            expect(details.name).to.be.an('string');
            expect(details.symbol).to.be.an('string');
            expect(details.dateTime).to.be.an('string');
        });
        creditScore.details.aaveAddressDetails.details.repayHistory.forEach(details => {
            expect(details.amount).to.be.greaterThanOrEqual(0);
            expect(details.decimals).to.be.greaterThanOrEqual(1);
            expect(details.currentEthPrice).to.be.greaterThan(0);
            expect(details.name).to.be.an('string');
            expect(details.symbol).to.be.an('string');
            expect(details.dateTime).to.be.an('string');
        });
        //friends social score
        expect(creditScore.details.friendsSocialScore.wage).to.be.equal(0.1);
        expect(creditScore.details.friendsSocialScore.score).to.be.equal(0);
    });

    it('should return followers and followings with TwitterList details', async function () {
        const creditscore = await getCreditScore("0xA0Cf024D03d05303569bE9530422342E1cEaF480");
        expect(creditscore.details.twitterDetails.details.followers).to.be.greaterThanOrEqual(20);
        expect(creditscore.details.twitterDetails.details.followings).to.be.greaterThanOrEqual(500);
        expect(creditscore.details.twitterDetails.details.twitterName).to.be.equal("guziec_pl");
        expect(creditscore.details.twitterDetails.score).to.be.greaterThanOrEqual(500);
        expect(creditscore.details.twitterDetails.wage).to.be.equal(0.1);

        expect(creditscore.details.cyberConnectDetails.details.followerCount).to.be.greaterThanOrEqual(1);
        expect(creditscore.details.cyberConnectDetails.details.followingCount).to.be.greaterThanOrEqual(1);
        expect(creditscore.details.twitterDetails.score).to.be.greaterThanOrEqual(100);
        expect(creditscore.details.twitterDetails.wage).to.be.equal(0.1);
    });

    it('should return credit score for random address', async function () {
        await getCreditScore("0x4059973680e687452e5e6c29ea3be8d2904958c3");
    });

    it('credit score of high quality friends', async function () {
        const creditScore = await getCreditScore("0x5fd9b0B7e15B4d106624ea9CF96602996c9c344D");
        //friends social score
        expect(creditScore.details.friendsSocialScore.wage).to.be.equal(0.1);
        expect(creditScore.details.friendsSocialScore.score).to.be.greaterThanOrEqual(560);
        //cyber connect details
        expect(creditScore.details.cyberConnectDetails.wage).to.be.equal(0.1);
        expect(creditScore.details.cyberConnectDetails.score).to.be.equal(1000);
        expect(creditScore.details.cyberConnectDetails.details.followingCount).to.be.greaterThanOrEqual(26);
        expect(creditScore.details.cyberConnectDetails.details.followerCount).to.be.greaterThanOrEqual(2189);
        expect(creditScore.details.cyberConnectDetails.details.friends.length).to.be.greaterThanOrEqual(7);
    });

    it('should calculate for new address', async function () {
        const creditScore = await getCreditScore("0x66a2fe2049c352C0092F6500f668C1104F4dD6eE");
        expect(creditScore.score).to.be.greaterThanOrEqual(0);
    });
});