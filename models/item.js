var mongoose = require('mongoose');
var Person = require('./person');
var Component = require('./component');

//define the schema for our message model
var s = mongoose.Schema({

  itemType           :  {type: String, enum: ['TODO', 'Question']},
  complete           : { type: Boolean, default: false},
  text               : String,
  ppl                : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Person' }],
  components         : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Component' }]
  

});

module.exports = mongoose.model('Item', s);
