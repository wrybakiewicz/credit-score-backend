const axios = require("axios");
const needle = require('needle');
const endpoint = 'https://api.cybertino.io/connect/';

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
//const bearerToken = process.env.BEARER_TOKEN;
    url_ = `https://api.twitter.com/2/users/by/username/${name}`;

    return axios.get(url_, {headers: {"authorization": `Bearer ${bearerToken}`}}).then(v => {
        GetFollowTwitterIdList(v.data.data.id).then(c => {
            return c;
        })
    })
}

const GetFollowTwitterIdList = async (userId) => {
    const url_followers = `https://api.twitter.com/2/users/${userId}/followers`;
    const url_following = `https://api.twitter.com/2/users/${userId}/following`;

    let users_followers = [];
    let users_following = [];


    let hasNextPage = true;
    let nextToken = null;
    while (hasNextPage) {
        let resp_followers = await getPage(params, options, nextToken, url_followers);
        if (resp_followers && resp_followers.meta && resp_followers.meta.result_count && resp_followers.meta.result_count > 0) {
            if (resp_followers.data) {
                users_followers.push.apply(users_followers, resp_followers.data);
            }
            if (resp_followers.meta.next_token) {
                nextToken = resp_followers.meta.next_token;
            } else {
                hasNextPage = false;
            }
        } else {
            hasNextPage = false;
        }
    }
    hasNextPage = true;
    nextToken = null;
    while (hasNextPage) {
        let resp_following = await getPage(params, options, nextToken, url_following);
        if (resp_following && resp_following.meta && resp_following.meta.result_count && resp_following.meta.result_count > 0) {
            if (resp_following.data) {
                users_following.push.apply(users_following, resp_following.data);
            }
            if (resp_following.meta.next_token) {
                nextToken = resp_following.meta.next_token;
            } else {
                hasNextPage = false;
            }
        } else {
            hasNextPage = false;
        }
    }

    return {"followers": users_followers.length, "following": users_following.length};

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
async function GetTwitterScore(follows_data) {

    MAX_CONSIDERABLE_AMOUNT_FOLLOWERS = 20000;
    MIN_CONSIDERABLE_AMOUNT_FOLLOWERS = 1000;
//    follows_data = await GetFollowTwitterList(name)
    followers = follows_data["followers"];
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


//function GetCyberConnectScore(address, itms){
//
//    follows_data =  GetIdentityList(address, itms)
//    .then(followers => CountCybecConnectScore(followers));
//    return follows_data;
//
//}


//const follow_rank = getFollowRankScaled("0x7C04786F04c522ca664Bb8b6804E0d182eec505F");

module.exports = {CountCybecConnectScore, GetIdentityList, GetFollowTwitterList, GetTwitterScore, average};

