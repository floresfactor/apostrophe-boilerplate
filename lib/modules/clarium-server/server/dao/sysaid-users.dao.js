const express 	  = require('express');
const request     = require('request');
const config      = require('../config/config');

var DAO = {

  login: function(username, password){
    return new Promise((resolve, reject) => {
      request({
        url:  config.sysaid.url + '/v1/login',
        method: 'POST',
        body: {"user_name":username, "password": password},
        json: true,
        timeout: 2000
      }, function (error, response, body) {
          if(error){
            reject({message: 'Service Unavailable', error: error});
          }else if(response.statusCode == 401){
            reject({message: 'Access Denied', error: error, body: body});
          }else{
            var user = body.user;
            var roles = [];
            if (user.isAdmin) roles.push('admin');
            if (user.isSysAidAdmin) roles.push('sysadmin');
            if (user.isManager) roles.push('manager');
            if (user.isGuest) roles.push('guest');
            resolve({user: body.user, roles:roles, cookie:response.headers["set-cookie"][0]});
          }
        }
      );
    });
  },
}

module.exports = exports = DAO;
