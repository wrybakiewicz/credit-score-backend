const axios = require("axios");
const needle = require('needle');
const endpoint = 'https://api.cybertino.io/connect/';
require('dotenv').config();
const header = {
    "content-type": "application/json",
};
const params = {
    "max_results": 1000,
    "user.fields": "created_at"
};
const bearerToken = process.env.BEARER_TOKEN;

const options = {
    headers: {
        "User-Agent": "v2FollowersJS",
        "authorization": `Bearer ${bearerToken}`
    }
};
//////////////////////Twitter///////////////////////////
const GetFollowTwitterList = async (name) => {

    url_ = `https://api.twitter.com/2/users/by/username/${name}?user.fields=public_metrics`;
    const option = {
        url: url_, method: 'get', headers: {

            "authorization": `Bearer ${bearerToken}`
        }
    };
    return axios(option).then(response => {
        return {"followers_count": response.data.data.public_metrics.followers_count, "following_count": response.data.data.public_metrics.following_count, "tweet_count": response.data.data.public_metrics.tweet_count};
    })
}


/////////////////////////////////////////////////////////////////
const average = (array) => array.reduce((a, b) => a + b) / array.length;

function IdentityQuery(address, str_items) {
    query = `query {\n identity(address: \"${address}\") {\n${str_items}\n\t}\n}`;
    return {"query": query};
};


function GetIdentityList(address, itms) {
    return axios({
        url: endpoint, method: 'post', headers: header, data:
            IdentityQuery(address, itms)
    }).then(response => {
        return {"follows": response.data["data"]["identity"], "address": address}
    });
};

/////////////////////////SCORE FUNCTIONS/////////////////////////
function calculateTwitterScore(follows_data) {

    MAX_CONSIDERABLE_AMOUNT_FOLLOWERS = 20000;
    MIN_CONSIDERABLE_AMOUNT_FOLLOWERS = 1000;
//    follows_data = await GetFollowTwitterList(name)
    const followers = follows_data.followers_count;
    if (followers < MIN_CONSIDERABLE_AMOUNT_FOLLOWERS) {
        return 0
    } else if (followers < MAX_CONSIDERABLE_AMOUNT_FOLLOWERS) {
        return parseInt((followers - MIN_CONSIDERABLE_AMOUNT_FOLLOWERS) / (MAX_CONSIDERABLE_AMOUNT_FOLLOWERS - MIN_CONSIDERABLE_AMOUNT_FOLLOWERS) * 1000);
    } else {
        return 1000;
    }
}

function CountCybecConnectScore(follows_data) {
    MAX_CONSIDERABLE_AMOUNT_FOLLOWERS = 200;
    MIN_CONSIDERABLE_AMOUNT_FOLLOWERS = 10;
    followers = follows_data["follows"]["followerCount"];
    if (followers < MIN_CONSIDERABLE_AMOUNT_FOLLOWERS) {
        return 0
    } else if (followers < MAX_CONSIDERABLE_AMOUNT_FOLLOWERS) {
        return parseInt((followers - MIN_CONSIDERABLE_AMOUNT_FOLLOWERS) / (MAX_CONSIDERABLE_AMOUNT_FOLLOWERS - MIN_CONSIDERABLE_AMOUNT_FOLLOWERS) * 1000);
    } else {
        return 1000;
    }
}


module.exports = {CountCybecConnectScore, GetIdentityList, GetFollowTwitterList, calculateTwitterScore, average};

