const express  = require('express');
const DAO      = require('../dao/mongo.dao');
const COLLECTION = "conversations";
const logger      = require('../config/logger');


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
    var conversation = req.body;
    var query = {
      query: {
        $and: [
          {
            "members.userId": conversation.members[0].userId
          },
          {
            "members.userId": conversation.members[1].userId
          },
        ]
      },
      fields: {},
      sort: {}
    };

    DAO.findByQuery(COLLECTION, query).then(function(data){
      logger.info(data)
      if(data[0]){
        res.json(data[0]);
      }else{
        DAO.insertOne(COLLECTION, req.body, req.decoded).then(function(data){
    			res.json(data);
        }).catch(function (error) {
          res.status(500).json(error);
        });
      }
    }).catch(function (error) {
      res.status(500).json(error);
    });
  },

  updateOne: function(req, res){
    logger.info("[controller] updateOne: body: ", req.body);
    DAO.updateOne(COLLECTION, req.body, req.decoded).then(function(data){
      logger.info("[controller] updateOne then");
    }).catch(function (error) {
      logger.info("[controller] updateOne catch");
      res.status(500).json(error);
    });
  },

  deleteOne: function(req, res){
    logger.info("[controller] deleteOne: id: ", req.params.id);
    DAO.deleteOne(COLLECTION, req.params.id, req.decoded).then(function(data){
			res.json(data);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  }

}
