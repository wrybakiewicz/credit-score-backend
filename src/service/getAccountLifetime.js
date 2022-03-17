const ethers = require("ethers");
const moment = require("moment");

/** Account lifetime in days for which user get max score*/
const ACCOUNT_LIFETIME_MAX_SCORE_VALUE = 365;

const etherscanProvider = new ethers.providers.EtherscanProvider();

/** Calculate account lifetime - days between first transactions and now
 * params: address - eth address
 * returns: {lifetimeInDays: number, accountCreated: Moment}
 * */
function getAccountLifetime(address) {
    return etherscanProvider.getHistory(address)
        .then(history => getLifetime(history))
        .catch(error => {
            console.error(error);
            throw error;
        });
}

/** Calculate score from account lifetime
 * params: account lifetime
 * returns: number - score from 0 to 1000, accounts >= 1 year get 1000 */
function calculateAccountLifetimeScore(accountLifetime) {
    const actualToMaxValueProportion = accountLifetime.lifetimeInDays / ACCOUNT_LIFETIME_MAX_SCORE_VALUE;
    const score = actualToMaxValueProportion * 1000;
    return Math.min(score, 1000);
}

function getLifetime(history) {
    if (history.length === 0) {
        return {
            lifetimeInDays: 0,
            created: moment()
        }
    } else {
        const firstTransaction = moment.unix(history[0].timestamp);
        const lifetimeInDays = moment().diff(firstTransaction, 'days');
        return {
            lifetimeInDays: lifetimeInDays,
            created: firstTransaction
        }
    }
}

module.exports = {getAccountLifetime, calculateAccountLifetimeScore};
