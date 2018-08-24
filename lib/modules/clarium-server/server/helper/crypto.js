const crypto = require('crypto');
const config = require('../config/config');


module.exports = {
  encrypt: function(password){
    const key = crypto.pbkdf2Sync(password, config.security.secret, config.security.iterations, 64, 'sha512');
    return key.toString('hex');
  }
}
