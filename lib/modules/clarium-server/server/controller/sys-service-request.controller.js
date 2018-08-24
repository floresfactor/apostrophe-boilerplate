const express  = require('express');
const config   = require('../config/config');
const request  = require('request');
const jqs = require('json-query-string');
const logger      = require('../config/logger');

module.exports = exports = {

  find: function(req, res){
    logger.info("[controller] sys sr find ", req.query);

    var url = config.sysaid.url + '/v1/sr';

    if(req.query.request_user){
      url = url + "?request_user=" + req.query.request_user;
    }

    var j = request.jar();
    var cookie = request.cookie(String(req.headers['set-cookie']));
    // sr?request_user=3
    j.setCookie(cookie, url);

    request({
      url: url,
      method: 'GET',
      json: true,
      jar: j
    }, function (error, response, body) {
        if(error || response.statusCode == 401){
          res.status(401).send({message: 'Access Denied', error: error, body: body});
        }else{
          res.json(response.body);
        }
      }
    );
  },


}
