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
  /*
Test.find({
      $and: [
          { $or: [{a: 1}, {b: 1}] },
          { $or: [{c: 1}, {d: 1}] }
      ]
  }, function (err, results) {
      ...
  }
   */
  
  Person.find({}, function(err, ppl) {
    if (!err) {
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
              console.log( 'foreach');
              console.log( element );
              console.log( index );
              
              // var even = _.find([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
              //=> 2
              
              _.find( element.ppl, function( value ){
                if( value == req.param('_id')) {
                  console.log( 'found a match');
                  items.push( { title: card.title, _id:card._id, itemText: element.text });
                }
              });
              
              /*console.log( 'checking array');
              console.log( element.ppl );
              console.log( 'for ');
              console.log( req.param('_id') ) ;
              if (element.ppl instanceof Array) {
                console.log( 'it is an array');
              }
              console.log("Contains 25?: " + _.contains([1,3,16,25,44], 25)); 
console.log( "evaluated: " + _.contains( element.ppl, req.param('_id') )) ;
console.log( "evaluated2: " + _.contains( [ "536ab03a7b405db02f904a12", "536ab03a7b405db02f904a13", "tetris" ], "536ab03a7b405db02f904a12")) ;

              if( _.contains( element.ppl, req.param('_id') ) ) {
                console.log( 'found a match');
                items.push( { title: card.title, _id:card._id, itemText: element.text });
              }
              */
            }); 
              // where item id's from array a[] is an id in this card.items array
              //card.items
              //
            /*
            Iterates over a list of elements, yielding each in turn to an iterator function. 
            The iterator is bound to the context object, if one is passed. Each invocation of 
            iterator is called with three arguments: (element, index, list). If list is a JavaScript 
            object, iterator's arguments will be (value, key, list). Delegates to the native forEach 
            function if it exists, and returns the original list for chaining.
            */
            
           
          }
          console.log( 'owners');
          console.log( owners );
          console.log( 'items');
          console.log( items )
          res.render('people', {
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