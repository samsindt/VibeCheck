// require middleware
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var auth = require('./middleware/auth');

// require view engine
var viewEngine = require('mustache-express');

// require routers
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');


// setup database connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/vibeCheckDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// setup express app
var app = express();

// setup view engine
app.engine('mustache', viewEngine());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// setup middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// setup file server
app.use(express.static(path.join(__dirname, 'public')));

// setup routes
app.use('/api', apiRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/', auth.verifyJWTCookie, indexRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
