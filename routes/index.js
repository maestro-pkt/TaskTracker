var Card       = require('../models/card');
var Item       = require( '../models/item');


exports.index = function(req, res){

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
          });

        }
        else { throw err;}

      });
}
