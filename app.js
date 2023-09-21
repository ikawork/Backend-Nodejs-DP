var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./routes/users');
var driversRouter = require('./routes/drivers');
var passengersRouter = require('./routes/passengers');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const requestTimeAndLog = (req, res, next) => {
    console.log("REQUEST_DATA", req.params, req.query, req.body);
    req.time = new Date();
    next();
}

app.use(requestTimeAndLog);
app.use('/users',usersRouter);
app.use('/drivers',driversRouter);
app.use('/passengers',passengersRouter);

app.use(function(req,res,next){
    next(createError(404));
});

app.use(function(err,req,res,next){

    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;