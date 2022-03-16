const {getAccountLifetime} = require("./getAccountLifetime");
const {formatMoment} = require("./helpers");
const {getAccountHistoryHoldings} = require("./getAccountHistoryHoldings");

/** Calculate credit score - aggregate for all indicators */
function getCreditScore(address) {
    const accountLifetimePromise = getAccountLifetime(address);
    const accountHistoryHoldingsPromise = getAccountHistoryHoldings(address);

    return accountLifetimePromise.then(accountLifetime => {
        return accountHistoryHoldingsPromise.then(accountHistoryHoldings => {
            const creditScore = 500;
            return {
                score: creditScore,
                details: {
                    addressCreation: {
                        lifetimeInDays: accountLifetime.lifetimeInDays,
                        created: formatMoment(accountLifetime.created)
                    },
                    tokenHoldingDetails: {
                        details:  accountHistoryHoldings
                    }
                }
            }
        })
    })
}

module.exports = {getCreditScore};