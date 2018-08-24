const express     = require('express');
const DAO         = require('../dao/mongo.dao');
const appRoot     = require('app-root-path');
const config      = require('../config/config');
const logger      = require('../config/logger');

const COLLECTION  = "logs";
const CONTROLLER  = "reports";

module.exports = exports = {


  reportGroupByOperation: function(req, res){
    logger.info("[%s][controller] reportGroupByOperation", CONTROLLER);

    DAO.group(COLLECTION, {
      'operation': 1, 'collection': 1
    }, {  }, {count: 0 }, function ( curr, result ) {
      result.count++
    }).then(function(data){
			 res.json(data);
    }).catch(function (error) {
      logger.info(error);
       res.status(500).json(error);
    });
  },

  reportGroupByRegistrations: function(req, res){
    logger.info("[%s][controller] reportGroupByRegistrations", CONTROLLER);

    var days = 7;
    var today = new Date();
    var lasWeek = new Date();
    lasWeek.setTime(today.getTime() - (days * 24 * 60 * 60 * 1000));

    var filter = req.query.filter || {};
    var startDate = filter.startDate || lasWeek;
    var endDate = filter.endDate || today;
    DAO.aggregate(COLLECTION, [
        { $match: {
            collection: 'campaigns-clients',
            $and:[
              {timestamp: {$gte : new Date(startDate) }},
              {timestamp: {$lte : new Date(endDate) }},
            ]
        }},
        {$group : {
            _id: null,
            count:{$sum:1}
        }},
        {$sort:{"_id.collection":1}}
    ]).then(function(data){
      res.json(data);
    }).catch(function (error) {
      logger.info(error);
      res.status(500).json(error);
    });
  },

  reportGroupByCampaign: function(req, res){
    logger.info("[%s][controller] reportGroupByCampaign", CONTROLLER);

    var days = 7;
    var today = new Date();
    var lasWeek = new Date();
    lasWeek.setTime(today.getTime() - (days * 24 * 60 * 60 * 1000));

    var filter = req.query.filter || {};
    var startDate = filter.startDate || lasWeek;
    var endDate = filter.endDate || today;
    var promises = [];
    DAO.aggregate(COLLECTION, [
        { $match: {
            collection: 'campaigns-clients',
            $and:[
              {timestamp: {$gte : new Date(startDate) }},
              {timestamp: {$lte : new Date(endDate) }},
            ]
        }},
        {$group : {
            _id: '$data.campaignId',
            count:{$sum:1}
        }},
        {$sort:{"_id":1}}
    ]).then(function(data){

      for (let i = 0; i < data.length; i++) {

        var cid = data[i]['_id'];
        promises.push(new Promise((resolve,reject) => {
          DAO.findById("campaigns", cid).then(function(campaign){
            if(campaign){
              data[i].campaign = campaign;
            }else{
              data[i].campaign = {name: "Undefined"}
            }
            resolve(data[i]);
          }).catch(function (error) {
            logger.info(error);
            resolve(error);
          });
        }));
      }
      return Promise.all(promises).then((campaigns)=>{
        res.json(campaigns);
      });
    }).catch(function (error) {
      logger.info(error);
      res.status(500).json(error);
    });
  },

  reportGroupByCampaignId: function(req, res){
    logger.info("[%s][controller] reportGroupByCampaignId", CONTROLLER);

    DAO.aggregate(COLLECTION, [
        { $match: {
            collection: 'campaigns-clients',
            'data.campaignId': req.params.id
        }},
        {$group : {
            _id: '$data.campaignId',
            count:{$sum:1}
        }},
        {$sort:{"_id":1}}
    ]).then(function(data){
			 res.json(data);
    }).catch(function (error) {
       logger.info(error);
       res.status(500).json(error);
    });
  },

  reportGroupByCountryCode: function(req, res){
    logger.info("[%s][controller] reportGroupByCountryCode", CONTROLLER);

    var days = 7;
    var today = new Date();
    var lasWeek = new Date();
    lasWeek.setTime(today.getTime() - (days * 24 * 60 * 60 * 1000));

    var filter = req.query.filter || {};
    var startDate = filter.startDate || lasWeek;
    var endDate = filter.endDate || today;
    DAO.aggregate(COLLECTION, [
      { $match: {
            collection: 'campaigns-clients',
            $and:[
              {timestamp: {$gte : new Date(startDate) }},
              {timestamp: {$lte : new Date(endDate) }},
            ]
        }},
        {$group : {
            _id: '$data.location.countryCode',
            count:{$sum:1}
        }},
        {$sort:{"_id":1}}
    ]).then(function(data){
			 res.json(data);
    }).catch(function (error) {
       logger.info(error);
       res.status(500).json(error);
    });
  },


  reportGroupByCountryDate: function(req, res){
    logger.info("[%s][controller] reportGroupByCountryDate", CONTROLLER);

    var days = 7;
    var today = new Date();
    var lasWeek = new Date();
    lasWeek.setTime(today.getTime() - (days * 24 * 60 * 60 * 1000));

    var filter = req.query.filter || {};
    var startDate = filter.startDate || lasWeek;
    var endDate = filter.endDate || today;
    DAO.aggregate(COLLECTION, [
      { $match: {
            collection: 'campaigns-clients',
            $and:[
              {timestamp: {$gte : new Date(startDate) }},
              {timestamp: {$lte : new Date(endDate) }},
            ]
        }},
        {$group : {
            _id: {$dateToString: { format: "%Y-%m-%d", date: "$timestamp" }},
            count:{ $sum:1 }
        }},
        {$sort:{"_id":1}}
    ]).then(function(data){
			 res.json(data);
    }).catch(function (error) {
       logger.info(error);
       res.status(500).json(error);
    });
  },


  reportGroupByCountryDateDay: function(req, res){
    logger.info("[%s][controller] reportGroupByCountryDateDay", CONTROLLER);

    var days = 7;
    var today = new Date();
    var lasWeek = new Date();
    lasWeek.setTime(today.getTime() - (days * 24 * 60 * 60 * 1000));

    var filter = req.query.filter || {};
    var startDate = filter.startDate || lasWeek;
    var endDate = filter.endDate || today;
    logger.info("[controller] reportGroupByCountryCode: ");
    DAO.aggregate(COLLECTION, [
      { $match: {
            collection: 'campaigns-clients',
            $and:[
              {timestamp: {$gte : new Date(startDate) }},
              {timestamp: {$lte : new Date(endDate) }},
            ]
        }},
        {$group : {
            _id: {$dateToString: { format: "%Y-%m-%d", date: "$timestamp" }},
            count:{ $sum:1 }
        }},
        {$sort:{"_id":1}}
    ]).then(function(data){
			 res.json(data);
    }).catch(function (error) {
       logger.info(error);
       res.status(500).json(error);
    });
  },

  reportGroupByCountryDateMonth: function(req, res){
    logger.info("[%s][controller] reportGroupByCountryDateMonth", CONTROLLER);

    var days = 7;
    var today = new Date();
    var lasWeek = new Date();
    lasWeek.setTime(today.getTime() - (days * 24 * 60 * 60 * 1000));

    var filter = req.query.filter || {};
    var startDate = filter.startDate || lasWeek;
    var endDate = filter.endDate || today;
    DAO.aggregate(COLLECTION, [
      { $match: {
            collection: 'campaigns-clients',
            $and:[
              {timestamp: {$gte : new Date(startDate) }},
              {timestamp: {$lte : new Date(endDate) }},
            ]
        }},
        {$group : {
            _id: {$dateToString: { format: "%Y-%m", date: "$timestamp" }},
            count:{ $sum:1 }
        }},
        {$sort:{"_id":1}}
    ]).then(function(data){
			 res.json(data);
    }).catch(function (error) {
       logger.info(error);
       res.status(500).json(error);
    });
  },

  reportGroupByCountryDateYear: function(req, res){
    logger.info("[%s][controller] reportGroupByCountryDateYear", CONTROLLER);

    var days = 7;
    var today = new Date();
    var lasWeek = new Date();
    lasWeek.setTime(today.getTime() - (days * 24 * 60 * 60 * 1000));

    var filter = req.query.filter || {};
    var startDate = filter.startDate || lasWeek;
    var endDate = filter.endDate || today;

    DAO.aggregate(COLLECTION, [
      { $match: {
            collection: 'campaigns-clients',
            $and:[
              {timestamp: {$gte : new Date(startDate) }},
              {timestamp: {$lte : new Date(endDate) }},
            ]
        }},
        {$group : {
            _id: {$dateToString: { format: "%Y", date: "$timestamp" }},
            count:{ $sum:1 }
        }},
        {$sort:{"_id":1}}
    ]).then(function(data){
			 res.json(data);
    }).catch(function (error) {
       logger.info(error);
       res.status(500).json(error);
    });
  },


  reportGroupByCampaignByDate: function(req, res){
    logger.info("[%s][controller] reportGroupByCampaignByDate", CONTROLLER);

    var days = 7;
    var today = new Date();
    var lasWeek = new Date();
    lasWeek.setTime(today.getTime() - (days * 24 * 60 * 60 * 1000));

    var filter = req.query.filter || {};
    var startDate = filter.startDate || lasWeek;
    var endDate = filter.endDate || today;
    DAO.aggregate(COLLECTION, [
      { $match: {
            collection: 'campaigns-clients',
            $and:[
              {timestamp: {$gte : new Date(startDate) }},
              {timestamp: {$lte : new Date(endDate) }},
            ]
        }},
        {$group : {
            _id: { cp: '$data.campaignId', date: {$dateToString: { format: "%Y-%m-%d", date: "$timestamp" }}},
            count:{$sum:1},
        }},
        {$sort:{"_id":1}}
    ]).then(function(data){
			 res.json(data);
    }).catch(function (error) {
       logger.info(error);
       res.status(500).json(error);
    });
  },

}
