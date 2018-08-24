const fs = require('fs');
const path = require('path');
const util = require('util');
const dir =  process.cwd();
const _ = require('lodash');
const logger      = require('../config/logger');

module.exports = {

  lstat: function(currentDir){
    return new Promise((resolve, reject) => {
      fs.lstat(currentDir, (err, stats) => {
        if(err){
          reject(err);
        }else{
          resolve(stats);
        }
      })
    });
  },

  existsDirectory:function(path){
    return fs.existsSync(path);
  },

  readdir: function(currentDir, query){
    return new Promise((resolve, reject) => {
      fs.readdir(currentDir, function (err, files) {
          if (err) {
             console.log(err);
             reject(err);
             return;
           }
           var data = [];
           var dir = "";

           files.filter(function (file) {
               return true;
           }).forEach(function (file) {
             try {
               var stat = fs.statSync(path.join(currentDir,file));
               if (stat.isDirectory()) {

                 var dir = getDirectoryFromFile(query);

                 data.push({
                   name : file,
                   isDirectory: true,
                   path : path.join(query, file),
                   label: file,
                   dir: dir,
                   data: file,
                   expandedIcon: "fa fa-folder-open",
                   collapsedIcon: "fa fa-folder",
                   children: [{}]
                 });


               } else {
                 var ext = path.extname(file);
                dir = getDirectoryFromFile(query);
                if((/(^|\/)\.[^\/\.]/g).test(file)){

                }else{
                  var icon = "";

                  if(ext == '.txt'){
                    icon= "fa fa-file-text-o";
                  }else if(ext == '.doc' || ext == '.dot' || ext == '.docx' || ext == '.dotx'){
                    icon = "fa fa-file-word-o";
                  }else if(ext == '.xls' || ext == '.xlt' || ext == '.xlm' || ext == '.xlsx'){
                    icon= "fa fa-file-excel-o";
                  }else if(ext == '.ppt' || ext == '.ppt' || ext == '.pps' || ext == '.pptx'){
                    icon ="fa fa-file-powerpoint-o";
                  }else if(ext == '.pdf'){
                    icon = "fa fa-file-pdf-o";
                  }else if(ext == '.gif' || ext == '.jpeg'|| ext == '.jpg'|| ext == '.png'){
                    icon = "fa fa-file-image-o";
                  }else if(ext == '.rar' || ext == '.zip'){
                    icon = "fa fa-file-archive-o";
                  }else{
                    icon = "fa fa-file-o";
                  }

                  data.push({
                    name: file,
                    ext: ext,
                    dir: dir,
                    label: file,
                    data: file,
                    icon: icon,
                    isDirectory: false,
                    path : path.join(query, file)
                  });
                }
               }

             } catch(e) {
               reject(e);
               console.log(e);
             }

           });
           data = _.sortBy(data, function(file) {
             return  file.name;
           });
           var sorted = [];

           for (var i = 0; i < data.length; i++) {
             if(data[i].isDirectory){
               sorted.push(data[i]);
             }
           }

           for (var i = 0; i < data.length; i++) {
             if(!data[i].isDirectory){
               sorted.push(data[i]);
             }
           }
           resolve(sorted);
       });
    });
  },

  createDirectory(path){
    return new Promise((resolve, reject) => {
      fs.mkdir(path, parseInt('755', 8), function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  },

  saveFile(filePath, body ){
    console.log("filePath");
    return new Promise((resolve, reject) => {
      fs.appendFile(filePath, body, function(err) {
        if(err){
          console.log(err);
          reject(err);
        }else{
          resolve();
        }
      });
    });

  }
}

var getDirectoryFromFile = function(file){
  var routes = file.split("/");
  var result = "";
  for (var i = 0; i < routes.length; i++) {
    result = path.join(result, routes[i]);
  }
  return result
}
