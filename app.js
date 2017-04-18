'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const log4js = require('log4js');
const mongoose = require('mongoose');

const CONFIG = require('./config/config.json');

const app = express();
app.locals.pretty = true;
app.set('case sensitive routes', true); //페이지 라우트 시 대소문자 구분
const logger = log4js.getLogger('app');
const routes = require('./config/routes')();

/**
 * 운영환경
 */
app.settings.env = 'development';
//app.settings.env = 'production';

/**
 * replace this with the log4js connect-logger
 * app.use(logger('dev'));
 */
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));

app.use(flash());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: CONFIG.cryptoKey, resave: false, saveUninitialized: true}));
app.use(methodOverride('_method'));

/**
 * Compression config: https://www.npmjs.com/package/compression
 */
app.use(compression());

/**
 * static resources
 */
app.use(favicon(path.join(__dirname, 'app/public/favicon.ico')));
app.use(require('serve-static')(path.join(__dirname, 'app/public')));

/**
 * view engine setup
 */
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');


/**
 * routes
 */
app.use(routes);

/**
 * database
 */
require('./config/mongoose');

module.exports = app;

/**
 * listen up
 */
/*
app.listen(CONFIG.port, function(){
  //and... we're live
  //console.log('Server is running on port ' + CONFIG.port);
  logger.debug('Server is running on port ' + CONFIG.port);
});
*/
