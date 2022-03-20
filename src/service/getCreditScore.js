const {getAccountLifetime, calculateAccountLifetimeScore} = require("./getAccountLifetime");
const {formatMomentAsDate} = require("./helpers");
const {getAccountHistoryHoldings, calculateAccountHistoryHoldingsScore} = require("./getAccountHistoryHoldings");
const {getPoaps, calculatePoapsCreditScore} = require("./getPoaps");
const {retryIfFailed} = require("./retryService");
const {getAaveAddressDetails, calculateAaveAddressDetailsScore} = require("./getAaveAddressDetails");


const ADDRESS_CREATION_WAGE = 0.25;
const TOKEN_HOLDING_DETAILS_WAGE = 0.4;
const POAPS_DETAILS_WAGE = 0.05
const AAVE_ADDRESS_DETAILS_WAGE = 0.3;

/** Calculate credit score - aggregate for all indicators
 * score - calculated score based on all indicators
 * basicScore - calculated score based on all indicators except address 'connections' - to avoid recursion */
function getCreditScore(address) {
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

                    const creditScore = (addressCreationScore * ADDRESS_CREATION_WAGE)
                        + (accountHistoryHoldingsScore * TOKEN_HOLDING_DETAILS_WAGE);
                    return {
                        score: creditScore,
                        basicScore: creditScore,
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
                })
            })
        })
    })
}

module.exports = {getCreditScore};