const express     = require('express');
const DAO         = require('../dao/mongo.dao');
const COLLECTION  = "campaigns-clients";
const logger      = require('../config/logger');


module.exports = exports = {

  find: function(req, res){
    logger.info("[controller] find", req.query);
    DAO.find(COLLECTION, req.query).then(function(data){
			res.json(data);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  },

  findUsers: function(req, res){
    logger.info("[controller] findByUserId", req.params.id);
    var params = { filter: {"campaignId": req.params.id} };
    var promises = [];

    DAO.find(COLLECTION, params).then(function(data){
      for (let i = 0; i < data.length; i++) {
        promises.push(new Promise((resolve,reject) => {
          var obj = data[i];
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

  insertOne: function(req, res){
    logger.info("[controller] [insertOne]", COLLECTION , req.body);
    DAO.insertOne(COLLECTION, req.body).then(function(data){
			res.json(data);
    }).catch(function (error) {
      res.status(500).json(error);
      logger.info("[controller] [catch]",COLLECTION,  error);
    });
  },

  deleteOne: function(req, res){
    logger.info("[controller] [deleteOne]: ", COLLECTION , req.params.id);
    DAO.deleteOne(COLLECTION, req.params.id).then(function(data){
			res.json(data);
    }).catch(function (error) {
      logger.info("[controller] [catch]",COLLECTION,  error);
      res.status(500).json(error);
    });
  },

  updateOne: function(req, res){
    logger.info("[controller] updateOne: body: ", COLLECTION, req.body);
    DAO.updateOne(COLLECTION, req.body).then(function(data){
			res.json(data);
    }).catch(function (error) {
      logger.info("[controller] [catch]",COLLECTION,  error);
      res.status(500).json(error);
    });
  },

}
