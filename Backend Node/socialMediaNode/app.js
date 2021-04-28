var createError = require('http-errors');
var http = require('http');
var express = require('express');
var path = require('path');
var fileupload = require('express-fileupload')
var cookieParser = require('cookie-parser');
var session = require('express-session')
var logger = require('morgan');
var cors = require('cors')
var dotenv = require('dotenv').config()
var db = require('./connection/connection')
var collection = require('./connection/collection')
var chatUser = require('./helper/chatUser')
var chatMessage = require('./helper/chatMessage')

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

var socketio = require('socket.io')
var app = express();
var server = http.createServer(app)
var port = 3001
app.set('port', port)
server.listen(port)
const io = socketio(server, {   
  cors: {
    origin: "*"
  }
})

io.on('connection', socket => {
  console.log("A user connected");    
  socket.on('joinChat', async ({ sender, receiver, senderName, receiverName }) => {
    const person = chatUser.userJoin(socket.id, sender, receiver, senderName, receiverName)
  })
  socket.on('chatMessage', data => {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i');
    let urlCheck = !!pattern.test(data.msg) 
    let resp = chatMessage.chatMessage(data.msg, data.senderId, data.receiverId, urlCheck)
    db.get().collection(collection.CHAT_COLLECTION).insertOne(resp)
    io.emit('chatResponse',resp )
  })

})
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
      secure: true
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
db.connect((err) => {
  if (err) {
    console.log("Database Connection Failure");
  } else {
    console.log("Database Connection Success");
  }
})
app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
