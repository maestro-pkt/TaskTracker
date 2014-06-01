
var Component  = require('../models/component');


exports.create = function(req, res) {
  var p = new Component({
    name: req.param('name')
  });
  p.save( function(err){
    if( err ) {
      console.log(err);
    } else {
      //console.log( req );
      res.redirect(req.headers.referer);

    }
  });
 }

exports.flowchart = function(req, res ) {
	res.render('flowchart', {
		
    });
}