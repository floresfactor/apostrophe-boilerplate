const jwt        = require('jsonwebtoken');
const config     = require('../config/config');

module.exports = {

  secureUrl: function(req, res, next){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(config.security.enabled){
      if (token) {

        jwt.verify(token, config.security.secret , function(err, decoded) {
          if (err) {
            return res.status(401).send({message: 'Access Denied', code:'INVALID_KS', error: err});
          } else {
            req.decoded = decoded;
            next();
          }
        });
      } else {
        return res.status(401).send({
            success: false,
            message: 'No token provided.'
        });
      }
    }else{
      next();
    }

  },

  generateSecurityLog: function(decoded, collection, operation, data, req){

    decoded = decoded || {};
    return {
      user: decoded.user,
      collection: collection,
      operation: operation,
      timestamp: new Date(),
      data: data
    }
  }
}
