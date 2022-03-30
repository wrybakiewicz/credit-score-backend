const axios = require("axios");
const endpoint = 'https://api.cybertino.io/connect/';
require('dotenv').config();

const bearerToken = process.env.BEARER_TOKEN;
const TWITTER_FOLLOWS_MAX_SCORE_VALUE = 30;
const CYBER_CONNECT_FOLLOWS_MAX_SCORE_VALUE = 10;

/** Request twitter details (from twitter)
 *  Returns twitter details (followersCound, followingCount, tweetCount) based on twitter name*/
const GetFollowTwitterList = async (name) => {

    if (name === "") {
        return Promise.resolve(
            {
                followers_count: 0,
                following_count: 0,
                tweet_count: 0,
                name: name
            });
    }

    url_ = `https://api.twitter.com/2/users/by/username/${name}?user.fields=public_metrics`;
    const option = {
        url: url_, method: 'get', headers: {

            "authorization": `Bearer ${bearerToken}`
        }
    };
    return axios(option).then(response => {
        return {
            followers_count: response.data.data.public_metrics.followers_count,
            following_count: response.data.data.public_metrics.following_count,
            tweet_count: response.data.data.public_metrics.tweet_count,
            name: name
        };
    }).catch(_ => {
        return {
            followers_count: 0,
            following_count: 0,
            tweet_count: 0,
            name: name
        };
    })
}

const average = (array) => array.reduce((a, b) => a + b) / array.length;

/** Request cyber connect details */
function getCyberConnectDetails(address) {
    return GetIdentityList(address, `
    followingCount
    followerCount
    friends {
        list {
            address
        }
    }
    social {
      twitter
    }
    `).then(response => {
        return {
            followingCount: response.follows.followingCount,
            followerCount: response.follows.followerCount,
            twitterName: response.follows.social.twitter,
            friends: response.follows.friends.list.map(friend => friend.address)
        }
    });
}

function IdentityQuery(address, details) {
    query = `
    query {
        identity(address: \"${address}\") {
            ${details}
        }
    }`;
    return {"query": query};
}

function GetIdentityList(address, query) {
    return axios({
        url: endpoint,
        method: 'post',
        headers: {
            "content-type": "application/json",
        }, data:
            IdentityQuery(address, query)
    }).then(response => {
        return {"follows": response.data["data"]["identity"], "address": address}
    });
}

/** Calculate score based on twitter data
 * params: twitter follows data
 * returns: number - score from 0 to 1000, accounts >= 30 followers get 1000 */
function calculateTwitterScore(followersCount) {
    const actualToMaxValueProportion = followersCount / TWITTER_FOLLOWS_MAX_SCORE_VALUE;
    const score = actualToMaxValueProportion * 1000;
    return Math.min(score, 1000);
}

/** Calculate score based on cyber connect followers
 * params: twitter follows data
 * returns: number - score from 0 to 1000, accounts >= 10 followers get 1000 */
function calculateCyberConnectScore(cyberConnectDetails) {
    const actualToMaxValueProportion = cyberConnectDetails.followerCount / CYBER_CONNECT_FOLLOWS_MAX_SCORE_VALUE;
    const score = actualToMaxValueProportion * 1000;
    return Math.min(score, 1000);
}


module.exports = {
    getCyberConnectDetails,
    calculateCyberConnectScore,
    GetFollowTwitterList,
    calculateTwitterScore,
    average,
};

