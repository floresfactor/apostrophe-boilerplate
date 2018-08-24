const { check, validationResult } = require('express-validator/check');
const DAO         = require('../dao/mongo.dao');
const validator   = require('validator');
const USERS       = "users";

const COLLECTION  = "clients-assets";

module.exports = exports = {
  deleteOne:[
    check('id', 'ID must be valid ID').custom((value, { req }) => {
      return (value) ? validator.isMongoId(value) : false;
    }),
  ],
}
