const { check, validationResult } = require('express-validator/check');
const validator   = require('validator');

module.exports = exports = {
  findById:[
    check('id', 'ID must be valid ID').custom((value, { req }) => {
      if(value){ return validator.isMongoId(value);
      }else{ return true; }
    })
  ],

  insertOne:[
    check('name','Name is required').exists().custom((value) => {
      return (value) ? !validator.isEmpty(value) : false;
    })
  ],

  updateOne:[
    check('name','Name is required').exists().custom((value) => {
      return (value) ? !validator.isEmpty(value) : false;
    })
  ],

  deleteOne:[
    check('id', 'ID must be valid ID').custom((value, { req }) => {
      return (value) ? validator.isMongoId(value) : false;
    })
  ],
}
