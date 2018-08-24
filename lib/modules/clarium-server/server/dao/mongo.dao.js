const express 	  = require('express');
const db          = require('../helper/mongo.client');
const Security    = require('../helper/security.middleware');
const logger      = require('../config/logger');

module.exports = exports = {

  count: function(collection, params){
    logger.info("[%s][dao] count", collection);

    params = params || {};

    var atts = [];
    var filter = {};
    var sort = {};
    if(params.filter){
      filter = {$or :atts};
      for (var i = 0; i < Object.keys(params.filter).length; i++) {
        var o = {};
        var key = Object.keys(params.filter)[i];
        var value = new RegExp(params.filter[Object.keys(params.filter)[i]], "i");
        o[key] = value;
        atts.push(o);
      }
    }
    return new Promise((resolve, reject) => {
       db.count(collection, { query: filter }).then(function(data){
         resolve(data);
       }).catch(function (error) {
         reject(error);
       });
    });
  },

  countByQuery: function(collection, query){
    logger.info("[%s][dao] countByQuery", collection);

    return new Promise((resolve, reject) => {
       db.count(collection, query).then(function(data){
         resolve(data);
       }).catch(function (error) {
         reject(error);
       });
    });
  },

  find: function(collection, params){
    logger.info("[%s][dao] find", collection);

    params = params || {};
    params.pager = params.pager || {};
    params.pager.pageSize = parseInt(params.pager.pageSize) || 0;
    params.pager.pageIndex = parseInt(params.pager.pageIndex) || 0;
    params.sort = params.sort || {};
    params.fields = params.fields || {};

    var atts = [];
    var filter = {};
    var sort = {};
    var key;
    var value;
    if(params.filter){
      filter = {$or :atts};

      var keys = Object.keys(params.filter);

      for (var i = 0; i < keys.length; i++) {

        key = keys[i];
        if(Array.isArray(params.filter[key])){
          var values = params.filter[key];
          for (var j = 0; j < values.length; j++) {
            var o = {};
            o[key] = new RegExp(values[j], "i");
            atts.push(o);
          }
        }else{
          var o = {};
          o[key] = new RegExp(params.filter[key], "i");
          atts.push(o);
        }
      }
    }

    if(params.sort){
      for (var i = 0; i < Object.keys(params.sort).length; i++) {
        params.sort[Object.keys(params.sort)[i]] = parseInt(params.sort[Object.keys(params.sort)[i]] || 1);
      }
      sort = params.sort;
    }

    return new Promise((resolve, reject) => {
       db.find(collection, { query: filter, fields:{}, sort: sort, pager: params.pager }).then(function(data){
         resolve(data);
       }).catch(function (error) {
         reject(error);
       });
    });
  },

  findById: function(collection, id){
    logger.info("[%s][dao] findById", collection);

    return new Promise((resolve, reject) => {
       db.findById(collection, {id: id}).then(function(data){
         resolve(data);
       }).catch(function (error) {
         reject(error);
       });
    });
  },

  findByUsername: function(collection, username){
    logger.info("[%s][dao] findByUsername", collection);

    return new Promise((resolve, reject) => {
       db.find(collection, { query: { username: username }, fields: {}, sort: {}} ).then(function(data){
         resolve(data);
       }).catch(function (error) {
         reject(error);
       });
    });
  },

  findByQuery: function(collection, query){
    logger.info("[%s][dao] findByQuery", collection);

    return new Promise((resolve, reject) => {
       db.find(collection, query ).then(function(data){
         resolve(data);
       }).catch(function (error) {
         reject(error);
       });
    });
  },

  insertOne: function(collection, obj, decoded){
    logger.info("[%s][dao] insertOne", collection);

    db.insertOne("logs",
      Security.generateSecurityLog(decoded, collection, "inserted", obj)
    );
    return new Promise((resolve, reject) => {
       db.insertOne(collection, obj).then(function(data){
         obj['_id'] = data.insertedId;
        resolve(obj);
       }).catch(function (error) {
         reject(error);
       });
    });
  },

  insertMany: function(collection, list, decoded){
    logger.info("[%s][dao] insertMany", collection);

    db.insertOne("logs",
      Security.generateSecurityLog(decoded, collection, "inserted", list)
    );
    return new Promise((resolve, reject) => {
       db.insertMany(collection, list).then(function(data){
        resolve(data);
       }).catch(function (error) {
         reject(error);
       });
    });
  },

  updateOne: function(collection, obj, decoded){
    logger.info("[%s][dao] updateOne", collection);

    db.insertOne("logs",
      Security.generateSecurityLog(decoded, collection, "updated", obj)
    );
    return new Promise((resolve, reject) => {
       db.updateOne(collection, obj).then(function(data){
         resolve(data);
       }).catch(function (error) {
         reject(error);
       });
    });
  },

  deleteOne: function(collection, id, decoded){
    logger.info("[%s][dao] deleteOne", collection);

    db.insertOne("logs",
      Security.generateSecurityLog(decoded, collection, "deleted", id)
    );
    return new Promise((resolve, reject) => {
       db.deleteOne(collection, id).then(function(data){
         resolve(data);
       }).catch(function (error) {
         reject(error);
       });
    });
  },

  download: function(collection, id, decoded){
    logger.info("[%s][dao] download", collection);

    db.insertOne("logs",
      Security.generateSecurityLog(decoded, collection, "downloaded", id)
    );
    return new Promise((resolve, reject) => {
       db.downloadFile(collection, {id: id}).then(function(data){
         resolve(data);
       }).catch(function (error) {
         reject(error);
       });
    });
  },

  insertOneFile: function(collection, obj){
    logger.info("[%s][dao] insertOneFile", collection);

    return new Promise((resolve, reject) => {
       db.insertOneFile(collection, obj).then(function(data){
        resolve(data);
       }).catch(function (error) {
         reject(error);
       });
    });
  },

  group: function(collection, keys, condition, initial, reduce, finalize, command){
    logger.info("[%s][dao] group", collection);
    return new Promise((resolve, reject) => {
       db.group(collection, keys, condition, initial, reduce, finalize, command).then(function(data){
        resolve(data);
       }).catch(function (error) {
         reject(error);
       });
    });
  },

  aggregate: function(collection, pipeline){
    logger.info("[%s][dao] aggregate", collection);

    return new Promise((resolve, reject) => {
       db.aggregate(collection, pipeline).then(function(data){
        resolve(data);
       }).catch(function (error) {
         reject(error);
       });
    });
  },

}
