/* Import mongoose and define any variables needed to create the schema */
var mongoose = require('mongoose'), 
    Schema = mongoose.Schema;

/* Create your schema */
var listingSchema = new Schema({
  name: {
    type: String, 
    required: true
  }, 
  movies: {
    name: String, 
    description: String, 
    showtimes: [Date]
  }, 
  address: String,
  crowdedness: Number,
  votes: Number,
  rating: Number, 
  coordinates: [Number, Number],
   movies: [{
    title: String, 
    description: String, 
    showings: [{
      form: String,
      room: Number,
      time: Date,
      tickets_bought: Number
    }]
  }], 
  rooms: [{
    number: Number,
    capacity: Number
  }],
  created_at: Date,
  updated_at: Date
});

/* create a 'pre' function that adds the updated_at (and created_at if not already there) property */
listingSchema.pre('save', function(next) {
  var currentTime = new Date;
  this.updated_at = currentTime;
  if(!this.created_at)
  {
    this.created_at = currentTime;
  }
  next();
});

/* Use your schema to instantiate a Mongoose model */
var Listing = mongoose.model('Listing', listingSchema);

/* Export the model to make it avaiable to other parts of your Node application */
module.exports = Listing;
