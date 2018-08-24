const { check, validationResult } = require('express-validator/check');
const DAO         = require('../dao/mongo.dao');
const validator   = require('validator');
const AGENTS_ASSIGNMENTS  = 'agents-assignments';

module.exports = exports = {

  insertOne:[
    check('agentId', 'ID must be valid ID').custom((value, { req }) => {
      return (value) ? validator.isMongoId(value) : false;
    }),
    check('clientId', 'ID must be valid ID').custom((value, { req }) => {
      return (value) ? validator.isMongoId(value) : false;
    }),

    check('clientId','Client already assigned').custom(async (value, {req}) => {
      return await DAO.findByQuery(AGENTS_ASSIGNMENTS,{
        query: {$and : [ {"agentId": req.body.agentId}, {"clientId": value} ]}
      }).then(function(data){
        if(data && data.length > 0){
          return false;
        }
        return true;
      }).catch( error => false );
    }),

  ],

  updateOne:[
    check('agentId', 'ID must be valid ID').custom((value, { req }) => {
      return (value) ? validator.isMongoId(value) : false;
    }),
    check('clientId', 'ID must be valid ID').custom((value, { req }) => {
      return (value) ? validator.isMongoId(value) : false;
    }),
  ],

  deleteOne:[
    check('id', 'ID must be valid ID').custom((value, { req }) => {
      return (value) ? validator.isMongoId(value) : false;
    }),
  ],
}
