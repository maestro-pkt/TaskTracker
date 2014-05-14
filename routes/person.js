var Person = require('../models/person');
var Card = require('../models/card');
var Item = require('../models/item');
var _ = require('underscore');

exports.create = function(req, res) {
  var p = new Person({
    name : req.param('name'),
    email : req.param('email')
  });
  p.save(function(err) {
    if (err) {

    } else {
      console.log(req);
      res.redirect(req.headers.referer);

    }
  });
}

exports.view = function(req, res) {
  Person.find({}, function(err, ppl) {
    if (!err) {
      res.render('people', {
        ppl : ppl
      });

    }
  });
}

exports.viewPerson = function(req, res) {
  
  Person.find({}, function(err, ppl) {
    if (!err) {
      var person = {};
      _.find( ppl, function( value ){
        if( value._id == req.param('_id')) {
          person = value;
        }
      });
      
      Item.find({ ppl: req.param('_id')}, function( err, items ) {
        console.log( items );
        var queryStr = {};
        var a = [];
        for( var ii = 0; ii<items.length; items++ ) {
          a.push( items[ii]._id );
        }
         
        var owners = [];
        var items = [];
          
        Card.find( { $or: [ { _owner: req.param('_id') }, { items: a } ] } ).populate('_owner').populate('items').exec(function(err, cards ){
          console.log( 'all cards');
          console.log( cards );
          console.log( 'person id');
          console.log( req.param('_id') );
          for( var cc = 0; cc<cards.length; cc++ ) {
            var card = cards[cc];
            
            if( card._owner._id == req.param('_id') ) {
              owners.push( { title: card.title, _id: card._id } );
            } 
            
            _.each( card.items, function( element, index, allItems ){
              //console.log( 'foreach');
              //console.log( element );
              //console.log( index );
              
              _.find( element.ppl, function( value ){
                if( value == req.param('_id')) {
                  console.log( 'found a match');
                  items.push( { title: card.title, _id:card._id, itemText: element.text });
                }
              });
              
            }); 
            
           
          }
          console.log( 'owners');
          console.log( owners );
          console.log( 'items');
          console.log( items )

          res.render('people', {
            person: person,
            owner: owners,
            items: items,
            ppl : ppl
          });
        });
        
        /*
         * Owner:
         *   Card Name & _id
         *   Card Name & _id
         *   
         * Items: 
         *   Card Name(_id), Item text
         *   
         */
        
        // get a list of all items worked by the person
        /*
        Card.find({ _owner: req.param('_id') })
        .populate( 'items')
        .exec(function (err, cards) {
             if (!err){ 
               console.log(cards);
                            }
             else { throw err;}

           });
        */
        
        
        
        
      });

    }
  });
}