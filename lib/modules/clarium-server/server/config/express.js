const express 	 = require('express');
const bodyParser = require('body-parser');
const path       = require('path');
const appRoot    = require('app-root-path');
const config     = require('./config');
const api        = require('../routes/api');
const app        = express();
const helmet     = require('helmet');
const busboyBodyParser = require('busboy-body-parser');
const logger     = require('./logger');


// Security Helmet
logger.info("[app] Security Helmet Enabled ");
app.use(helmet());

// static files
logger.info("[app] Setting static directory ");
app.use(express.static(path.join(appRoot.path, 'app')));
app.use(express.static(path.join(appRoot.path, 'public')));

app.get('/', function(req, res){
  logger.info("appRoot.path: ", appRoot.path);
  logger.info(appRoot.path + '/public/app/index.html');
  res.sendfile(appRoot.path + '/public/app/index.html');
});

app.get('/admin', function(req, res){
  res.sendfile(appRoot.path + '/public/app/index.html');
});

app.get('/admin/*', function(req, res){
  res.sendfile(appRoot.path + '/public/app/index.html');
});

//logs
//app.use(logger('dev'));

// CORS
logger.info("[app] CORS enabled ");
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, set-cookie, x-access-token, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
  next();
});

// Body parser
logger.info("[app] Body parser ");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(busboyBodyParser({ limit: '10mb' }));

// Routes API file for interacting with MongoDB
logger.info("[app] Routes APIs ");
app.use(api);

// secrete
app.set("secret", config.security.secrete);

// setting port
app.set('port', process.env.PORT || 3000);

module.exports  = app;
