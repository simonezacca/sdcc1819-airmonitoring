function createErrorResponseFn(statusCode, message, encoding) {
    let response = {
        'statusCode': statusCode,
        'headers' : {'Access-Control-Allow-Origin' : '*'},
        'body' : JSON.stringify({'code': statusCode, 'messsage' : message, 'encoding' : encoding})
    }
    return response;
}

function createSuccessResponseFn(statusCode, result) {
    let response = {
        'statusCode': statusCode,
        'headers' : {'Access-Control-Allow-Origin' : '*','Access-Control-Allow-Headers' : '*'},
        'body' : JSON.stringify(result)
    }
    return response;
}

module.exports = {
    createErrorResponse: createErrorResponseFn,
    createSuccessResponse: createSuccessResponseFn
}
