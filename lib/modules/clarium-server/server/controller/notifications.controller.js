const express  = require('express');
const DAO      = require('../dao/mongo.dao');
const appRoot   = require('app-root-path');
const config    = require('../config/config');
const logger      = require('../config/logger');

const CONVERSATIONS = "conversations";
const MESSAGES = "messages";

module.exports = exports = {

  find: function(req, res){
    logger.info("[controller] find", req.query);
    res.json({messages:3, request:2, total:5});
  },

  findByUserId: function(req, res){
    var query = {
      query: {"members.userId": req.params.id},
    };
    DAO.findByQuery(CONVERSATIONS, query).then(function(data){
      var conversationIds = [];
      for (var i = 0; i < data.length; i++) {
        conversationIds.push(String(data[i]._id));
      }
      query = {
        query: { $and: [
            {"conversationId": { $in: conversationIds}},
            {"isReaded": false},
            { "user.userId": {$not: { $eq: req.params.id}}}
           ]
        }
      }

      DAO.countByQuery(MESSAGES, query).then(function(data){
        res.json({"messages": data});
      }).catch(function (error) {
        res.status(500).json(error);
      });

    }).catch(function (error) {
      res.status(500).json(error);
    });

  },


  findByConversationId: function(req, res){
    var userId = req.query.userID;
    var params = {};
    if(userId){
      params = {
        query: { $and: [
            {"conversationId": req.params.id},
            {"isReaded": false},
            { "user.userId": {$not: { $eq: req.params.id}}}
          ]
        }
      }
    }else{
      params = {
        query: { $and: [
            {"conversationId": req.params.id},
            {"isReaded": false}
          ]
        }
      };
    }
    logger.info("Query: ", params);
    DAO.countByQuery(MESSAGES, params).then(function(data){
      res.json({"messages": data});
    }).catch(function (error) {
      res.status(500).json(error);
    });

  },

}
