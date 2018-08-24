const { check, validationResult } = require('express-validator/check');
const DAO         = require('../dao/mongo.dao');
const validator   = require('validator');
const USERS       = "users";

const CLIENTS_ASSETS  = 'clients-assets';

module.exports = exports = {
  deleteOne:[
    check('id', 'ID must be valid ID').custom((value, { req }) => {
      return (value) ? validator.isMongoId(value) : false;
    }),
    check('id','File is assigned to a client, cannot be deleted').custom(async (value) => {
      return await DAO.findByQuery(CLIENTS_ASSETS, { query: {"assetId": value} }).then(function(data){
        console.log(data);
        if(data && data.length > 0){
          return false;
        }
        return true;
      }).catch( error => false );
    }),
  ]

}
