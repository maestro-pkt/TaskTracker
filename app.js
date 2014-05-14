
var personRoute    = require('./routes/person');
var componentRoute    = require('./routes/component');
//var task    = require('./routes/task');
var cardRoute     = require('./routes/card' );
var sequence = require('sequence').create();
var express  = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var config = require('./config/config.js');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000)
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.favicon())
app.use(express.logger('dev'))
app.use(express.json())
app.use(express.urlencoded())
app.use(express.methodOverride())
app.use(app.router)
app.use(express.static(path.join(__dirname, 'public')))

//pass passport for configuration
require('./config/passport')(passport); 


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


app.get('/', routes.index)
app.get('/card/new', cardRoute.newCard );
app.get('/card/edit/:card_id', cardRoute.editCard);
app.post('/card/save', cardRoute.save );
app.post('/people/create', personRoute.create)
app.post('/component/create', componentRoute.create)
//app.post('/users/:user_id/tasks/create', task.create)
//app.get('/users/:user_id/tasks/:task_id/destroy', task.destroy)

http.createServer( app ).listen( app.get( 'port' ), function (){
  console.log( 'Express server listening on port ' + app.get( 'port' ));
});

