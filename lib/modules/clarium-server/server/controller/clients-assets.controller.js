const { check, validationResult } = require('express-validator/check');

const express     = require('express');
const DAO         = require('../dao/mongo.dao');
const logger      = require('../config/logger');

const COLLECTION  = "clients-assets";


module.exports = exports = {

  find: function(req, res){
    logger.info("[controller] find", req.query);
    DAO.find(COLLECTION, req.query).then(function(data){
			res.json(data);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  },

  findByUserId: function(req, res){
    logger.info("[%s][controller] findByUserId", COLLECTION);
    var params = { filter: {"userId": req.params.id} };
    var promises = [];

    DAO.find(COLLECTION, params).then(function(data){
      for (let i = 0; i < data.length; i++) {
        promises.push(new Promise((resolve,reject) => {
          var obj = data[i];
          DAO.findById("files", obj["assetId"]).then(function(file){
            data[i].file = file;
            resolve(data[i]);
          }).catch(function (error) {
            resolve(error);
          });
        }));
      }
      return Promise.all(promises).then((files)=>{
        res.json(files);
      });
    }).catch(function (error) {
      res.status(500).json(error);
    });
  },

  insertMany: function(req, res){
    logger.info("[%s][controller] [insertMany] %s", COLLECTION , req.body);
    var promises = [];
    for (var i = 0; i < req.body.length; i++) {
      promises.push(new Promise((resolve,reject) => {
        var obj = req.body[i];
        var params = { query: {$and : [{"userId": String(obj.userId)}, {"assetId": String(obj.assetId)}] } };
        var promises = [];
        DAO.findByQuery(COLLECTION, params).then(function(asset){
          if(asset.length == 0){
            resolve({"status": 0, data: obj});
          }else{
            resolve({"status": 1, data: asset[0]});
          }
        }).catch(function (error) {
          reject(error);
        });
      }));
    }
    return Promise.all(promises).then((assets)=>{
      var list = [];
      for (var i = 0; i < assets.length; i++) {
        if(assets[i].status == 0){
          list.push(assets[i].data)
        }
      }

      DAO.insertMany(COLLECTION, list).then(function(data){
  			res.json(data);
      }).catch(function (error) {
        res.status(500).json(error);
        logger.info("[controller] [catch]",COLLECTION,  error);
      });

    }).catch((e)=>{
      res.status(500).json(error);
      logger.info("[controller] [catch]",COLLECTION,  error);
    });
  },

  deleteOne: function(req, res){
    logger.info("[controller] [deleteOne]: ", COLLECTION , req.params.id);

    logger.info("[%s][controller] deleteOne", COLLECTION);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

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
