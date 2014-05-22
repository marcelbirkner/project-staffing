'use strict';

var express = require('express'),
    customer = require('./data/customer.js'),
    employee = require('./data/employee.js');

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
 * CUSTOMER
 */
app.get('/customer/list', function(req, res){
  console.log('GET list of customers');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  return res.json(200, customer);
});
app.get('/customer/:id', function(req, res){
  console.log('GET customer by id');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  return res.json(200, customer[req.params.id]);
});

/**
 * EMPLOYEE
 */
app.get('/employee/list', function(req, res){
  console.log('GET employee');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  return res.json(200, employee);
});
app.get('/employee/:id', function(req, res){
  console.log('GET employee by id');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  addLinksToEmployee(employee[req.params.id]);
  return res.json(200, employee[req.params.id]);
});

function addLinksToEmployee(employee) {
	employee.links = {
    self: {
      href: '/employee/' + employee.id,
    }
  };
}

/**
 * MAIN
 */
app.listen(9000);
console.log('Listening on port 9000');
