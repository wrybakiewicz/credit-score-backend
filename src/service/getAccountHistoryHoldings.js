const axios = require('axios');
require('dotenv').config();

const API_URL = "https://api.covalenthq.com/v1/1/address/"
const API_KEY = process.env.API_KEY

/** Calculate score based on last 30 days token(ETH + ERC20) holdings
 * calculated by average holdings for last 30 days
 * params: address - eth address
 * returns: [{tokenTicker: string, token: string, decimals: string, averageBalance, averageValue}, ...]
 * */
function getAccountHistoryHoldings(address) {
    return axios.get(API_URL + address + '/portfolio_v2' + API_KEY)
        .then(response => response.data.data.items)
        .then(items => items.map(item => getHistoryHoldingData(item)))
        .then(holdingDataArray => holdingDataArray.filter(element => element.averageValue > 0));
}

function getHistoryHoldingData(item) {
    const holdingData = calculateHoldingData(item.holdings);
    return {
        tokenTicker: item.contract_ticker_symbol,
        token: item.contract_name,
        decimals: item.contract_decimals,
        averageBalance: holdingData.averageBalance,
        averageValue: holdingData.averageValue
    }
}

function calculateHoldingData(holdings) {
    const holdingWithQuotes = holdings.filter(holding => holding.low.quote != null);
    if (holdingWithQuotes.length > 0) {
        const sumBalance = holdingWithQuotes.map(element => parseInt(element.low.balance))
            .reduce((element1, element2) => element1 + element2);
        const sumValue = holdingWithQuotes.map(element => element.low.quote)
            .reduce((element1, element2) => element1 + element2);
        return {
            averageBalance: sumBalance / holdingWithQuotes.length,
            averageValue: sumValue / holdingWithQuotes.length
        }
    } else {
        return {
            averageBalance: 0,
            averageValue: 0
        }
    }

}

module.exports = {getAccountHistoryHoldings};