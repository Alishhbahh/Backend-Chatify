var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const deleteStories= require('./src/deletestories')
const cron = require('node-cron');


var indexRouter = require('./src/routes/index');
var usersRouter = require('./src/routes/users');

var app = express();
cron.schedule('0 0 * * *', async () => { // change from one minute to one day later
  await deleteStories();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

const ip = '192.168.18.163'; // replace with your IP address
const port = 4000;

// your routes and middleware go here

// start the server
app.listen(port, ip, () => {
  console.log(`Server running at http://${ip}:${port}/`);
});
const server = app.listen(4000, () => {
  console.log(`Server running on port ${server.address().port}`);
});

const corsOptions = {
  origin: 'exp://192.168.18.163:19000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

module.exports = app;
