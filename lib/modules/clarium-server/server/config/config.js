const env = process.env.NODE_ENV;

const dev = {
  'security':{
    'secret': 'TG38[m/t+]y?MR5:',
    'tokenExpiresIn' : '1h',
    'iterations': 100000,
    'enabled': false
  },
  'database': {
    'dbName': 'test',
    'url': 'mongodb://localhost:27017/test'
  },
  'sysaid': {
    'url': 'http://74.204.122.7:8080/api'
  },
  'mailer':{
    'host': 'na.relay.ibm.com',
    'port': 25,
    'secure':false,
    'service':'gmail',
    'auth':{
      'user':'clariummailer@gmail.com',
      'pass': '9fPS"zY#jq-bdC2E'
    }
  },
  'support':{
    'emailTo':'clariummailer@gmail.com',
    'emailCc':'alarcon.osollo@gmail.com, jonalex@ndm.lv, jflores@rnviz.com',
  },
  'cloudinary':{
    'cloudName': 'dckmskonk',
    'apiKey': '945694451519344',
    'apiSecret': 'z1uEjabcHt5EEMh9b_CfBP-QvBw'
  },
  'filemanager':{
    'baseDirectory': '/resources',
    'appRootEnabled': false
  },
  'ipApi':{
    'url':'http://ip-api.com/json/'
  }
};

const qa = {
  'security':{
    'secret': 'TG38[m/t+]y?MR5:',
    'tokenExpiresIn' : '1h',
    'iterations': 100000,
    'enabled': true
  },
  'database': {
    'dbName': 'clarium-portal',
    'url': 'mongodb://localhost:27017/clarium-portal'
  },
  'sysaid': {
    'url': 'http://74.204.122.7:8080/api'
  },
  'mailer':{
    'host': 'na.relay.ibm.com',
    'port': 25,
    'secure':false,
    'service':'gmail',
    'auth':{
      'user':'clariummailer@gmail.com',
      'pass': '9fPS"zY#jq-bdC2E'
    }
  },
  'support':{
    'emailTo':'clariummailer@gmail.com',
    'emailCc':'alarcon.osollo@gmail.com, jonalex@ndm.lv, jflores@rnviz.com',
  },
  'cloudinary':{
    'cloudName': 'dckmskonk',
    'apiKey': '945694451519344',
    'apiSecret': 'z1uEjabcHt5EEMh9b_CfBP-QvBw'
  },
  'filemanager':{
    'baseDirectory': '/resources',
    'appRootEnabled': false
  },
  'ipApi':{
    'url':'http://ip-api.com/json/'
  }
};

const prod = {
  'security':{
    'secret': 'TG38[m/t+]y?MR5:',
    'tokenExpiresIn' : '1h',
    'iterations': 100000,
    'enabled': true
  },
  'database': {
    'dbName': 'clarium-portal',
    //'url': 'mongodb://localhost:27017/clarium-portal'
    'url': 'mongodb://clarium:wjPQhwQ5XZB@ds221271.mlab.com:21271/clarium-portal'
    //'url': 'mongodb://clarium:wjPQhwQ5XZB@ds139331.mlab.com:39331/clarium-portal'

  },
  'sysaid': {
    'url': 'http://74.204.122.7:8080/api'
  },
  'mailer':{
    'host': 'na.relay.ibm.com',
    'port': 25,
    'secure':false,
    'service':'gmail',
    'auth':{
      'user':'clariummailer@gmail.com',
      'pass': '9fPS"zY#jq-bdC2E'
    }
  },
  'support':{
    'emailTo':'clariummailer@gmail.com',
    'emailCc':'alarcon.osollo@gmail.com, jonalex@ndm.lv, jflores@rnviz.com',
  },
  'cloudinary':{
    'cloudName': 'dckmskonk',
    'apiKey': '945694451519344',
    'apiSecret': 'z1uEjabcHt5EEMh9b_CfBP-QvBw'
  },
  'filemanager':{
    'baseDirectory': '/resources',
    'appRootEnabled': false
  },
  'ipApi':{
    'url':'http://ip-api.com/json/'
  }
};

const config = {
 dev,
 qa,
 prod
};

module.exports = config[env];
