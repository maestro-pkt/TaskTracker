var mongoose = require('mongoose');

//define the schema for our user model
var userSchema = mongoose.Schema({
  username: String,
  password: String,
  salt: String,
  hash: String
 
});



//create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
