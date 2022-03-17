const {expect} = require("chai");
const {GetIdentityList, GetFollowTwitterList} = require("../src/service/FollowersFollowingsScore");

describe('test FollowersFollowingsScore', function () {

it('should return following and followers status', async function () {
address = "0x23D0fcFb566c0f5098957B439E6B8588426567a5";
const identity_list = await GetIdentityList(address, " followingCount\n followerCount");
expect(identity_list["follows"]["followingCount"]).to.be.equal(1);
expect(identity_list["follows"]["followerCount"]).to.be.equal(0);
expect(identity_list["address"]).to.be.equal(address)
});

it('should return following and followers status for twitter account. (Add BEARER_TOKEN to the environment before test)', async function () {
const follows =  GetFollowTwitterList(BigInt(1479532380100521984))
.then( v => {expect(follows["followers"]).to.be.equal(25);})
.then( v => {expect(follows["following"]).to.be.equal(161);})

});
});
