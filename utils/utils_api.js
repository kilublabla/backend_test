const crypto = require("crypto");

this.ok200 = function(req, res, data){
    console.info("RESP - 200", JSON.stringify(data));
    res.status(200).json({
        status: 1,
        code: "SUCCESS",
        message: "SUCCESS",
        data: data
    })
}

this.err400 = function(req, res, data, message){
    console.info("RESP - 400", JSON.stringify(data));
    res.status(400).json({
        status: 0,
        code: "BAD_REQUEST",
        message: message,
        data: data
    })
}

this.err401 = function(req, res, data, message){
    console.info("RESP - 401", JSON.stringify(data));
    res.status(401).json({
        status: 0,
        code: "UNAUTHORIZED",
        message: message,
        data: data
    })
}

this.err404 = function(req, res, data, message){
    console.info("RESP - 404", JSON.stringify(data));
    res.status(404).json({
        status: 0,
        code: "NOT_FOUND",
        message: message,
        data: data
    })
}

this.err409 = function(req, res, data, message){
    console.info("RESP - 404", JSON.stringify(data));
    res.status(409).json({
        status: 0,
        code: "CONFLICT",
        message: message,
        data: data
    })
}

this.err500 = function(req, res, data, message){
    console.info("RESP - 500", JSON.stringify(data));
    res.status(500).json({
        status: 0,
        code: "INTERNAL_SERVER_ERROR",
        message: message,
        data: data
    })
}

module.exports = this;
