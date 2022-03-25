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

    url_ = `https://api.twitter.com/2/users/by/username/${name}`;
    const option = {
        url: url_, method: 'get', headers: {

            "authorization": `Bearer ${bearerToken}`
        }
    };
    return axios(option).then(v => {
        return GetFollowTwitterIdList(v.data.data.id).then(c => {
            return c;
        });
    })
}

async function iterateThroughFollowers(url_follow) {
    let hasNextPage = true;
    let nextToken = null;
    users_follow = [];
    while (hasNextPage) {
        let resp_follow = await getPage(params, options, nextToken, url_follow);
        if (resp_follow && resp_follow.meta && resp_follow.meta.result_count && resp_follow.meta.result_count > 0) {
            if (resp_follow.data) {
                users_follow.push.apply(users_follow, resp_follow.data);
            }
            if (resp_follow.meta.next_token) {
                nextToken = resp_follow.meta.next_token;
            } else {
                hasNextPage = false;
            }
        } else {
            hasNextPage = false;
        }
    }
    return users_follow;
}

const GetFollowTwitterIdList = async (userId) => {
    const url_followers = `https://api.twitter.com/2/users/${userId}/followers`;
    const url_following = `https://api.twitter.com/2/users/${userId}/following`;

    let users_followers = await iterateThroughFollowers(url_followers);
    let users_following = await iterateThroughFollowers(url_following);

    return {"followers": users_followers.length, "following": users_following.length};//, "following": users_following.length

}

const getPage = async (params, options, nextToken, url) => {
    if (nextToken) {
        params.pagination_token = nextToken;
    }

    try {
        const resp = await needle('get', url, params, options);

        if (resp.statusCode != 200) {
            return;
        }
        return resp.body;
    } catch (err) {
        throw new Error(`Request failed: ${err}`);
    }
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
    const followers = follows_data["followers"];
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

