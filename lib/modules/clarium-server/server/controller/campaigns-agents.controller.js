const express     = require('express');
const DAO         = require('../dao/mongo.dao');
const COLLECTION  = "campaigns-agents";
const logger      = require('../config/logger');

module.exports = exports = {

  find: function(req, res){
    logger.info("[%s][controller] find %s", COLLECTION,  req.query);
    DAO.find(COLLECTION, req.query).then(function(data){
			res.json(data);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  },

  findAgentsByCampaign: function(req, res){
    logger.info("[%s][controller] findAgentsByCampaign %s", COLLECTION,  req.params.id);

    var params = { filter: {"campaignId": req.params.id} };
    var promises = [];

    DAO.find(COLLECTION, params).then(function(data){
      for (let i = 0; i < data.length; i++) {
        var obj = data[i];


        promises.push(new Promise((resolve,reject) => {

          DAO.findById("users", obj["userId"]).then(function(user){
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
      res.status(500).json(error);
    });
  },

  findCampaignsByAgent: function(req, res){
    logger.info("[%s][controller] findCampaignsByAgent %s", COLLECTION,  req.params.id);

    var params = { filter: {"userId": req.params.id} };
    var promises = [];
    var result = []

    DAO.find(COLLECTION, params).then(function(data){
      for (let i = 0; i < data.length; i++) {
        promises.push(new Promise((resolve,reject) => {
          var obj = data[i];
          DAO.findById("campaigns", obj["campaignId"]).then(function(campaign){
            resolve(campaign);
          }).catch(function (error) {
            resolve(error);
          });
        }));
      }
      return Promise.all(promises).then((users)=>{
        res.json(users);
      });
    }).catch(function (error) {
      res.status(500).json(error);
    });
  },

  insertOne: function(req, res){
    logger.info("[%s][controller] insertOne", COLLECTION);

    DAO.insertOne(COLLECTION, req.body).then(function(data){
			res.json(data);
    }).catch(function (error) {
      res.status(500).json(error);
      logger.info("[controller] [catch]",COLLECTION,  error);
    });
  },

  deleteOne: function(req, res){
    logger.info("[%s][controller] deleteOne", COLLECTION);

    DAO.deleteOne(COLLECTION, req.params.id).then(function(data){
			res.json(data);
    }).catch(function (error) {
      logger.info("[controller] [catch]",COLLECTION,  error);
      res.status(500).json(error);
    });
  },

  updateOne: function(req, res){
    logger.info("[%s][controller] updateOne", COLLECTION);

    DAO.updateOne(COLLECTION, req.body).then(function(data){
			res.json(data);
    }).catch(function (error) {
      logger.info("[%s][controller] error", COLLECTION, error);

      res.status(500).json(error);
    });
  },

}
