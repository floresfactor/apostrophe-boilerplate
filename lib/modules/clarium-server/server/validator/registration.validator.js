const DAO         = require('../dao/mongo.dao');
const config      = require('../config/config');
const validator   = require('validator');
const { check, validationResult } = require('express-validator/check');

module.exports = exports = {
  registration: [
    check('user').exists(),
    check('user.name','Name is required').exists(),
    check('user.username','Username is required').exists(),
    check('user.password', 'Password is required').exists(),
    check('campaignId', 'campaignId must be valid ID').custom((value, { req }) => {
      if(value){
        return validator.isMongoId(value);
      }else{
        return true;
      }
    })
  ]
}
