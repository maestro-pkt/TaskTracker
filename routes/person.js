
var Person  = require('../models/person');


exports.create = function(req, res) {
  var p = new Person({
    name: req.param('name'),
    email: req.param('email')
  });
  p.save( function(err){
    if( err ) {
      
    } else {
      console.log( req );
      res.redirect(req.headers.referer);

    }
  });
 }
