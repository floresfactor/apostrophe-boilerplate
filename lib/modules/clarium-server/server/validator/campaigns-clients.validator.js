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
    }),
    check('lastName','Last Name is required').exists().custom((value) => {
      return (value) ? !validator.isEmpty(value) : false;
    }),
    check('username','Username is required').exists().custom((value) => {
      return (value) ? !validator.isEmpty(value) : false;
    }),
    check('email','Email is required').exists().custom((value) => {
      return (value) ? !validator.isEmpty(value) : false;
    }),
    check('email','Email must be valid').custom((value, { req }) => {
      return (value) ? validator.isEmail(value) : false;
    }),
  ],

  updateOne:[
    check('name','Name is required').exists().custom((value) => {
      return (value) ? !validator.isEmpty(value) : false;
    }),
    check('lastName','Last Name is required').custom((value) => {
      return (value) ? !validator.isEmpty(value) : false;
    }),
    check('username','Username is required').custom((value) => {
      return (value) ? !validator.isEmpty(value) : false;
    }),
    check('email','Email is required').custom((value) => {
      return (value) ? !validator.isEmpty(value) : false;
    }),
    check('email','Email must be valid').custom((value, { req }) => {
      return (value) ? validator.isEmail(value) : false;
    }),
    check('_id', 'ID must be valid ID').custom((value, { req }) => {
      return (value) ? validator.isMongoId(value) : false;
    }),
    check('username','User already exist').custom(async (value, {req}) => {
      return await DAO.findByQuery(USERS, { query: { username: value } }).then(function(data){
        if(data && data.length > 0){
          if(data[0]._id == req.body._id){
            return true;
          }
          return false;
        }
        return true;
      }).catch( error => false );
    }),
  ],

  deleteOne:[
    check('id', 'ID must be valid ID').custom((value, { req }) => {
      return (value) ? validator.isMongoId(value) : false;
    }),
    check('id','User has client assigned, cannot be deleted until reassign clients').custom(async (value) => {
      return await DAO.findByQuery(AGENTS_ASSIGNMENTS, { query: {"agentId": value} }).then(function(data){
        console.log(data);
        if(data && data.length > 0){
          return false;
        }
        return true;
      }).catch( error => false );
    }),
  ],
}
