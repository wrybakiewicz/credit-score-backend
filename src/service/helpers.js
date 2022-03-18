/** Format moment to date string*/
function formatMomentAsDate(moment) {
    return moment.format("DD/MM/YYYY");
}

function formatMomentAsDateTime(moment) {
    return moment.format("DD/MM/YYYY HH:mm:ss");
}

module.exports = {formatMomentAsDate, formatMomentAsDateTime};