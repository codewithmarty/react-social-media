var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const favicon = require('serve-favicon')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')

require('dotenv').config()

require('./config/database')

var app = express();
app.use(cors())
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3001

let activeUsers = [];

const newUser = (userId, socketId) => {
  if (!activeUsers.some(user => user.userId === userId)) {
    activeUsers.push({userId: userId, socketId: socketId})
  } 
}

const delUser = (socketId) => {
  activeUsers = activeUsers.filter(user => user.socketId !== socketId)
}

const fetchUser = (userId) => {
  return activeUsers.find(user => user.userId == userId)
}

io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} has connected`)
  socket.on("send_user", userId => {
    newUser(userId, socket.id)
    io.emit("get_users", activeUsers)
  })

  socket.on("send_message", data => {
    const receiver = fetchUser(data.receiver._id);
    if (receiver) {
      io.to(receiver.socketId).emit("get_message", data)
    }
  })

  socket.on("disconnect", () => {
    delUser(socket.id)
    io.emit("get_users", activeUsers)
  })

})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build')));
app.use(require('./config/checkToken'));

app.use('/api/users', require('./routes/users'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

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
  res.send('404');
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})