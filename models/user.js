var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

//define the schema for our user model
var userSchema = mongoose.Schema({

  local            : {
    userid       : String,
    email        : String,
    password     : String,
  },
  remote           : {
    online       : Boolean
  },
  prefs            : {
    // How long to keep a message unread before discarding (in minutes)
    timeToBuffer : { type: Number, min: 1, max: 1440 },
    tools          : [{
      name       : String,
      enabled    : Boolean
    }]
      
  }
});

//methods ======================
//generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

//create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
