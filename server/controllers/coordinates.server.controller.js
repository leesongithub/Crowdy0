/*
  This controller uses the mapbox geocaching API to take a listing's address and fetch the coordinates. 
  */

var config = require('../config/config'), 
    request = require('request');

module.exports = function(req, res, next) {
  if(req.body.address) {
    var options = {
      key: config.mapBox.key, 
      address: req.body.address
    }
    request({
      url: "https://api.mapbox.com/geocoding/v5/mapbox.places/" + options.address + ".json?access_token=" + options.key, 
      qs: options
      }, function(error, response, body) {
        if(error) {
          response.status(400).send(err);
        } 

        var data = JSON.parse(response.body);
        req.results = data.features[0].geometry.coordinates;

        next();
    });
  } else {
    next();
  }
};  