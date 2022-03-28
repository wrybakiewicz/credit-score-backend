const {expect} = require("chai");
const {
    GetIdentityList,
    GetFollowTwitterList,
    calculateTwitterScore,
    CountCybecConnectScore
} = require("../src/service/FollowersFollowingsScore");

describe('test FollowersFollowingsScore', function () {
    it('should return following and followers status', async function () {
        address = "0x23D0fcFb566c0f5098957B439E6B8588426567a5";
        const identity_list = await GetIdentityList(address, " followingCount\n followerCount");
        expect(identity_list["follows"]["followingCount"]).to.be.equal(1);
        expect(identity_list["follows"]["followerCount"]).to.be.equal(0);
        expect(identity_list["address"]).to.be.equal(address);
    });

    it('should return following and followers status for twitter account. (Add BEARER_TOKEN to the environment before test)', async function () {
        const follows = await GetFollowTwitterList("trip_meta");
        expect(follows.followers_count).to.be.greaterThanOrEqual(20);
        expect(follows.following_count).to.be.greaterThanOrEqual(150);
        expect(follows.tweet_count).to.be.greaterThanOrEqual(39);
    });

    it('should return correct follow score from CyberConnect', async function () {
        address = "0x23D0fcFb566c0f5098957B439E6B8588426567a5";

        const cyberconnect_score = await GetIdentityList(address, " followingCount\n followerCount")
        expect(CountCybecConnectScore(cyberconnect_score)).to.be.equal(0);
    });

    it('should return correct follow score from twitter. (Add BEARER_TOKEN to the environment before test)', async function () {
        //@trip_meta
        const twitter1 = await GetFollowTwitterList("trip_meta");
        expect(calculateTwitterScore(twitter1)).to.be.equal(0);

        //@rafal_zaorski
        const twitter2 = await GetFollowTwitterList("rafal_zaorski")
        expect(calculateTwitterScore(twitter2)).to.be.equal(1000);

        //@CryptoFinallyyy
        const twitter3 = await GetFollowTwitterList("CryptoFinallyyy");
        expect(calculateTwitterScore(twitter3)).to.be.greaterThanOrEqual(0);

    });
});
