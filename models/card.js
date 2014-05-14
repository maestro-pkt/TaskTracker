var mongoose = require('mongoose');
var Item = require('./item');

//define the schema for our message model
var s = mongoose.Schema({

  title               : String,
  desc                : String,
  _owner              : { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
  items               : [ { type: mongoose.Schema.Types.ObjectId, ref: 'Item' } ],

  followup: {
    requested    : Boolean,
    frequency    : String,
    next         : Date
  }
 
});

module.exports = mongoose.model('Card', s);