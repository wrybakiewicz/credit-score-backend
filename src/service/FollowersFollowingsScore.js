const axios = require("axios");
const needle = require('needle');
const endpoint = 'https://api.cybertino.io/connect/';
const headers = {
"content-type": "application/json",
};



///////////////////Twitter///////////////////////////////
const GetFollowTwitterList = async (userId) => {
    const url_followers = `https://api.twitter.com/2/users/${userId}/followers`;
    const url_following = `https://api.twitter.com/2/users/${userId}/following`;
    const bearerToken = process.env.BEARER_TOKEN;
    let users_followers = [];
    let users_following = [];
    let params = {
        "max_results": 1000,
        "user.fields": "created_at"
    }

    const options = {
        headers: {
            "User-Agent": "v2FollowersJS",
            "authorization": `Bearer ${bearerToken}`
        }
    }

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

const getPage =  async (params, options, nextToken, url) => {
    if (nextToken) {
        params.pagination_token = nextToken;
    }

    try {
        const resp =  await needle('get', url, params, options);

        if (resp.statusCode != 200) {
            return;
        }
        return resp.body;
    } catch (err) {
        throw new Error(`Request failed: ${err}`);
    }
}
/////////////////////////////////////////////////////////////////

function IdentityQuery(address, str_items){
    query = `query {\n identity(address: \"${address}\") {\n${str_items}\n\t}\n}`;
    return {"query": query};
};


function GetIdentityList(address, itms){
    return axios({ url: endpoint, method: 'post', headers: headers, data:
    IdentityQuery(address, itms)}).then(response => {return {"follows": response.data["data"]["identity"], "address": address}});
};


module.exports =  {GetIdentityList, GetFollowTwitterList};

