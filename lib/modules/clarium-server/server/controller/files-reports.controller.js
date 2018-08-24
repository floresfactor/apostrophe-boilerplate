const express     = require('express');
const filemanager = require('../helper/filemanager');
const path        = require('path');
const mime        = require('mime');
const config      = require('../config/config');
const appRoot     = require('app-root-path');
const logger      = require('../config/logger');
const DAO         = require('../dao/mongo.dao');
const COLLECTION  = 'files';

var getCuttentDir= function(){
  if(config.filemanager.appRootEnabled){
    return appRoot.path + config.filemanager.baseDirectory;
  }else{
    return config.filemanager.baseDirectory;
  }
}

module.exports = exports = {

  findByUserId: function(req, res){
    DAO.findByQuery(COLLECTION, {query: {userId: String(req.params.id)}, sort:{name:1}} ).then(function(data){
			res.json(data);
    }).catch(function (error) {
      logger.error("[%s][controller][error] find %s",COLLECTION, error);
      res.status(500).json(error);
    });
  },

  find: function(req, res){
    DAO.findByQuery(COLLECTION, {query: {type:'report'}} ).then(function(data){
			res.json(data);
    }).catch(function (error) {
      logger.error("[%s][controller][error] find %s",COLLECTION, error);
      res.status(500).json(error);
    });
  },

  insertOne: function(req, res){
    var file = req.files.file;
    var id = req.params.id;
    var currentDir  = getCuttentDir();
    currentDir = path.join(currentDir, 'users')
    currentDir = path.join(currentDir, id)

    if(file){
      var obj = {name: file.name, mimetype: file.mimetype, type: 'reports', currentDir: currentDir, userId: id, timestamp: new Date()};
      DAO.insertOne(COLLECTION, obj, req.decoded).then(function(data){
        var filename = path.join(currentDir, file.name);

        if(!filemanager.existsDirectory(currentDir)){
          filemanager.createDirectory(currentDir).then(()=>{
            filemanager.saveFile(filename, req.files.file.data).then(()=>{
              res.json([]);
            }).catch((error)=>{
              logger.error("[%s][controller][error] uploadFile %s",COLLECTION,  error);
              res.status(500).json(error);
            })
          }).catch((error)=>{
            logger.error("[%s][controller][error] uploadFile %s",COLLECTION,  error);
            res.status(500).json(error);
          });
        } else {
          filemanager.saveFile(filename, req.files.file.data).then(()=>{
            res.json([]);
          }).catch((error)=>{
            logger.error("[%s][controller][error] uploadFile %s",COLLECTION,  error);
            res.status(500).json(error);
          })
        }



      }).catch(function (error) {
        logger.error("[%s][controller][error] insertOne %s",COLLECTION,  error);
        res.status(500).json(error);
      });
    }else{
      logger.error("[%s][controller][error] insertOne %s",COLLECTION,  error);
      res.status(422).json({error: 'no file present'});
    }
  },

  deleteOne: function(req, res){
    logger.info("[%s][controller] deleteOne", COLLECTION);
    DAO.deleteOne(COLLECTION, req.params.id, req.decoded).then(function(data){
			res.json(data);
    }).catch(function (error) {
      logger.error("[%s][controller][error] deleteOne %s",COLLECTION,  error);
      res.status(500).json(error);
    });
  },
}
