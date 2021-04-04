var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fileupload = require('express-fileupload')
var cookieParser = require('cookie-parser');
var session = require('express-session')
var logger = require('morgan');
var cors = require('cors')
var dotenv = require('dotenv').config()
var db = require('./connection/connection')
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(
  session({
    key: 'user_id',
    secret: 'this is random',
    resave: false,
    saveUninitialized: false,
    cookie: {

     maxAge: 500000,
     secure:true
    }

  })
);
app.use(function (req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  
  next();
})
app.use(fileupload())
app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
db.connect((err)=>
{
  if(err)
  {
    console.log("Database Connection Failure");
  }else{
    console.log("Database Connection Success");
  }
})
app.use('/', userRouter);
app.use('/admin', adminRouter);

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
