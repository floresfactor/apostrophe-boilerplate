const { check, validationResult } = require('express-validator/check');

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

  find: function(req, res){
    DAO.findByQuery(COLLECTION, {query: {type:'common-files'}} ).then(function(data){
			res.json(data);
    }).catch(function (error) {
      logger.error("[%s][controller][error] find %s",COLLECTION, error);
      res.status(500).json(error);
    });
  },

  insertOne: function(req, res){
    var file = req.files.file;
    var currentDir  = getCuttentDir();
    currentDir = path.join(currentDir, 'common-assets')

    if(file){
      var obj = {name: file.name, mimetype: file.mimetype, type: 'common-files', currentDir: currentDir, timestamp: new Date() };
      DAO.insertOne(COLLECTION, obj, req.decoded).then(function(data){
        var filename = path.join(currentDir, file.name);

        filemanager.saveFile(filename, req.files.file.data).then((f)=>{

          console.log(f);
          res.json([]);
        }).catch((error)=>{
          logger.error("[%s][controller][error] uploadFile %s",COLLECTION,  error);
          res.status(500).json(error);
        })

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
}
