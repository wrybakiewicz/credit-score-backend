const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

const creditScore = [
    {score: 910,
    details: {
        addressCreation: {
            created: "2020-01-01 10:55:55",
            score: 700,
            wage: 40
        },
        tokenHoldings: {
            holdings: [
                {
                    token: "ETH",
                    from: "2020-01-01 10:55:55",
                    amount: 10,
                    value: 30000,
                    score: 600,
                    wage: 30
                },
                {
                    token: "WBTC",
                    from: "2020-01-01 10:55:55",
                    amount: 3,
                    value: 70000,
                    score: 800,
                    wage: 70
                }
            ],
            score: 950,
            wage: 20
        },
        social: {
            followers: {
                count: 900,
                wage: 95
            },
            followings: {
                count: 10000,
                wage: 5
            },
            score: 800,
            wage: 40
        }
    }}
];

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

app.get('/', (req, res) => {
    res.send(creditScore);
});

app.listen(3001, () => {
    console.log('listening on port 3001');
});