const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const {getCreditScore} = require("./service/getCreditScore");

const app = express();

const exampleCreditScore = [
    {score: 910,
    details: {
        addressCreation: {
            created: "2020-01-01 10:55:55",
            lifetimeInDays: 100
        },
        tokenHoldings: {
            holdings: [
                {
                    token: "ETH",
                    from: "2020-01-01 10:55:55",
                    amount: 10,
                    value: 30000,
                },
                {
                    token: "WBTC",
                    from: "2020-01-01 10:55:55",
                    amount: 3,
                    value: 70000,
                }
            ],
        },
        social: {
            followers: {
                count: 900,
            },
            followings: {
                count: 10000,
            }
        }
    }}
];

/** Initialize express js rest api */
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

/** example response of credit score (for frontend integration) - to delete */
app.get('/example', (req, res) => {
    res.send(exampleCreditScore);
});

/** credit score endpoint */
app.get('/credit-score/:address', async (req, res) => {
    const address = req.params.address;
    console.log("Calculating score for address: ", address);
    const creditScore = await getCreditScore(address);
    res.send(creditScore);
});

/** Deploy server */
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('listening on port ' + port);
});
