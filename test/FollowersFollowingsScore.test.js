const {expect} = require("chai");
const {GetIdentityList, GetFollowTwitterList, GetTwitterScore, CountCybecConnectScore} = require("../src/service/FollowersFollowingsScore");

describe('test FollowersFollowingsScore', function () {

it('should return following and followers status', async function () {
address = "0x23D0fcFb566c0f5098957B439E6B8588426567a5";
const identity_list = await GetIdentityList(address, " followingCount\n followerCount");
expect(identity_list["follows"]["followingCount"]).to.be.equal(1);
expect(identity_list["follows"]["followerCount"]).to.be.equal(0);
expect(identity_list["address"]).to.be.equal(address);
});

it('should return following and followers status for twitter account. (Add BEARER_TOKEN to the environment before test)', async function () {
const follows = await GetFollowTwitterList("trip_meta")
.then( follows => {expect(follows["followers"]).to.be.equal(25);})
.then( follows => {expect(follows["following"]).to.be.equal(161);})
;
//expect(follows["followers"]).to.be.equal(25);
//expect(follows["following"]).to.be.equal(161);

});

it('should return correct follow score from CyberConnect', async function () {
    address = "0x23D0fcFb566c0f5098957B439E6B8588426567a5";

    const cyberconnect_score = GetIdentityList(address, " followingCount\n followerCount")
    .then(cyberconnect_list => {expect(CountCybecConnectScore(cyberconnect_list)).to.be.equal(0)});
});

it('should return correct follow score from twitter. (Add BEARER_TOKEN to the environment before test)', async function () {
    //@trip_meta
    GetFollowTwitterList("trip_meta")
    .then(v => {expect(GetTwitterScore(v["followers"])).to.be.equal(0)});

    //@rafal_zaorski
    GetFollowTwitterList("rafal_zaorski")
        .then(v => {expect(GetTwitterScore(v["followers"])).to.be.equal(1000)});

    //@CryptoFinallyyy
    GetFollowTwitterList("CryptoFinallyyy")
        .then(v => {expect(GetTwitterScore(v["followers"])).to.be.equal(116)});

});
});
