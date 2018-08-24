const express     = require('express');
const filemanager = require('../helper/filemanager');
const path        = require('path');
const mime        = require('mime');
const config      = require('../config/config');
const appRoot     = require('app-root-path');

var getCuttentDir= function(){
  if(config.filemanager.appRootEnabled){
    return appRoot.path + config.filemanager.baseDirectory;
  }else{
    return config.filemanager.baseDirectory;
  }
}

module.exports = exports = {

  find: function(req, res){
    var currentDir  = getCuttentDir();
    var query = req.query.path || '';
    if (query) currentDir = path.join(currentDir, query);
    console.log("[controller][files] browsing ", currentDir);

    filemanager.lstat(currentDir).then((stats) =>{
      if(stats.isDirectory()){
        filemanager.readdir(currentDir, query).then((data) =>{
          res.json(data);
        }).catch((e) =>{
          console.log(e);
          res.json(e);
        });
      }else{
        console.log("download", currentDir);
        res.download(currentDir, path.basename(currentDir));
      }
    }).catch((e) => {
      console.log(e);
      res.json([]);
    });
  },

  uploadFile: function(req, res){
    var currentDir  = getCuttentDir();
    var query = req.body.path || '';
    if (query) currentDir = path.join(currentDir, query);
    var filename = path.join(currentDir, req.files.file.name);
    filemanager.saveFile(filename, req.files.file.data).then(()=>{
      res.json([]);
    }).catch((e)=>{
      res.json(e);
      console.log(e);
    })
  },

  createDirectory: function(req, res){
    var currentDir  = getCuttentDir();
    var query = req.body.path || '';
    if (query) currentDir = path.join(currentDir, query);
    filemanager.createDirectory(currentDir).then(()=>{
      res.json([]);
    }).catch((e)=>{
      res.json(e);
    });
  }
}
