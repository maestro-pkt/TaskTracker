var Person = require('../models/person');
var Component = require('../models/component');
var Card = require('../models/card');
var Item = require('../models/item');
var sequence = require('sequence').create();

exports.editCard = function(req, res) {
  console.log(req.param('card_id'));
  Person.find({}, function(err, ppl) {
    if (!err) {
      Component.find({}, function(err, cmps) {
        if (!err) {
          Card.find({
            _id : req.param('card_id')
          }).populate('_owner').populate('items').exec(function(err, card) {
            if (!err) {
              //console.log('Card');
              var oneCard = card[0];
              //console.log(oneCard);

              // console.log( 'Items');
              // console.log( oneCard.items );
              Item.populate(oneCard.items, {
                path : 'ppl',
                model : 'Person'
              }, function(err, pCard) {
                //console.log('pcard:');
                //console.log(pCard);
                Item.populate(oneCard.items, {
                  path : 'components',
                  model : 'Component'
                }, function(err, cCard) {
                  //console.log('ccard:');
                  //console.log(cCard);
                  
                  //console.log('one card');
                  //console.log(oneCard);
                  
                  //console.log('ppl and cmps still not populated');
                  // console.log( oneCard.items[0].ppl );

                  // jade is expecting an array
                  if (!Array.isArray(cmps)) {
                    cmps = [ cmps ];
                  }
                  if (!Array.isArray(ppl)) {
                    ppl = [ ppl ];
                  }
//console.log( oneCard );
                  res.render('card', {
                    storedCard : oneCard,
                    allPpl : ppl,
                    allCmps : cmps

                  });

                });
              });
            } else {
              throw err;
            }
          });

        } else {
          throw err;
        }
      });
    } else {
      throw err;
    }

  });

}

exports.newCard = function(req, res) {

  Person.find({}, function(err, ppl) {
    if (!err) {
      //console.log(ppl);
      Component.find({}, function(err, cmps) {
        //console.log(cmps);
        // jade is expecting an array
        if (!Array.isArray(cmps)) {
          cmps = [ cmps ];
        }
        if (!Array.isArray(ppl)) {
          ppl = [ ppl ];
        }
        res.render('card', {
          allPpl : ppl,
          allCmps : cmps
        });
        // process.exit();
      });

    } else {
      throw err;
    }

  });
}

exports.save = function(req, res) {
  // console.log( req );
   console.log(req.body.card);
  var cardObj = JSON.parse(req.body.card);

  var itemIds = [];

  sequence.then(function(next) {
    for (var ii = 0; ii < cardObj.items.length; ii++) {
      var item = cardObj.items[ii];
      console.log('an item');
      console.log(item);

      if (typeof item._id !== "undefined" && item._id != 0) {
        console.log('update existing');
        itemIds.push(item._id);
        Item.update({
          _id : item._id
        }, {
          $set : {
            complete : item.complete,
            text : item.text,
            components : item.cmp,
            ppl : item.ppl
          }
        }, {
          upsert : true
        }, function(err, good) {
          console.log('update item finished');
        });
      } else {
        console.log('new item');

        var itemMongo = new Item({
          text : item.text,
          itemType : 'TODO',
          complete : item.complete
        });

        console.log( item.cmp.length);
        for (var cmpItr = 0; cmpItr < item.cmp.length; cmpItr++) {
          console.log( 'push 1');
          itemMongo.components.push(item.cmp[cmpItr]);
        }

        for (var pplItr = 0; pplItr < item.ppl.length; pplItr++) {
          itemMongo.ppl.push(item.ppl[pplItr]);
        }

        itemMongo.save();
        console.log(itemMongo);
        itemIds.push(itemMongo._id);
      }
    }
    console.log('item ids');
    console.log(itemIds);
    next();

  }).then(function(next) {
    console.log("CardObj:");
    console.log(cardObj);
    console.log( 'endcardobj');
    if (typeof cardObj._id === "undefined") {
      console.log('new card');

      var o = '';
      if( cardObj.owner.length ) {
        o = cardObj.owner[0];
      }
      
      var newCard = new Card({
        title : cardObj.title,
        desc : cardObj.desc,
        _owner : o,
        followup : {
          requested : true,
          frequency : 'weekly',
          next : new Date()
        }
      });
      newCard.items = itemIds;
      newCard.save();

    } else {
      console.log('updating existing card');
      console.log(cardObj._id);
      
      Card.findOne({ _id: cardObj._id }, function (err, c){
        console.log('working card');
        //console.log(c);
        
        c.title = cardObj.title;
        c.description = cardObj.desc;
        if( cardObj.owner.length ) {
        c._owner = cardObj.owner[0];
        } else {
          c._owner = undefined;
        }
        c.items = [];
        c.items = itemIds;
        c.save();

      });
      
      
    }

    next();
  });

  // process.exit();

  res.redirect('/');

}
