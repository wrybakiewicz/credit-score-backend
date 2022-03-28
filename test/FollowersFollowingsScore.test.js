const {expect} = require("chai");
const {
    calculateTwitterScore, getCyberConnectDetails,
} = require("../src/service/FollowersFollowingsScore");

describe('test FollowersFollowingsScore', function () {

    it('should return details', async () => {
        const details = await getCyberConnectDetails("0xA0Cf024D03d05303569bE9530422342E1cEaF480");
        expect(details.followerCount).to.be.equal(2);
        expect(details.followingCount).to.be.equal(3);
        expect(details.friends.length).to.be.equal(2);
        expect(details.twitterName).to.be.equal("guziec_pl");
        expect(details.friends[0]).to.be.equal("0x4059973680e687452e5e6c29ea3be8d2904958c3");
        expect(details.friends[1]).to.be.equal("0x12cd21d7dacc71c631f8e645240d80ad560f0161");
    });

    it('should return details - for address without friends & twitter', async () => {
        const details = await getCyberConnectDetails("0x4059973680e687452e5e6c29EA3BE8d2904958c3");
        expect(details.followerCount).to.be.equal(1);
        expect(details.followingCount).to.be.equal(1);
        expect(details.friends.length).to.be.equal(1);
        expect(details.twitterName).to.be.equal("");
    });

    it('should return correct follow score from twitter. (Add BEARER_TOKEN to the environment before test)', async function () {
        expect(calculateTwitterScore(27)).to.be.equal(900);
        expect(calculateTwitterScore(30)).to.be.equal(1000);
        expect(calculateTwitterScore(1)).to.be.equal(33.333333333333336);
    });

});
