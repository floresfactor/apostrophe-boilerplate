const express  = require('express');
const config   = require('../config/config');
const request  = require('request');
const COLLECTION = "campaigns";
const logger      = require('../config/logger');


module.exports = exports = {

  find: function(req, res){
    logger.info("[controller] sys user find");

    var j = request.jar();
    var cookie = request.cookie(String(req.headers['set-cookie']));
    j.setCookie(cookie, config.sysaid.url + '/v1/users');
    request({
      url: config.sysaid.url + '/v1/users',
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
