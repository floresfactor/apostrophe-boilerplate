const express     = require('express');
const logger      = require('../config/logger');
const DAO         = require('../dao/mongo.dao');
const appRoot     = require('app-root-path');
const crypto      = require('../helper/crypto');
const fs          = require('fs');
const cloudinary  = require('cloudinary');
const config      = require('../config/config');

const { check, validationResult } = require('express-validator/check');

const COLLECTION  = "users";
const saltRounds = 10;

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret
});

module.exports = exports = {

  count: function(req, res){
    logger.info("[%s][controller] count %s", COLLECTION,  req.query);
    DAO.count(COLLECTION, req.query).then(function(data){
      res.json(data);
    }).catch(function (error) {
      logger.error("[%s][controller][error] count %s",COLLECTION, error);
      res.status(500).json(error);
    });
  },

  find: function(req, res){
    logger.info("[%s][controller] find %s", COLLECTION,  req.query);
    DAO.find(COLLECTION, req.query).then(function(data){
			res.json(data);
    }).catch(function (error) {
      logger.error("[%s][controller][error] find %s",COLLECTION, error);
      res.status(500).json(error);
    });
  },

  findById: function(req, res){
    logger.info("[%s][controller] findByID %s", COLLECTION, req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    DAO.findById(COLLECTION, req.params.id).then(function(data){
      res.json(data);
    }).catch(function (error) {
      logger.error("[%s][controller][error] findById %s",COLLECTION,  error);
      res.status(500).json(error);
    });
  },

  findByQuery: function(req, res){
    logger.info("[%s][controller] findByQuery %s", COLLECTION, req.params.query);
    DAO.findByQuery(COLLECTION, req.params.query).then(function(data){
			res.json(data);
    }).catch(function (error) {
      logger.error("[%s][controller][error] findByQuery %s",COLLECTION,  error);
      res.status(500).json(error);
    });
  },

  insertOne: function(req, res){
    logger.info("[%s][controller] insertOne %s", COLLECTION);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    DAO.insertOne(COLLECTION, req.body, req.decoded).then(function(data){
			res.json(data);
      logger.info(data);
    }).catch(function (error) {
      logger.error("[%s][controller][error] insertOne %s",COLLECTION,  error);
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
			res.json(data);
    }).catch(function (error) {
      logger.error("[%s][controller][error] updateOne %s",COLLECTION,  error);
      res.status(500).json(error);
    });
  },

  updatePassword: function(req, res){
    logger.info("[%s][controller] updatePassword", COLLECTION);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    var hash = crypto.encrypt(req.body.password);
    DAO.updateOne(COLLECTION, {_id: req.body._id, password: hash}, req.decoded).then(function(data){
      res.json(data);
    }).catch(function (error) {
      logger.error("[%s][controller][error] updateOne %s",COLLECTION,  error);
      res.status(500).json(error);
    });

  },

  setPassword: function(req, res){
    logger.info("[%s][controller] setPassword", COLLECTION);

    var hash = crypto.encrypt(req.body.password);
    DAO.updateOne(COLLECTION, {_id: req.body._id, password: hash}, req.decoded).then(function(data){
      res.json(data);
    }).catch(function (error) {
      logger.error("[%s][controller][error] updateOne %s",COLLECTION,  error);
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
    }).catch(function (error) {
      logger.error("[%s][controller][error] deleteOne %s",COLLECTION,  error);
      res.status(500).json(error);
    });
  },

  uploadPictue:function(req, res){
    logger.info("[%s][controller] uploadPictue", COLLECTION);

    if(req.files && req.files.file){
      var file = req.files.file;
      var id = req.params.id;
      var path = appRoot.path + "/uploads/"+id;
      fs.writeFile(path, file["data"], function (error) {
        if (error) {
          logger.info("[%s][controller][error] uploadPictue",COLLECTION,  error);
          res.json({error: err});
        };
        cloudinary.uploader.upload(path, function(result) {
          fs.unlink(path,function(error){
            if(error) {
              logger.info("[%s][controller][error] uploadPictue cloudinary %s",COLLECTION,  error);
              return res.status(422).json({ errors: [err] });
            }
            logger.info('file deleted successfully');
          });
          res.json({"profilePicture":result.url});
        });
      });
    }else {
      return res.status(422).json({ errors: [
        {"location":"req","param":"files","value":"","msg":"Files is required"}
      ] });
    }
  }

}
