const nodemailer = require('nodemailer');
const config     = require('../config/config');
const logger      = require('../config/logger');

module.exports = {

  send: function(mailOptions){
    let transporter = nodemailer.createTransport({
      //host: config.mailer.host,
      //port: config.mailer.port,
      //secure: config.mailer.secure
      service: config.mailer.service,
      auth: {
        user: config.mailer.auth.user,
        pass: config.mailer.auth.pass
      }
    });

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {


        if (error) {
          reject(error);
        }else{
          resolve(info);
        }
      });
    });

  },
}
