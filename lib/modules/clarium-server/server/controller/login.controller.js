const express  = require('express');
const DAO      = require('../dao/mongo.dao');
const SysaidDAO = require('../dao/sysaid-users.dao');
const crypto     = require('../helper/crypto');
const jwt        = require('jsonwebtoken');
const config     = require('../config/config');
const request    = require('request');
const emailer    = require('../helper/mailer')
const logger      = require('../config/logger');

const saltRounds = 10;
const COLLECTION = "users";

const { check, validationResult } = require('express-validator/check');


module.exports = exports = {

  signin: function(req, res){
    logger.info("[controller] signin",  req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // find username
    DAO.findByUsername(COLLECTION, req.body.credentials.username).then(function(data){
      var user = data[0];
      if(!user){
        // user not found
        res.status(401).send({message: 'Access Denied'});
      }else{
        // check password
        var hash = crypto.encrypt(req.body.credentials.password);

        // wrong password
        if(hash != user.password){
          res.status(401).send({message: 'Access Denied'});
        }else{
          // generate token
          user['password'] = undefined;
          var token = jwt.sign({user: user}, config.security.secret, { expiresIn: config.security.tokenExpiresIn });

          // login on sysaid
           SysaidDAO.login(req.body.credentials.username, req.body.credentials.password).then(function(data){
             res.json({user: user, token: token, sysaid: data});
           }).catch(function (error) {
             res.json({user: user, token: token});
           });
        }
      }
    }).catch(function (error) {
      logger.info("error: %s", error);
      res.status(500).send({error: error, message: error});
    });
  },

}
