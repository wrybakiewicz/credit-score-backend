const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const {getCreditScore} = require("./service/getCreditScore");

const app = express();


/** Initialize express js rest api */
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

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
