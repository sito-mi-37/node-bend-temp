const {logEvents} = require('./logEvents')

const errorHandler = (err, req, res, next) => {
    console.log(err.stack)
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}`, 'errLog.txt')

    const status = res.statusCode ? res.statusCode : 500 // server error

    res.status(status)

    res.json({message: err.message, isError: true})
}

module.exports = errorHandler