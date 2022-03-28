const {getAccountLifetime, calculateAccountLifetimeScore} = require("./getAccountLifetime");
const {formatMomentAsDate} = require("./helpers");
const {getAccountHistoryHoldings, calculateAccountHistoryHoldingsScore} = require("./getAccountHistoryHoldings");
const {getPoaps, calculatePoapsCreditScore} = require("./getPoaps");
const {retryIfFailed} = require("./retryService");
const {getAaveAddressDetails, calculateAaveAddressDetailsScore} = require("./getAaveAddressDetails");
const {
    average,
    calculateTwitterScore,
    GetFollowTwitterList, getCyberConnectDetails, calculateCyberConnectScore
} = require("./FollowersFollowingsScore");

/**
 Returns friends social score mean of particular address
 It calculates `basic credit score` - which does not include friends social credit score (to omit infinite recursion)
 */
function getFriendsSocialScore(cyberConnectDetails) {
    const friendsCreditStorePromiseList = cyberConnectDetails.friends.map(friend => getCreditScore(friend, true))
    return Promise.all(friendsCreditStorePromiseList)
        .then(friendCreditScoreList => {
            if (friendCreditScoreList.length > 0) {
                return average(friendCreditScoreList.map(creditScore => creditScore.score))
            } else {
                return 0;
            }
        });
}


const ADDRESS_CREATION_WAGE = 0.25;
const TOKEN_HOLDING_DETAILS_WAGE = 0.3;
const POAPS_DETAILS_WAGE = 0.05
const AAVE_ADDRESS_DETAILS_WAGE = 0.1;
const TWITTER_WAGE = 0.1;
const FRIENDS_SOCIAL_SCORE_WAGE = 0.1
const CYBER_CONNECT_SCORE_WAGE = 0.1

/** Calculate credit score - aggregate for all indicators
 * when param `isCalculatingBasicCreditScore` is true - it calculates credit score without
 * using `friends social score` indicator
 * score - calculated score based on all indicators
 * basicScore - calculated score based on all indicators except address 'connections' - to avoid recursion */
function getCreditScore(address, isCalculatingBasicCreditScore = false) {
    const accountLifetimePromise = retryIfFailed(() => getAccountLifetime(address));
    const accountHistoryHoldingsPromise = retryIfFailed(() => getAccountHistoryHoldings(address));
    const poapsPromise = retryIfFailed(() => getPoaps(address));
    const aaveAddressDetailsPromise = retryIfFailed(() => getAaveAddressDetails(address));
    const cyberConnectDetailsPromise = retryIfFailed(() => getCyberConnectDetails(address));

    return cyberConnectDetailsPromise.then(cyberConnectDetails => {
        return retryIfFailed(() => GetFollowTwitterList(cyberConnectDetails.twitterName)).then(twitterList => {
            return accountLifetimePromise.then(accountLifetime => {
                return accountHistoryHoldingsPromise.then(accountHistoryHoldings => {
                    return poapsPromise.then(poaps => {
                        return aaveAddressDetailsPromise.then(aaveAddressDetails => {
                            const addressCreationScore = calculateAccountLifetimeScore(accountLifetime);
                            const accountHistoryHoldingsScore = calculateAccountHistoryHoldingsScore(accountHistoryHoldings);
                            const poapsScore = calculatePoapsCreditScore(poaps);
                            const aaveScore = calculateAaveAddressDetailsScore(aaveAddressDetails);
                            const twitterScore = calculateTwitterScore(twitterList.followers_count);
                            const cyberConnectScore = calculateCyberConnectScore(cyberConnectDetails);

                            if (isCalculatingBasicCreditScore) {
                                const basicCreditScore = (addressCreationScore * ADDRESS_CREATION_WAGE)
                                    + (accountHistoryHoldingsScore * TOKEN_HOLDING_DETAILS_WAGE)
                                    + (poapsScore * POAPS_DETAILS_WAGE)
                                    + (aaveScore * AAVE_ADDRESS_DETAILS_WAGE)
                                    + (twitterScore * TWITTER_WAGE)
                                    + (cyberConnectScore * CYBER_CONNECT_SCORE_WAGE);
                                /** As it does not include friends social score - to omit never ending recursion
                                 * - we need to normalize it */
                                const creditScore = basicCreditScore / (1 - FRIENDS_SOCIAL_SCORE_WAGE);
                                return {score: creditScore}
                            } else {
                                return getFriendsSocialScore(cyberConnectDetails).then(
                                    friendsSocialScore => {
                                        const creditScore = (addressCreationScore * ADDRESS_CREATION_WAGE)
                                            + (accountHistoryHoldingsScore * TOKEN_HOLDING_DETAILS_WAGE)
                                            + (poapsScore * POAPS_DETAILS_WAGE)
                                            + (aaveScore * AAVE_ADDRESS_DETAILS_WAGE)
                                            + (twitterScore * TWITTER_WAGE)
                                            + (friendsSocialScore * FRIENDS_SOCIAL_SCORE_WAGE)
                                            + (cyberConnectScore * CYBER_CONNECT_SCORE_WAGE);
                                        return {
                                            score: creditScore,
                                            details: {
                                                addressCreation: {
                                                    lifetimeInDays: accountLifetime.lifetimeInDays,
                                                    created: formatMomentAsDate(accountLifetime.created),
                                                    score: addressCreationScore,
                                                    wage: ADDRESS_CREATION_WAGE
                                                },
                                                tokenHoldingDetails: {
                                                    details: accountHistoryHoldings,
                                                    wage: TOKEN_HOLDING_DETAILS_WAGE,
                                                    score: accountHistoryHoldingsScore
                                                },
                                                poapsDetails: {
                                                    poaps: poaps,
                                                    wage: POAPS_DETAILS_WAGE,
                                                    score: poapsScore
                                                },
                                                aaveAddressDetails: {
                                                    details: {
                                                        borrowHistory: aaveAddressDetails.borrowHistory,
                                                        liquidationHistory: aaveAddressDetails.liquidationHistory,
                                                        repayHistory: aaveAddressDetails.repayHistory,
                                                    },
                                                    wage: AAVE_ADDRESS_DETAILS_WAGE,
                                                    score: aaveScore
                                                },
                                                friendsSocialScore: {
                                                    wage: FRIENDS_SOCIAL_SCORE_WAGE,
                                                    score: friendsSocialScore
                                                },
                                                twitterDetails: {
                                                    details: {
                                                        twitterName: twitterList.name,
                                                        followers: twitterList.followers_count,
                                                        followings: twitterList.following_count,
                                                        tweet_count: twitterList.tweet_count
                                                    },
                                                    wage: TWITTER_WAGE,
                                                    score: twitterScore
                                                },
                                                cyberConnectDetails: {
                                                    details: {
                                                        followingCount: cyberConnectDetails.followingCount,
                                                        followerCount: cyberConnectDetails.followerCount,
                                                        friends: cyberConnectDetails.friends
                                                    },
                                                    wage: CYBER_CONNECT_SCORE_WAGE,
                                                    score: cyberConnectScore
                                                }
                                            }
                                        }
                                    });
                            }
                        })
                    })
                })
            })
        })
    })
}

module.exports = {getFriendsSocialScore, getCreditScore};