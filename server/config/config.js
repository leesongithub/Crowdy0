//This file holds any configuration variables we may need 
//'config.js' is ignored by git to protect sensitive information, such as your database's username and password
//copy this file's contents to another file 'config.js' and store your MongoLab uri there

module.exports = {
  db: {
    uri: 'mongodb://CEN3031:CEN3031TA@ds135233.mlab.com:35233/assignment5', //place the URI of your mongo database here.
  }, 
  mapBox: {
    key: 'pk.eyJ1IjoiYmhvbWVyIiwiYSI6ImNqbmRzYmNyZjA2em8za245dDFueDllbHoifQ.MtcTAOAiOWUoHyrfbcjeVQ'
  },
  port: 8080
};
