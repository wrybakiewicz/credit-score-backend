const ethers = require("ethers");
const moment = require("moment");

const etherscanProvider = new ethers.providers.EtherscanProvider();

/** Calculate account lifetime - days between first transactions and now
 * params: address - eth address
 * returns: {lifetimeInDays: number, accountCreated: Moment}
 * */
function getAccountLifetime(address) {
    return etherscanProvider.getHistory(address)
        .then(history => getLifetime(history));
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

module.exports = {getAccountLifetime};
