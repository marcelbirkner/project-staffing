'use strict';

var express = require('express'),
  customer = require('./data/customer.js'),
  project = require('./data/project.js'),
  employee = require('./data/employee.js'),
  errors = require('./lib/errors');

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
app.get('/api/version', function(req, res){
  console.log('GET version');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  return res.json(200, version);
});

/**
 * CUSTOMER
 */
app.get('/api/customer', function(req, res){
  console.log('GET list of customers');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  addLinksToAllCustomers(customer);
  return res.json(200, customer);
});
app.get('/api/customer/:id', function(req, res){
  console.log('GET customer by id');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  addLinksToCustomer(customer[req.params.id]);
  return res.json(200, customer[req.params.id]);
});
function addLinksToCustomer(customer) {
	customer.links = {
    self: {
      href: '/api/customer/' + customer.id,
    }
  };
}
function addLinksToAllCustomers(list) {
  for (var customerId in list) {
    console.log(list[customerId]);
    addLinksToCustomer(list[customerId]);
  }
}

/**
 * EMPLOYEE
 */
app.get('/api/employee', function(req, res){
  console.log('GET employee list');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  addLinksToAllEmployees(employee);
  return res.json(200, employee);
});
app.get('/api/employee/:id', function(req, res){
  console.log('GET employee by id');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  var emp = employee[req.params.id];
  if (!emp) {
    return errors.notFound(res);
  }
  addLinksToEmployee(emp);
  return res.json(200, emp);
});
function addLinksToEmployee(employee) {
  employee.links = {
    self: {
      href: '/api/employee/' + employee.id,
    }
  };
}
function addLinksToAllEmployees(list) {
  for (var employeeId in list) {
    console.log(list[employeeId]);
    addLinksToEmployee(list[employeeId]);
  }
}

/**
 * PROJECTS
 */
app.get('/api/project', function(req, res){
  console.log('GET project list');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  addLinksToAllProjects(project);
  return res.json(200, project);
});
app.get('/api/project/:id', function(req, res){
  console.log('GET project by id');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  var proj = project[req.params.id];
  if (!proj) {
    return errors.notFound(res);
  }
  addLinksToProject(proj);
  addLinksToCustomer(proj.customer);
  return res.json(200, proj);
});
function addLinksToProject(project) {
  project.links = {
    self: {
      href: '/api/project/' + project.id,
    }
  };
}
function addLinksToAllProjects(projects) {
  for (var projectId in projects) {
    console.log(projects[projectId]);
    addLinksToProject(projects[projectId]);
    addLinksToCustomer(projects[projectId].customer);  
  }
}
/**
 * MAIN
 */
app.listen(9000);
console.log('Listening on port 9000');
