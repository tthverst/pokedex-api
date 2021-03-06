var express = require('express');
var path = require('path');
var cors = require('./config/cors');

var environment = process.env.NODE_ENV || 'development'
var Config = require('./config/config'); 
var config = new Config(environment); 

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var exphbs = require('express-handlebars');
var flash = require('connect-flash');
var methodOverride = require('method-override');

// Models
var model = {};
var mongoose = require('./config/database')();
model.User = require('./models/user')(mongoose);
model.Pokemon = require('./models/pokemon')(mongoose);
model.Location = require('./models/location')(mongoose);

require('./models/fillTestData')(model);
// Models

// Passport
var passport = require('./auth/passport')(model.User);
// Passport

//Handlebars helpers
var handlebarsHelpers  = require('./helpers/handlebars-helpers.js')(exphbs);
//Handlebars helpers

// Roles
var roles = require('./auth/connectroles')();
// Roles

function handleError(req, res, statusCode, message) {
    console.log();
    console.log('-------- Error handled --------');
    console.log('Request Params: ' + JSON.stringify(req.params));
    console.log('Request Body: ' + JSON.stringify(req.body));
    console.log('Response sent: Statuscode ' + statusCode + ', Message "' + message + '"');
    console.log('-------- /Error handled --------');
    res.status(statusCode);
    res.send(message);
};

// Routes
var routes = require('./routes/index')(passport, model, roles);
var pokemons = require('./routes/pokemon')(model, roles, handleError);
var locations = require('./routes/location')(model, roles, handleError);
var users = require('./routes/users')(model, roles, handleError);
// /Routes

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/'));
app.engine('handlebars', exphbs({ defaultLayout: 'main', helpers:  handlebarsHelpers.helpers}));
app.set('view engine', 'handlebars');

app.use(cors());
app.use(methodOverride('_method'));
app.use(bodyParser.json({ limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({ secret: 'thisisourpokeapi', resave: true, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
// /required for passport

// required for role based authorization
app.use(roles.middleware());
// /required for role based authorization

// Routing
app.use('/', routes);
app.use('/pokemons', pokemons);
app.use('/locations', locations);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        console.log(err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;