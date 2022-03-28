const {expect} = require("chai");
const {
    GetFollowTwitterList,
    calculateTwitterScore,
    getCyberConnectFriends, getCyberConnectTwitter
} = require("../src/service/FollowersFollowingsScore");

describe('test FollowersFollowingsScore', function () {
    it('should return following and followers status', async function () {
        address = "0x23D0fcFb566c0f5098957B439E6B8588426567a5";
        const identity_list = await getCyberConnectFriends(address);
        expect(identity_list.follows.friends.list.length).to.be.equal(0);
    });

    it('should return following and followers status for twitter account. (Add BEARER_TOKEN to the environment before test)', async function () {
        const follows = await GetFollowTwitterList("trip_meta");
        expect(follows.followers_count).to.be.greaterThanOrEqual(20);
        expect(follows.following_count).to.be.greaterThanOrEqual(150);
        expect(follows.tweet_count).to.be.greaterThanOrEqual(39);
    });

    it('should return correct follow score from CyberConnect', async function () {
        address = "0x23D0fcFb566c0f5098957B439E6B8588426567a5";

        const cyberconnect_score = await getCyberConnectFriends(address)
        expect(cyberconnect_score.follows.friends.list.length).to.be.equal(0);
    });

    it('should return correct follow score from twitter. (Add BEARER_TOKEN to the environment before test)', async function () {
        expect(calculateTwitterScore(27)).to.be.equal(900);
        expect(calculateTwitterScore(30)).to.be.equal(1000);
        expect(calculateTwitterScore(1)).to.be.equal(33.333333333333336);
    });

    it('should return friends', async () => {
        const cyberConnectFriends = await getCyberConnectFriends("0x12cD21D7DACc71C631f8E645240d80aD560F0161");
        expect(cyberConnectFriends.follows.friends.list.length).to.be.equal(1);
    });

    it('should return cyber connect twitter', async () => {
        const cyberConnectTwitter = await getCyberConnectTwitter("0xA0Cf024D03d05303569bE9530422342E1cEaF480");
        expect(cyberConnectTwitter).to.be.equal("guziec_pl");
    });

    it('should not return cyber connect twitter - when not connected', async () => {
        const cyberConnectTwitter = await getCyberConnectTwitter("0x12cD21D7DACc71C631f8E645240d80aD560F0161");
        expect(cyberConnectTwitter).to.be.equal("");
    });
});
