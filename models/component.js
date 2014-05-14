var mongoose = require('mongoose');

//define the schema for our message model
var s = mongoose.Schema({

  name               : { type: String, index: { unique: true }}

});

module.exports = mongoose.model('Component', s);
