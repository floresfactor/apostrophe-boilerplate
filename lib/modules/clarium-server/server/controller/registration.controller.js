const express  = require('express');
const DAO      = require('../dao/mongo.dao');
const SysaidDAO = require('../dao/sysaid-users.dao');
const crypto    = require('../helper/crypto');
const jwt        = require('jsonwebtoken');
const config     = require('../config/config');
const request    = require('sync-request');
const emailer    = require('../helper/mailer');
const { check, validationResult } = require('express-validator/check');
const logger      = require('../config/logger');

const saltRounds = 10;
const COLLECTION = "users";
const CONTROLLER = "registration";

module.exports = exports = {

  registration: function(req, res){
    logger.info("[%s][controller] registration", CONTROLLER);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.info("[%s][controller] registration ", CONTROLLER, errors.array());
      return res.status(422).json({ errors: errors.array() });
    }
    var user = req.body.user;
    var campaignId = req.body.campaignId;
    var remoteAddress = getIpAddress(req);
    var location = request('GET', config.ipApi.url + remoteAddress);

    var hash = crypto.encrypt(user.password);

    user.password = hash;
    user.roles = ['client'];

    DAO.insertOne(COLLECTION, user, req.decoded).then(function(data){
      logger.info(data);
      user["_id"] = data._id;

      DAO.insertOne("campaigns-clients", {
        userId: user._id,
        campaignId: campaignId,
        ip: remoteAddress,
        location:JSON.parse(location.getBody('utf8'))
      });
      emailer.send({
          to: config.support.emailTo,
          cc: config.support.emailCc,
          subject: 'Successful registration ' + user.name + ' ' + user.lastName ,
          html: 'Successful registration ' + user.name + ' ' + user.lastName
      });
      res.json({user: user});

    }).catch(function (error) {
      res.status(500).json(error);
    });

  },
}

var getIpAddress =function(req){
  return req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);
}
