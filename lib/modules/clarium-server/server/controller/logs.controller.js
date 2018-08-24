const express     = require('express');
const DAO         = require('../dao/mongo.dao');
const appRoot     = require('app-root-path');
const config      = require('../config/config');
const logger      = require('../config/logger');

const COLLECTION  = "logs";

module.exports = exports = {

  count: function(req, res){
    logger.info("[controller] find");
    DAO.count(COLLECTION, req.query).then(function(data){
      res.json(data);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  },

  find: function(req, res){
    logger.info("[controller] find", req.decoded);
    var params = req.query || {};
    params.sort = {"timestamp":-1};

    logger.info(params);
    DAO.find(COLLECTION, params).then(function(data){
			res.json(data);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  },

  findById: function(req, res){
    logger.info("[controller] findByID", req.params.id);
    DAO.findById(COLLECTION, req.params.id).then(function(data){
      res.json(data);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  },

  findByQuery: function(req, res){
    logger.info("[controller] findByQuery");
    DAO.findByQuery(COLLECTION, req.params.query).then(function(data){
			res.json(data);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  },

  insertOne: function(req, res){
    logger.info("[controller] insertOne: ", req.body);
    DAO.insertOne(COLLECTION, req.body).then(function(data){
			res.json(data);
      logger.info(data);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  },

  updateOne: function(req, res){
    logger.info("[controller] updateOne: body: ", req.body);
    DAO.updateOne(COLLECTION, req.body).then(function(data){

      logger.info("[controller] updateOne then");
			res.json(data);

    }).catch(function (error) {
      logger.info("[controller] updateOne catch");
      res.status(500).json(error);
    });
  },

  deleteOne: function(req, res){
    logger.info("[controller] deleteOne: id: ", req.params.id);
    DAO.deleteOne(COLLECTION, req.params.id).then(function(data){
			res.json(data);
      logger.info(data);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  },
}
