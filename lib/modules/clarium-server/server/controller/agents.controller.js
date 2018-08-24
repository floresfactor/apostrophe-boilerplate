const express    = require('express');
const DAO        = require('../dao/mongo.dao');
const COLLECTION = "users";
const ROLE       = "agent";
const logger     = require('../config/logger');


module.exports = exports = {

  findByQuery: function(req, res){
    logger.info("[agents.controller][clients controller] findByQuery");
    var params = req.query || {};
    params.pager = params.pager || {};
    params.pager.pageSize = parseInt(params.pager.pageSize) || 0;
    params.pager.pageIndex = parseInt(params.pager.pageIndex) || 0;
    var atts = [];
    var filter = {};
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

    var query = {
      query: { $and: [ {roles: ROLE},  filter    ]},
      fields: {name:1, lastName:1, companyName:1, profilePicture:1, categories:1, email:1, phoneNumber:1 },
      sort: { "name":1, "lastName": 1 }
    };

    DAO.findByQuery(COLLECTION, query).then(function(data){
			res.json(data);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  },




}
