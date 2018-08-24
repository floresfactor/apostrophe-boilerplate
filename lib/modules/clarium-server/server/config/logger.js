const debug = require('debug')('clarium')
const name = 'clarium-server'
const path = require('path');
const { MESSAGE } = require('triple-beam');
const winston = require('winston');

const logger = module.exports = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({filename: path.join('../clarium-portal.log')})
  ],
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple()
  )
});


module.exports = logger;
