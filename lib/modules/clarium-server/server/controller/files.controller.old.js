const express  = require('express');
const DAO      = require('../dao/mongo.dao');
const COLLECTION = "fs.files";
const logger      = require('../config/logger');


module.exports = exports = {

  find: function(req, res){
    logger.info("[controller] find", req.decoded);
    DAO.find(COLLECTION, req.query).then(function(data){
			res.json(data);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  },

  //TODO finish implementation
  download: function(req, res){
    logger.info("[controller] download", req.decoded);
    DAO.download(COLLECTION, req.params.id).then(function(data){
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-disposition': 'attachment; filename=data.json'
      });
      res.write(data);
      res.end();

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

  insertOneFile: function(req, res){
    logger.info("[controller] insertOneFile: ", req.files.file);

    DAO.insertOneFile(COLLECTION, req.files.file).then(function(data){
			res.json(data);
      logger.info(data);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  },

  updateOne: function(req, res){
    logger.info("[controller] updateOne: body: ", req.body);
    DAO.updateOne(COLLECTION, req.body).then(function(data){
			res.json(data);
      logger.info(data);
    }).catch(function (error) {
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
  }

}
