function createErrorResponseFn(statusCode, message, encoding) {
    var response = {
        'statusCode': statusCode,
        'headers' : {'Access-Control-Allow-Origin' : '*'},
        'body' : JSON.stringify({'code': statusCode, 'messsage' : message, 'encoding' : encoding})
    }
    return response;
}

function createSuccessResponseFn(statusCode, result) {
    var response = {
        'statusCode': statusCode,
        'headers' : {'Access-Control-Allow-Origin' : '*'},
        'body' : JSON.stringify(result)
    }
    return response;
}

module.exports = {
    createErrorResponse: createErrorResponseFn,
    createSuccessResponse: createSuccessResponseFn
}
