var Card       = require('../models/card');
var Item       = require( '../models/item');


exports.updateLayout = function( req, res ) {
 var positions = req.body.positions;
 console.log( req.body.username );
 console.log( positions );
 res.writeHead(200 );
 
}

exports.index = function(req, res){

 
  var message = null;
  if( req.session.user ) {
    message = req.session.user.username;
  }
  console.log( message );
  Card.find({})
   .populate( 'items')
   .exec(function (err, cards) {
        if (!err){ 
          //console.log(cards);
          
          for( var cii=0; cii<cards.length; cii++ ) {
            var oneCard = cards[cii];
            var totalItems = oneCard.items.length;
            //console.log( totalItems );
            var completed = 0;
            if( totalItems > 0 ) {
              for( var iii=0; iii<oneCard.items.length; iii++ ) {
                var oneItem = oneCard.items[iii];
                if( oneItem.complete ) {
                  completed++;
                }
              }
            }
            oneCard.num = completed;
            oneCard.den = totalItems;
          }

          res.render( 'index', {
            cards: cards
           , un: message
          });

        }
        else { throw err;}

      });
}
