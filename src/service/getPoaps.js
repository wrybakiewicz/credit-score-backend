const axios = require("axios");
const moment = require("moment");
const {formatMoment} = require("./helpers");

const POAPS_URL = "https://api.poap.xyz/actions/scan/"

/** POAPs holding sum in days for which user get max score*/
const POAPS_MAX_SCORE_VALUE = 365;

/** Get POAPs for address */
function getPoaps(address) {
    return axios.get(POAPS_URL + address)
        .then(response => mapResponseToPoaps(response))
        .catch(error => {
            console.error(error);
            throw error;
        });
}

/** Calculate score from poaps
 * params: poaps
 * calculation based on sum of all poaps holdings in days
 * returns: number - score from 0 to 1000 (0 - 0 days, 1000 - `POAPS_MAX_SCORE_VALUE` days) */
function calculatePoapsCreditScore(poaps) {
    const poapsTotalHolding = poaps.map(poap => poap.holdingDurationInDays)
        .reduce((element1, element2) => element1 + element2, 0);
    const actualToMaxValueProportion = poapsTotalHolding / POAPS_MAX_SCORE_VALUE;
    const score = actualToMaxValueProportion * 1000;
    return Math.min(score, 1000);
}

function mapResponseToPoaps(response) {
    return response.data.map(poap => {
        const creationDate = moment(poap.created, "YYYY-MM-DD");
        return {
            name: poap.event.name,
            imageUrl: poap.event.image_url,
            dateTime: formatMoment(moment(poap.created, "YYYY-MM-DD")),
            holdingDurationInDays: moment().diff(creationDate, 'days')
        }
    });
}

module.exports = {getPoaps, calculatePoapsCreditScore}