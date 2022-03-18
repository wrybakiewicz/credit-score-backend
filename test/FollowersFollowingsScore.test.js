const {expect} = require("chai");
const {GetIdentityList, GetFollowTwitterList, GetTwitterScore, GetCyberConnectScore} = require("../src/service/FollowersFollowingsScore");

describe('test FollowersFollowingsScore', function () {

it('should return following and followers status', async function () {
address = "0x23D0fcFb566c0f5098957B439E6B8588426567a5";
const identity_list = await GetIdentityList(address, " followingCount\n followerCount");
expect(identity_list["follows"]["followingCount"]).to.be.equal(1);
expect(identity_list["follows"]["followerCount"]).to.be.equal(0);
expect(identity_list["address"]).to.be.equal(address);
});

it('should return following and followers status for twitter account. (Add BEARER_TOKEN to the environment before test)', async function () {
const follows =  GetFollowTwitterList(BigInt(1479532380100521984))
.then( v => {expect(follows["followers"]).to.be.equal(25);})
.then( v => {expect(follows["following"]).to.be.equal(161);})

});

it('should return correct follow score from CyberConnect', async function () {
    address = "0x23D0fcFb566c0f5098957B439E6B8588426567a5";

    const cyberconnect_score = GetCyberConnectScore(address, " followingCount\n followerCount")
    .then(cyberconnect_score => expect(cyberconnect_score).to.be.equal(0));
});

it('should return correct follow score from twitter. (Add BEARER_TOKEN to the environment before test)', async function () {
    //@trip_meta
    const twitter_score =  GetTwitterScore(BigInt(1479532380100521984))
    .then(v => expect(twitter_score => {expect(twitter_score).to.be.equal(0)}));

    //@rafal_zaorski
    const twitter_score2 =  GetTwitterScore(BigInt(747476326135791616))
    .then(v => expect(twitter_score2 => {expect(twitter_score2).to.be.equal(1000)}));

    //@CryptoFinallyyy
    const twitter_score3 =  GetTwitterScore(BigInt(604427900))
    .then(v => expect(twitter_score3 => {expect(twitter_score3).to.be.equal(116)}));

});
});
