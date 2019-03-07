const config = require('config');
const bunyan = require('bunyan');

const logger = bunyan.createLogger({ name: config.get('name') });

module.exports = logger;