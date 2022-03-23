const MAX_RETRY_COUNT = 5;

/** If external request fail - retry it - max `MAX_RETRY_COUNT` times*/
function retryIfFailed(functionToExecute) {
    return retry(functionToExecute, MAX_RETRY_COUNT);
}

function retry(functionToExecute, moreRetryTimes) {
    return functionToExecute()
        .catch(_ => {
            if (moreRetryTimes > 0) {
                console.log("Execution of " + functionToExecute + " failed, retrying");
                return retry(functionToExecute, moreRetryTimes - 1)
            }
        });
}

module.exports = {retryIfFailed}