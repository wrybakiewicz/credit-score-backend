const moment = require("moment");
const exampleAaveAddressDetails = {
    "borrowHistory": [
        {
            "amount": 32000,
            "decimals": 2,
            "currentEthPrice": 339503034377368,
            "name": "Gemini dollar",
            "symbol": "GUSD",
            "dateTime": moment("2021-06-10T00:49:10.000Z")
        },
        {
            "amount": 800000,
            "decimals": 2,
            "currentEthPrice": 339503034377368,
            "name": "Gemini dollar",
            "symbol": "GUSD",
            "dateTime": moment("2021-05-06T16:40:33.000Z")
        },
        {
            "amount": 300000,
            "decimals": 2,
            "currentEthPrice": 339503034377368,
            "name": "Gemini dollar",
            "symbol": "GUSD",
            "dateTime": moment("2021-07-04T19:24:22.000Z")
        },
        {
            "amount": 1500000,
            "decimals": 2,
            "currentEthPrice": 339503034377368,
            "name": "Gemini dollar",
            "symbol": "GUSD",
            "dateTime": moment("2021-04-13T04:57:07.000Z")
        },
        {
            "amount": 20000,
            "decimals": 2,
            "currentEthPrice": 339503034377368,
            "name": "Gemini dollar",
            "symbol": "GUSD",
            "dateTime": moment("2021-05-29T23:25:40.000Z")
        },
        {
            "amount": 1000000,
            "decimals": 2,
            "currentEthPrice": 339503034377368,
            "name": "Gemini dollar",
            "symbol": "GUSD",
            "dateTime": moment("2021-04-16T09:17:01.000Z")
        },
        {
            "amount": 30300,
            "decimals": 2,
            "currentEthPrice": 339503034377368,
            "name": "Gemini dollar",
            "symbol": "GUSD",
            "dateTime": moment("2021-05-22T22:33:07.000Z")
        },
        {
            "amount": 400000,
            "decimals": 2,
            "currentEthPrice": 339503034377368,
            "name": "Gemini dollar",
            "symbol": "GUSD",
            "dateTime": moment("2021-05-17T04:26:06.000Z")
        },
        {
            "amount": 720000000,
            "decimals": 6,
            "currentEthPrice": 337987186504458,
            "name": "USD Coin",
            "symbol": "USDC",
            "dateTime": moment("2021-07-03T15:38:45.000Z")
        },
        {
            "amount": 1500000,
            "decimals": 2,
            "currentEthPrice": 339503034377368,
            "name": "Gemini dollar",
            "symbol": "GUSD",
            "dateTime": moment("2021-04-15T04:48:53.000Z")
        },
        {
            "amount": 400000,
            "decimals": 2,
            "currentEthPrice": 339503034377368,
            "name": "Gemini dollar",
            "symbol": "GUSD",
            "dateTime": moment("2021-05-28T13:11:27.000Z")
        },
        {
            "amount": 1500000,
            "decimals": 2,
            "currentEthPrice": 339503034377368,
            "name": "Gemini dollar",
            "symbol": "GUSD",
            "dateTime": moment("2021-04-11T16:13:49.000Z")
        },
        {
            "amount": 1200000,
            "decimals": 2,
            "currentEthPrice": 339503034377368,
            "name": "Gemini dollar",
            "symbol": "GUSD",
            "dateTime": moment("2021-04-19T12:22:08.000Z")
        },
        {
            "amount": 800000,
            "decimals": 2,
            "currentEthPrice": 339503034377368,
            "name": "Gemini dollar",
            "symbol": "GUSD",
            "dateTime": moment("2021-04-25T20:42:42.000Z")
        },
        {
            "amount": 550000,
            "decimals": 2,
            "currentEthPrice": 339503034377368,
            "name": "Gemini dollar",
            "symbol": "GUSD",
            "dateTime": moment("2021-08-01T10:44:24.000Z")
        },
        {
            "amount": 8000000000,
            "decimals": 6,
            "currentEthPrice": 337987186504458,
            "name": "USD Coin",
            "symbol": "USDC",
            "dateTime": moment("2021-05-15T21:05:28.000Z")
        }
    ],
    "liquidationHistory": [
        {
            "amount": 736325,
            "decimals": 2,
            "currentEthPrice": 339503034377368,
            "name": "Gemini dollar",
            "symbol": "GUSD",
            "dateTime": moment("2021-05-19T23:53:35.000Z")
        },
        {
            "amount": 2943527,
            "decimals": 2,
            "currentEthPrice": 339503034377368,
            "name": "Gemini dollar",
            "symbol": "GUSD",
            "dateTime": moment("2021-05-19T04:36:35.000Z")
        },
        {
            "amount": 1471327,
            "decimals": 2,
            "currentEthPrice": 339503034377368,
            "name": "Gemini dollar",
            "symbol": "GUSD",
            "dateTime": moment("2021-05-19T12:17:45.000Z")
        }
    ],
    "repayHistory": [
        {
            "amount": 2086055,
            "decimals": 2,
            "currentEthPrice": 339503034377368,
            "name": "Gemini dollar",
            "symbol": "GUSD",
            "dateTime": moment("2021-08-18T13:16:16.000Z")
        },
        {
            "amount": 400000,
            "decimals": 2,
            "currentEthPrice": 339503034377368,
            "name": "Gemini dollar",
            "symbol": "GUSD",
            "dateTime": moment("2021-05-17T14:42:51.000Z")
        },
        {
            "amount": 2500000,
            "decimals": 2,
            "currentEthPrice": 339503034377368,
            "name": "Gemini dollar",
            "symbol": "GUSD",
            "dateTime": moment("2021-05-19T01:46:09.000Z")
        },
        {
            "amount": 8794058701,
            "decimals": 6,
            "currentEthPrice": 337987186504458,
            "name": "USD Coin",
            "symbol": "USDC",
            "dateTime": moment("2021-08-18T13:19:07.000Z")
        }
    ]
};

const emptyAaveAddressDetails = {
    "borrowHistory": [],
    "liquidationHistory": [],
    "repayHistory": []
}

module.exports = {exampleAaveAddressDetails, emptyAaveAddressDetails};