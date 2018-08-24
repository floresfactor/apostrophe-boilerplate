const { check, validationResult } = require('express-validator/check');
const express     = require('express');
const logger      = require('../config/logger');

const DAO         = require('../dao/mongo.dao');
const COLLECTION  = "agents-assignments";

module.exports = exports = {

  find: function(req, res){
    logger.info("[%s][controller] find", COLLECTION);

    DAO.find(COLLECTION, req.query).then(function(data){
			res.json(data);
    }).catch(function (error) {
      logger.error("[%s][controller] [catch] %s",COLLECTION,  error);

      res.status(500).json(error);
    });
  },

  findClientsByAgentId: function(req, res){
    logger.info("[%s][controller] findClientsByAgentId", COLLECTION);

    var params = { filter: {"agentId": req.params.id} };
    var promises = [];

    DAO.find(COLLECTION, params).then(function(data){
      for (let i = 0; i < data.length; i++) {
        promises.push(new Promise((resolve,reject) => {
          var obj = data[i];
          DAO.findById("users", obj["clientId"]).then(function(user){
            data[i].user = user;
            resolve(data[i]);
          }).catch(function (error) {
            resolve(error);
          });
        }));
      }
      return Promise.all(promises).then((users)=>{
        res.json(users);
      });
    }).catch(function (error) {
      logger.error("[%s][controller] [catch] %s",COLLECTION,  error);

      res.status(500).json(error);
    });
  },

  findAgentsByClientId: function(req, res){
    logger.info("[%s][controller] findAgentsByClientId", COLLECTION);

    var params = { filter: {"clientId": req.params.id} };
    var promises = [];

    DAO.find(COLLECTION, params).then(function(data){
      for (let i = 0; i < data.length; i++) {
        promises.push(new Promise((resolve,reject) => {
          var obj = data[i];
          DAO.findById("users", obj["agentId"]).then(function(user){
            data[i].user = user;
            resolve(data[i]);
          }).catch(function (error) {
            resolve(error);
          });
        }));
      }
      return Promise.all(promises).then((users)=>{
        res.json(users);
      });
    }).catch(function (error) {
      logger.error("[%s][controller] [catch] %s",COLLECTION,  error);

      res.status(500).json(error);
    });
  },

  insertOne: function(req, res){
    logger.info("[%s][controller] insertOne", COLLECTION);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    DAO.insertOne(COLLECTION, req.body).then(function(data){
			res.json(data);
    }).catch(function (error) {
      res.status(500).json(error);
      logger.error("[%s][controller] [catch] %s",COLLECTION,  error);
    });
  },

  deleteOne: function(req, res){
    logger.info("[%s][controller] deleteOne", COLLECTION);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    DAO.deleteOne(COLLECTION, req.params.id).then(function(data){
			res.json(data);
    }).catch(function (error) {
      logger.error("[%s][controller] [catch] %s",COLLECTION,  error);
      res.status(500).json(error);
    });
  },

  updateOne: function(req, res){
    logger.info("[%s][controller] updateOne", COLLECTION);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    DAO.updateOne(COLLECTION, req.body).then(function(data){
			res.json(data);
    }).catch(function (error) {
      logger.error("[%s][controller] [catch] %s",COLLECTION,  error);

      res.status(500).json(error);
    });
  },

}
