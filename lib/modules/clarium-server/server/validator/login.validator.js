const { check, validationResult } = require('express-validator/check');

module.exports = exports = {
  signin: [
    check('credentials.username').exists(),
    check('credentials.password').exists()
  ]
}
