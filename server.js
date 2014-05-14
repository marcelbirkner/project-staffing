'use strict';

var express = require('express');
var app = express();
var cors = require('cors');
var nodeValidator = require('validator');
var expressValidator = require('express-validator');
var http = require('http');
var util = require('util');

var version = {'version':'1.0.0'};

/**
 * Statischen Content ausliefern
 */
app.configure(function(){
  app.use(express.bodyParser());
  app.use(expressValidator());
  app.use(cors());
  app.use(express.static(__dirname + '/static'));
  app.use('/static', express.static(__dirname + '/static'));
});


/**
 * ANWENDUNG
 */
app.get('/version', function(req, res){
  console.log('GET version');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  return res.json(200, version);
});


/**
 * MAIN
 */
app.listen(9000);
console.log('Listening on port 9000');
