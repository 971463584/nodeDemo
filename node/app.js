var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');
var bodyParser = require('body-parser');
var globalConfig = require('./config/config')
var history = require('connect-history-api-fallback');

//引入页面
// var indexRouter = require('./routes/index');
var newPageRouter = require('./routes/newPage');
var modlesRouter = require('./routes/modles');
var editFileRouter = require('./routes/editFile');
var delFileRouter = require('./routes/delFile');
var historyDirectoryRouter = require('./routes/historyDirectory');
var updataFileRouter = require('./routes/updataFile');
var newChannelRouter = require('./routes/newChannel');
var newPageNameRouter = require('./routes/newPageName');
var hostRouter = require('./routes/host');


var app = express();

app.use(bodyParser.json({
  limit: '10000kb'
})); //最大上传大小不超过10000kb
app.use(bodyParser.urlencoded({
  limit: '10000kb',
  extended: true,
  parameterLimit:50000
}));

// 指定模板文件的后缀名为html
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', hbs.__express);

app.use(history());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
//静态服务
app.use('/pub',express.static(path.join(__dirname, 'public')));
console.log(globalConfig.landRootPath)
app.use('/pages', express.static(globalConfig.landRootPath));
app.use('/modle', express.static(path.join(__dirname, 'modle_html')));
app.use('/config', express.static(path.join(__dirname, 'config')));
app.use('/', express.static(path.join(__dirname, 'react-build')));

app.use(
  function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT,GET,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Request-With');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  }
);

//路径
// app.use('/', indexRouter);
app.use('/newPage', newPageRouter);
app.use('/modles', modlesRouter);
app.use('/editFile', editFileRouter);
app.use('/delFile', delFileRouter);
app.use('/historyDirectory', historyDirectoryRouter);
app.use('/updataFile', updataFileRouter);
app.use('/newChannel', newChannelRouter);
app.use('/newPageName', newPageNameRouter);
app.use('/host',hostRouter);

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