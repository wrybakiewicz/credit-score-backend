const {getAccountLifetime, calculateAccountLifetimeScore} = require("./getAccountLifetime");
const {formatMoment} = require("./helpers");
const {getAccountHistoryHoldings, calculateAccountHistoryHoldingsScore} = require("./getAccountHistoryHoldings");
const {GetTwitterScore, GetCyberConnectScore} = require("./FollowersFollowingsScore");
const ADDRESS_CREATION_WAGE = 0.3;
const TOKEN_HOLDING_DETAILS_WAGE = 0.7;

/** Calculate credit score - aggregate for all indicators */
function getCreditScore(address) {
    const accountLifetimePromise = getAccountLifetime(address);
    const accountHistoryHoldingsPromise = getAccountHistoryHoldings(address);

    const GetTwitterScorePromise = GetTwitterScore("trip_meta");
    const GetCyberConnectScorePromise = GetCyberConnectScore(address, " followingCount\n followerCount");

   // return GetTwitterScorePromise.then(twitterScorePromise =>{
    //return GetCyberConnectScorePromise.then(cyberConnectScore => {
        return accountLifetimePromise.then(accountLifetime => {
            return accountHistoryHoldingsPromise.then(accountHistoryHoldings => {

                const addressCreationScore = calculateAccountLifetimeScore(accountLifetime);
                const accountHistoryHoldingsScore = calculateAccountHistoryHoldingsScore(accountHistoryHoldings);
                const creditScore = (addressCreationScore * ADDRESS_CREATION_WAGE) + (accountHistoryHoldingsScore * TOKEN_HOLDING_DETAILS_WAGE);
                return {
                    score: creditScore,
                    basicScore: creditScore,
                    details: {
                        addressCreation: {
                            lifetimeInDays: accountLifetime.lifetimeInDays,
                            created: formatMoment(accountLifetime.created),
                            score: addressCreationScore,
                            wage: ADDRESS_CREATION_WAGE
                        },
                        tokenHoldingDetails: {
                            details:  accountHistoryHoldings,
                            wage: TOKEN_HOLDING_DETAILS_WAGE,
                            score: accountHistoryHoldingsScore
                        }
                    }
                }
            })
        })
   // })
    //})

}

module.exports = {getCreditScore};
