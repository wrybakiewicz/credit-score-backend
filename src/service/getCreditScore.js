const {getAccountLifetime} = require("./getAccountLifetime");
const {formatMoment} = require("./helpers");

/** Calculate credit score - aggregate for all indicators */
function getCreditScore(address) {
    const accountLifetimePromise = getAccountLifetime(address);

    return accountLifetimePromise.then(accountLifetime => {
        //TODO: calculate credit score by wages/Jonasz's algorithm
        const creditScore = 500;
        return {
            score: creditScore,
            details: {
                addressCreation: {
                    lifetimeInDays: accountLifetime.lifetimeInDays,
                    created: formatMoment(accountLifetime.created)
                }
            }
        }
    })
}

module.exports = {getCreditScore};