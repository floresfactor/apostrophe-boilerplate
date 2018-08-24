// config.js
const env = process.env.NODE_ENV; // 'dev' or 'test'

const dev = {
 cms: {
   url:  'http://localhost:3000',
 }
};

const qa = {
    cms: {
      url: 'http://vr360.miami',
    }
   };

const config = {
 dev,
 qa
};
module.exports = config[env];