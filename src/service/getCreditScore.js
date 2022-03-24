const {getAccountLifetime, calculateAccountLifetimeScore} = require("./getAccountLifetime");
const {formatMomentAsDate} = require("./helpers");
const {getAccountHistoryHoldings, calculateAccountHistoryHoldingsScore} = require("./getAccountHistoryHoldings");
const {getPoaps, calculatePoapsCreditScore} = require("./getPoaps");
const {retryIfFailed} = require("./retryService");
const {getAaveAddressDetails, calculateAaveAddressDetailsScore} = require("./getAaveAddressDetails");
const {GetIdentityList, average} = require("./FollowersFollowingsScore");


function invokeScoreCall(_list, iter, addr) {
    /**
     * Recurrent function which invokes 'getCreditScore' function for each friend of the address
     * */
    if (_list.length)
        return getCreditScore(_list[iter]["address"], true).then(basicScore => {
            addr.push(basicScore.basicScore);
            if (iter !== 0) {
                return invokeScoreCall(_list, iter - 1, addr);
            } else {
                return average(addr);
            }
        });


}

function getMeanOfFriendsSocialScore(address) {
    /**
     Returns friends social score mean of particular address
     */
    addr = [];

    const identity_list = GetIdentityList(address, " followingCount\n followerCount\n friends{list{address\n}}\n");

    return identity_list.then(v => {
        if (v.follows.friends.list.length)
            return invokeScoreCall(v.follows.friends.list, v.follows.friends.list.length - 1, addr);
        else return 0;
    });
}


const ADDRESS_CREATION_WAGE = 0.25;
const TOKEN_HOLDING_DETAILS_WAGE = 0.4;
const POAPS_DETAILS_WAGE = 0.05
const AAVE_ADDRESS_DETAILS_WAGE = 0.3;
const BASIC_CREDIT_SCORE = 0.8;
const FRIENDS_CREDIT_SCORE = 0.2;

/** Calculate credit score - aggregate for all indicators
 * score - calculated score based on all indicators
 * basicScore - calculated score based on all indicators except address 'connections' - to avoid recursion */
function getCreditScore(address, isItRecurrentInvoke = false) {
    const accountLifetimePromise = retryIfFailed(() => getAccountLifetime(address));
    const accountHistoryHoldingsPromise = retryIfFailed(() => getAccountHistoryHoldings(address));
    const poapsPromise = retryIfFailed(() => getPoaps(address));
    const aaveAddressDetailsPromise = retryIfFailed(() => getAaveAddressDetails(address));

    return accountLifetimePromise.then(accountLifetime => {
        return accountHistoryHoldingsPromise.then(accountHistoryHoldings => {
            return poapsPromise.then(poaps => {
                return aaveAddressDetailsPromise.then(aaveAddressDetails => {

                    const addressCreationScore = calculateAccountLifetimeScore(accountLifetime);
                    const accountHistoryHoldingsScore = calculateAccountHistoryHoldingsScore(accountHistoryHoldings);
                    const poapsScore = calculatePoapsCreditScore(poaps);
                    const aaveScore = calculateAaveAddressDetailsScore(aaveAddressDetails);

                    const basicCreditScore = (addressCreationScore * ADDRESS_CREATION_WAGE)
                        + (accountHistoryHoldingsScore * TOKEN_HOLDING_DETAILS_WAGE)
                        + (poapsScore * POAPS_DETAILS_WAGE)
                        + (aaveScore * AAVE_ADDRESS_DETAILS_WAGE);
                    if (isItRecurrentInvoke) {
                        return {
                            score: basicCreditScore,
                            basicScore: basicCreditScore,
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
                                }
                            }
                        }
                    } else {
                        return getMeanOfFriendsSocialScore(address).then(
                            meanFriendsSocialScore => {
                                const creditScore = (BASIC_CREDIT_SCORE * basicCreditScore) + (FRIENDS_CREDIT_SCORE * meanFriendsSocialScore);
                                return {
                                    score: creditScore,
                                    basicScore: basicCreditScore,
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
                                        }
                                    }
                                }
                            });
                    }
                })
            })
        })
    })
}

module.exports = {getMeanOfFriendsSocialScore, getCreditScore};