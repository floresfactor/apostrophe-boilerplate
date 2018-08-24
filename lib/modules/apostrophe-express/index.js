module.exports = {
  session: {
    // If this still says `undefined`, set a real secret!
    secret: 'ff1e262976d80e52'
  },
  csrf: {
    exceptions: [
      '/api/v1/**'
    ]
  }

};

