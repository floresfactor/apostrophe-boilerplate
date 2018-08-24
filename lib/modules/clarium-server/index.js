const bodyParser = require('body-parser');
const path       = require('path');
const appRoot    = require('app-root-path');
const helmet     = require('helmet');
const busboyBodyParser = require('busboy-body-parser');
const config     = require('./server/config/config');
const api        = require('./server/routes/api');
const logger     = require('./server/config/logger');


module.exports = {
  construct: function(self, options) {

    // self.addCsrfException = function(exceptions) {
    //   exceptions.push(self.actionmn + '/api/v2/**');
    //   exceptions.push(self.action + '/api/v2/users');
    //   exceptions.push(self.action + '/api/v2/users/*');
    //   exceptions.push('/api/v2/*');
    //   exceptions.push('/api/v2/users');
    //   exceptions.push('/api/v2/users/*');
    // };

    logger.info("[server] Environment: %s", process.env.NODE_ENV);

    logger.info("[server] Security Helmet Enabled ");
    self.apos.app.use(helmet());

    // static files
    logger.info("[server] Setting static directory ");

    // CORS
    logger.info("[server] CORS enabled ");
    self.apos.app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
    	res.header("Access-Control-Allow-Headers", "Origin, set-cookie, x-access-token, X-Requested-With, Content-Type, Accept");
      res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
      next();
    });

    // Body parser
    logger.info("[server] Body parser ");
    self.apos.app.use(bodyParser.json());
    self.apos.app.use(bodyParser.urlencoded({
      extended: true
    }));

    self.apos.app.use(busboyBodyParser({ limit: '10mb' }));

    // Routes API file for interacting with MongoDB
    logger.info("[server] Routes APIs ");
    self.apos.app.use(api);

    // secrete
    self.apos.app.set("secret", config.security.secrete);

  }
};
