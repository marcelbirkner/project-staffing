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

// mongodb settings
var databaseUrl = "projectstaffing";
var collections = ["employees", "customers", "projects"];
var db = require("mongojs").connect(databaseUrl, collections);

var version = {'version':'1.1.0'};

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
  console.log(employee.projects);
  var list = employee.projects;
  for (var projectId in list) {
    console.log(list[projectId]);
    addLinksToProject(list[projectId]);
  }
}
function addLinksToAllEmployees(list) {
  for (var employeeId in list) {
    console.log(list[employeeId]);
    addLinksToEmployee(list[employeeId]);
  }
}


/**
 * MONGODB
 */
app.get('/api/mongo/customers', function(req, res){
	console.log('GET mongodb customers result');
	db.customers.find({}, function(err, customers) {
	  if( err || !customer) 
	    return res.json(200, 'No customer found');
	  else 
	    return res.json(200, customers);
	});
}); 
app.get('/api/mongo/projects', function(req, res){
	console.log('GET mongodb projects result');
	db.projects.find({}, function(err, projects) {
	  if( err || !projects) 
	    return res.json(200, 'No projects found');
	  else 
	    return res.json(200, projects);
	});
}); 
app.get('/api/mongo/employees', function(req, res){
	console.log('GET mongodb employees result');
	db.employees.find({}, function(err, employees) {
	  if( err || !employees) 
	    return res.json(200, 'No employees found');
	  else 
	    return res.json(200, employees);
	});
});
app.get('/api/mongo/init', function(req, res){
	console.log('GET init mongodb with testdata');
	db.customers.remove({});
	db.projects.remove({});
	db.employees.remove({});
	for (var customerId in customer) {
		var cust = customer[customerId];
	  	db.customers.save(cust, function(err, saved) {
		  if( err || !saved ) 
			console.log("Customers not saved");
		  else 
			console.log("Customers saved");
		});
	}
	for (var id in employee) {
		var item = employee[id];
	  	db.employees.save(item, function(err, saved) {
		  if( err || !saved ) 
			console.log("Employee not saved");
		  else 
			console.log("Employee saved");
		});
	}
	for (var id in project) {
		var item = project[id];
	  	db.projects.save(item, function(err, saved) {
		  if( err || !saved ) 
			console.log("Projects not saved");
		  else 
			console.log("Projects saved");
		});
	}
	return res.json(200, {'message':	'MongoDB test data initialized'});
});
app.get('/api/mongo/search/employee', function(req, res){
	console.log('GET mongodb query params');
	console.log(req.query);
	db.employees.find(req.query, function(err, employees) {
	  if( err || !employees) { 
	    console.log("No employees found");
		return res.json(200, employees);
	  } else {
        return res.json(200, employees);
	  }
	});
});


/**
 * SEARCH
 */
app.get('/api/search', function(req, res){
  console.log('GET search result');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  var searchResult = {};
  for (var employeeId in employee) {
    var item = employee[employeeId];
	console.log(item);	
  };
  return res.json(200, searchResult);
});

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
