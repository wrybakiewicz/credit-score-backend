const axios = require('axios');
const moment = require("moment");
const {formatMomentAsDateTime, toMoment} = require("./helpers");
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

/** Get aave details by address
 * Returns: borrow history, liquidation history, repay history*/
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

/** Calculate score from aave details
 * params: aave address details
 * calculated by:
 * first borrow factor - when first borrow happened (max 1.0 - if >= 1y ago, 0 when now)
 * liquidation factor - for each liquidation 0.1 penalty
 * borrow repay factor - factor of repay / borrow amount
 * returns: score (0-1000)
 * score is calculated by: (first borrow factor * liquidation factor * borrow repay factor) * 1000 */
function calculateAaveAddressDetailsScore(aaveAddressDetails) {
    const firstBorrowFactor = calculateFirstBorrowFactor(aaveAddressDetails.borrowHistory);
    const liquidationFactor = calculateNumberOfLiquidationFactor(aaveAddressDetails.liquidationHistory);
    const borrowRepayFactor = calculateBorrowRepayFactor(aaveAddressDetails.borrowHistory, aaveAddressDetails.repayHistory);
    const score = (firstBorrowFactor * liquidationFactor * borrowRepayFactor) * 1000;
    return Math.min(1000, score);
}

function calculateFirstBorrowFactor(borrowHistory) {
    const firstBorrowMoment = getFirstBorrowMoment(borrowHistory);
    const firstBorrowDaysBefore = moment().diff(firstBorrowMoment, 'days');
    const factor = firstBorrowDaysBefore / 365.0;
    return Math.min(factor, 1.0);
}

function calculateNumberOfLiquidationFactor(liquidationHistory) {
    const liquidationCount = liquidationHistory.length;
    const liquidationMinusScore = 0.1 * liquidationCount;
    return Math.max(1 - liquidationMinusScore, 0);
}

function calculateBorrowRepayFactor(borrowHistory, repayHistory) {
    const totalBorrowedEth = borrowHistory
        .map(record => (record.amount * record.currentEthPrice) / 10 ** record.decimals)
        .reduce((element1, element2) => element1 + element2, 0);
    const totalRepaidEth = repayHistory
        .map(record => (record.amount * record.currentEthPrice) / 10 ** record.decimals)
        .reduce((element1, element2) => element1 + element2, 0);
    if(totalBorrowedEth > 0) {
        return totalRepaidEth / totalBorrowedEth;
    } else {
        return 0;
    }
}

function getFirstBorrowMoment(borrowHistory) {
    return borrowHistory.map(element => toMoment(element.dateTime))
        .reduce((element1, element2) => {
            if(element1.isBefore(element2)) {
                return element1;
            } else {
                return element2
            }
        }, moment());
}

function mapToAaveAddressDetails(aaveUser) {
    if (aaveUser) {
        const borrowHistory = mapToBorrowHistory(aaveUser.borrowHistory);
        const liquidationHistory = mapToLiquidationHistory(aaveUser.liquidationCallHistory);
        const repayHistory = mapToRepayHistory(aaveUser.repayHistory);

        return {
            borrowHistory: borrowHistory,
            liquidationHistory: liquidationHistory,
            repayHistory: repayHistory
        }
    } else {
        return {
            borrowHistory: [],
            liquidationHistory: [],
            repayHistory: []
        }
    }
}

function mapToBorrowHistory(aaveBorrowHistory) {
    return aaveBorrowHistory.map(record => {
        return {
            amount: parseInt(record.amount),
            decimals: record.reserve.decimals,
            currentEthPrice: parseInt(record.reserve.price.priceInEth),
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
           currentEthPrice: parseInt(record.principalReserve.price.priceInEth),
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
            currentEthPrice: parseInt(record.reserve.price.priceInEth),
            name: record.reserve.name,
            symbol: record.reserve.symbol,
            dateTime: formatMomentAsDateTime(moment.unix(record.timestamp))
        }
    });
}

module.exports = {getAaveAddressDetails, calculateAaveAddressDetailsScore}