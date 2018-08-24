const express  = require('express');
const DAO      = require('../dao/mongo.dao');
const COLLECTION = "campaigns";
const logger      = require('../config/logger');

const { check, validationResult } = require('express-validator/check');


module.exports = exports = {

  find: function(req, res){
    logger.info("[controller] find", req.query);
    DAO.find(COLLECTION, req.query).then(function(data){
			res.json(data);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  },

  findById: function(req, res){

    logger.info("[%s][controller] findByID", COLLECTION);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
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
    logger.info("[%s][controller] insertOne", COLLECTION);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    DAO.insertOne(COLLECTION, req.body, req.decoded).then(function(data){
			res.json(data);
      logger.info(data);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  },

  updateOne: function(req, res){
    logger.info("[%s][controller] updateOne", COLLECTION);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    DAO.updateOne(COLLECTION, req.body, req.decoded).then(function(data){

      logger.info("[controller] updateOne then");
			res.json(data);

    }).catch(function (error) {
      logger.info("[controller] updateOne catch");
      res.status(500).json(error);
    });
  },

  deleteOne: function(req, res){
    logger.info("[%s][controller] deleteOne", COLLECTION);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    DAO.deleteOne(COLLECTION, req.params.id, req.decoded).then(function(data){
			res.json(data);
      logger.info(data);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  }

}
