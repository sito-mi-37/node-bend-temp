const {format} = require('date-fns')
const {v4: uuid} = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message, filename) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:MM:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    if(!fs.existsSync(path.join(__dirname, '..' , 'logs'))){
        await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
    }

    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', filename), logItem)

}

const logger = (req, res, next) => {
    console.log(req.method, req.url)
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
    next()
}

module.exports = {logger, logEvents}