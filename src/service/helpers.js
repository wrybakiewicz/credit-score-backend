const moment = require("moment");

/** Format moment to date string*/
function formatMomentAsDate(moment) {
    return moment.format("DD MMMM YYYY");
}

function formatMomentAsDateTime(moment) {
    return moment.format("DD MMMM YYYY HH:mm:ss");
}

function toMoment(string) {
    return moment(string, "DD MMMM YYYY HH:mm:ss");
}

module.exports = {formatMomentAsDate, formatMomentAsDateTime, toMoment};