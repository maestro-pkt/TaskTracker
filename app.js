
var personRoute       = require('./routes/person');
var componentRoute    = require('./routes/component');
var cardRoute     = require('./routes/card' );
var indexRoute = require('./routes/index');

var config = require('./config/config.js');

var sequence = require('sequence').create();
var express  = require('express');
var mongoose = require('mongoose');
var hash = require('./config/pass').hash;
var http = require('http');
var path = require('path');


var app = express();



// all environments
app.set('port', process.env.PORT || 3000);

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.json());
  
  app.use(express.bodyParser());
  app.use(express.cookieParser('MaryHadALittleLamb'));
  app.use(express.session());
   
  app.use(express.urlencoded());
  //app.use(express.methodOverride());
  //app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));


});
// hmm
app.use(function (req, res, next) {
	//console.log( 'in use' );
  var err = req.session.error,
      msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  //console.log( err );
  console.log( msg );
  if (err) res.locals.message = '<div class="alert alert-danger">' + err + '</div>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});



// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler())
}

mongoose.connect( config.mongoUrl );
mongoose.set('debug', true);


var Person  = require('./models/person');
var Component  = require('./models/component');
var Item       = require('./models/item');
var Card       = require('./models/card');
var User  = require('./models/user');



app.get('/', requiredAuthentication, indexRoute.index);
app.post('/updateLayout', indexRoute.updateLayout);

app.get('/card/new', requiredAuthentication, cardRoute.newCard );
app.get('/card/edit/:card_id', requiredAuthentication, cardRoute.editCard);
app.post('/card/save', cardRoute.save );
app.post('/people/create', requiredAuthentication, personRoute.create);
app.post('/component/create', requiredAuthentication, componentRoute.create);
//app.get('/component/flowchart', requiredAuthentication, componentRoute.flowchart );
app.get('/person', requiredAuthentication, personRoute.view );
app.get('/person/view/:_id', requiredAuthentication, personRoute.viewPerson);

app.get("/signup", function (req, res) {
  if (req.session.user) {
      res.redirect("/");
  } else {
      res.render("signup");
  }
});

app.post("/signup", userExist, function (req, res) {
  var password = req.body.password;
  var username = req.body.username;

  hash(password, function (err, salt, hash) {
      if (err) throw err;
      var user = new User({
          username: username,
          salt: salt,
          hash: hash,
      }).save(function (err, newUser) {
          if (err) throw err;
          authenticate(newUser.username, password, function(err, user){
              if(user){
                  req.session.regenerate(function(){
                      req.session.user = user;
                      req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                      res.redirect('/');
                  });
              }
          });
      });
  });
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", function (req, res) {
  authenticate(req.body.username, req.body.password, function (err, user) {
      if (user) {

          req.session.regenerate(function () {

              req.session.user = user;
              req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
              res.redirect('/');
          });
      } else {
          req.session.error = 'Authentication failed, please check your ' + ' username and password.';
          res.redirect('/login');
      }
  });
});

app.get('/logout', function (req, res) {
  req.session.destroy(function () {
      res.redirect('/');
  });
});

app.get('/profile', requiredAuthentication, function (req, res) {
  res.send('Profile page of '+ req.session.user.username +'<br>'+' click to <a href="/logout">logout</a>');
});


//app.post('/users/:user_id/tasks/create', task.create)
//app.get('/users/:user_id/tasks/:task_id/destroy', task.destroy)

http.createServer( app ).listen( app.get( 'port' ), function (){
  console.log( 'Express server listening on port ' + app.get( 'port' ));
});


/*
Helper Functions
*/
function authenticate(name, pass, fn) {
  if (!module.parent) console.log('authenticating %s:%s', name, pass);

  User.findOne({
      username: name
  },

  function (err, user) {
      if (user) {
          if (err) return fn(new Error('cannot find user'));
          hash(pass, user.salt, function (err, hash) {
              if (err) return fn(err);
              if (hash == user.hash) return fn(null, user);
              fn(new Error('invalid password'));
          });
      } else {
          return fn(new Error('cannot find user'));
      }
  });

}

function requiredAuthentication(req, res, next) {
  if (req.session.user) {
      next();
  } else {
      req.session.error = 'Access denied!';
      res.redirect('/login');
  }
}

function userExist(req, res, next) {
  User.count({
      username: req.body.username
  }, function (err, count) {
      if (count === 0) {
          next();
      } else {
    	  //console.log( 'user exists');
          req.session.error = "User Exist"
          res.redirect("/signup");
      }
  });
}
