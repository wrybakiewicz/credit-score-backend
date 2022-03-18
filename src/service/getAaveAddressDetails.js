const axios = require('axios');
const moment = require("moment");
const {formatMomentAsDateTime} = require("./helpers");
require('dotenv').config();

const THE_GRAH_URL = 'https://gateway.thegraph.com/api/';
const THE_GRAPH_KEY = process.env.THE_GRAPH_KEY;

const AAVE_GRAPH_ID = "CvvUWXNtn8A5zVAtM8ob3JGq8kQS8BLrzL6WJV7FrHRy";

const URL = THE_GRAH_URL + THE_GRAPH_KEY + "/subgraphs/id/" + AAVE_GRAPH_ID;

const query = (address) => `{
    users(where: {id: "${address}"}) {
    borrowHistory {
      reserve {
        name
        symbol
        decimals
        price{
          priceInEth
        }
      }
      amount
      timestamp
    }
    repayHistory {
      amount
      timestamp
      reserve {
        name
        symbol
        decimals
        price{
          priceInEth
        }
      }
    }
    liquidationCallHistory {
      principalReserve{
        name
        symbol
        decimals
        price{
          priceInEth
        }
      }
      principalAmount
      timestamp
    }
  }
}`;

function getAaveAddressDetails(address) {
    const theGraphPromise = axios.post(URL, {query: query(address)})
    return theGraphPromise
        .then(response => response.data.data.users[0])
        .then(aaveUser => mapToAaveAddressDetails(aaveUser))
        .catch(error => {
            console.error(error);
            throw error;
        });
}

//TODO: calculate credit score (when borrowed, was liquidations (with significant value), how much % of total borrowed was repaid)

function mapToAaveAddressDetails(aaveUser) {
    const borrowHistory = mapToBorrowHistory(aaveUser.borrowHistory);
    const liquidationHistory = mapToLiquidationHistory(aaveUser.liquidationCallHistory);
    const repayHistory = mapToRepayHistory(aaveUser.repayHistory);

    return {
        borrowHistory: borrowHistory,
        liquidationHistory: liquidationHistory,
        repayHistory: repayHistory
    }
}

function mapToBorrowHistory(aaveBorrowHistory) {
    return aaveBorrowHistory.map(record => {
        return {
            amount: parseInt(record.amount),
            decimals: record.reserve.decimals,
            currentEthPrice: record.reserve.price.priceInEth,
            name: record.reserve.name,
            symbol: record.reserve.symbol,
            dateTime: formatMomentAsDateTime(moment.unix(record.timestamp))
        };
    });
}


function mapToLiquidationHistory(aaveLiquidationHistory) {
    return aaveLiquidationHistory.map(record => {
       return {
           amount: parseInt(record.principalAmount),
           decimals: record.principalReserve.decimals,
           currentEthPrice: record.principalReserve.price.priceInEth,
           name: record.principalReserve.name,
           symbol: record.principalReserve.symbol,
           dateTime: formatMomentAsDateTime(moment.unix(record.timestamp))
       }
    });
}

function mapToRepayHistory(aaveRepayHistory) {
    return aaveRepayHistory.map(record => {
        return {
            amount: parseInt(record.amount),
            decimals: record.reserve.decimals,
            currentEthPrice: record.reserve.price.priceInEth,
            name: record.reserve.name,
            symbol: record.reserve.symbol,
            dateTime: formatMomentAsDateTime(moment.unix(record.timestamp))
        }
    });
}

module.exports = {getAaveAddressDetails}