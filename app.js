var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session=require('express-session');
var ejs=require('ejs')

var routes = require('./routes/index');
var users = require('./routes/users');
//var chat = require('./routes/chat');

var app = express();


var MongoDBStore=require('connect-mongodb-session')(session);
var store=new MongoDBStore({
  uri:'mongodb://localhost:27017/mongo_session',
  collection:'sessions_test'
});

//mongodb连接
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/app');
global.mongoose = mongoose;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
//设置成.html
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    store: store,
    secret: '1111', 
    resave: true,
    name:'wang',
    saveUninitialized: true,
}));


app.use('/', routes);
app.use('/users', users);
//app.use('/chat', chat);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
