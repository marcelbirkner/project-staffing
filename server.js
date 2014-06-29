'use strict';

var express = require('express'),
  customer = require('./data/customer.js'),
  project = require('./data/project.js'),
  employee = require('./data/employee.js'),
  errors = require('./lib/errors');

// express settings
var app = express();
var cors = require('cors');
var nodeValidator = require('validator');
var expressValidator = require('express-validator');
var http = require('http');
var util = require('util');

// mongodb settings
var mongojs = require('mongojs');
var databaseUrl = "projectstaffing";
var collections = ["employees", "customers", "projects"];
var db = mongojs.connect(databaseUrl, collections);

var version = {'version':'1.2.0'};

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
 * Root Resource
 */
app.get('/api', function(req, res) {
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  return res.json(200, {
    app: {
	  links: {
	    version: {
		  href: '/api/version',
		  method: 'GET',
		  description: 'Get version of app'
		},
	    init: {
		  href: '/api/mongo/init',
		  method: 'GET',
		  description: 'Initialize MongoDB with test data'
		}
	  }
	},
	customers: {
      links: {
	    allCustomers: {
		  href: '/api/mongo/customers',
		  method: 'GET',
		  description: 'Get an array of all customers',
		}
	  }
	},
	projects: {
      links: {
	    allProjects: {
		  href: '/api/mongo/projects',
		  method: 'GET',
		  description: 'Get an array of all projects',
		}
	  }
	},
    employees: {
      links: {
	    allEmployees: {
		  href: '/api/mongo/employees',
		  method: 'GET',
		  description: 'Get an array of all employees',
		},
		createEmployee: {
		  href: '/api/mongo/employees',
		  method: 'POST',
		  description: 'Create new employee',
		},
	    employeeById: {
		  href: '/api/mongo/employees/:id',
		  method: 'GET',
		  description: 'Get employee by unique id',
		},
		deleteEmployeeById: {
		  href: '/api/mongo/employees/:id',
		  method: 'DELETE',
		  description: 'Delete employee with unique id',
		},
	    updateEmployeeById: {
		  href: '/api/mongo/employees/:id',
		  method: 'POST',
		  description: 'Update employee specified by unique id',
		},
		searchEmployeesByQueryString: {
		  href: '/api/mongo/search/employee/',
		  method: 'GET',
		  description: 'Get array of employee that match the query string, i.e. ?email=Tim.Miller@company.com',
		},
		addSkillsToEmployee: {
		  href: '/api/mongo/employees/:id/skills',
		  method: 'POST',
		  description: 'Add skills to employee, i.e. {skills: [ java, tdd, smoketest] }'
		},
		addProjectsToEmployee: {
		  href: '/api/mongo/employees/:id/projects',
		  method: 'POST',
		  description: 'Add projects to employee, i.e. {projects: [ {name: Project, description: Project Description, start: 2014-01-01, end: 2015-01-05} ] }'
		},
		searchEmployeesWithCertainSkills: {
		  href: '/api/mongo/search/employees/skills',
		  method: 'GET',
		  description: 'Get array of employee that have certain skills, i.e. ?skills=java&skills=tdd'
		},
        createCustomer: {
		  href: '/api/mongo/customer',
		  method: 'POST',
		  description: 'Create new customer',
		}
	  }
    },
  });
});

/**
 * VERSION
 */
app.get('/api/version', function(req, res){
  console.log('GET - version');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  return res.json(200, version);
});

/**
 * MONGODB
 */
app.get('/api/mongo/init', function(req, res){
	console.log('GET - init mongodb with testdata');
	db.customers.remove({});
	db.projects.remove({});
	db.employees.remove({});
	for (var cust in customer) {
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

	if( req.query.all ) {
		console.log('Generate 200 test users for MongoDB');
		for (var i = 0; i < 200; i++) {
			var item = {};
			item.name = 'Test-'+i;
			item.email = 'test-'+i+'@company.com';
			item.twitter = '@test-'+i;
			item.address = 'Test address-'+i;
			item.office = 'Solingen';

			db.employees.save(item, function(err, saved) {
				if( err || !saved )
					console.log("Employee not saved");
				else
					console.log("Employee saved");
			});
		}
	}

	return res.json(200, {'message':	'MongoDB test data initialized'});
});

/**
 * Customer API
 */
app.get('/api/mongo/customers', function(req, res){
	console.log('GET - array of all customers');
	db.customers.find({}, function(err, customers) {
	  if( err || !customer || customer.length == 0)
	    return res.json(404, {error: 'No customers found'});
	  else
	    return res.json(200, customers);
	});
});
app.post('/api/mongo/customers', function(req, res){
	console.log('POST - create new customer');
	console.log(req.body);
	db.customers.save(req.body, function(err, saved) {
	  if( err || !saved ) {
		console.log("Customer not saved");
		return res.send(500, { error: 'Customer not saved.' })
	  } else {
		console.log("Customer saved");
		return res.end();
	  }
	});
});
app.delete('/api/mongo/customers/:id', function(req, res){
	console.log('DELETE - customer by id');
	console.log(req.params.id);
	var id = req.params.id;
	db.customers.remove({_id: mongojs.ObjectId(id)}, function(err, lastErrorObject) {
		if( err ) console.log(err);
	});
	return res.end();
});

/**
 * Project API
 */
app.get('/api/mongo/projects', function(req, res){
	console.log('GET - array of all projects');
	db.projects.find({}, function(err, projects) {
	  if( err || !projects || projects.length == 0)
	    return res.json(404, {error: 'No projects found'});
	  else
	    return res.json(200, projects);
	});
});

/**
 * Employee API
 */
app.get('/api/mongo/employees', function(req, res){
	console.log('GET - array of all all employees');
	db.employees.find({}, function(err, employees) {
	  if( err || !employees)
	    return res.json(404, {error: 'No employees found'});
	  else
	    return res.json(200, employees);
	});
});
app.get('/api/mongo/employees/:id', function(req, res){
	console.log('GET - employee by id');
	var id = req.params.id;
	db.employees.findOne({_id: mongojs.ObjectId(id)}, function(err, employee) {
  	  if( err || !employee ) {
	    console.log("No employee found");
		return res.json(404, employee);
	  } else {
        return res.json(200, employee);
	  }
	});
});
app.post('/api/mongo/employees', function(req, res){
	console.log('POST - create new employee');
	console.log(req.body);
	db.employees.save(req.body, function(err, saved) {
	  if( err || !saved ) {
		console.log("Employee not saved");
		return res.send(500, { error: 'Employee not saved.' })
	  } else {
		console.log("Employee saved");
		return res.end();
	  }
	});
});
app.delete('/api/mongo/employees/:id', function(req, res){
	console.log('DELETE - employee by id');
	console.log(req.params.id);
	var id = req.params.id;
	db.employees.remove({_id: mongojs.ObjectId(id)}, function(err, lastErrorObject) {
		if( err ) console.log(err);
	});
	return res.end();
});
app.get('/api/mongo/search/employee', function(req, res){
	console.log('GET - search employee with query param');
	console.log(req.query);
	db.employees.find(req.query, function(err, employees) {
	  if( err || employees.length == 0 ) {
	    console.log("No employees found");
		return res.json(404, employees);
	  } else {
        return res.json(200, employees);
	  }
	});
});
app.post('/api/mongo/employees/:id', function(req, res){
	console.log('POST - update employee by id');
	var id = req.params.id;
	var employee = req.body;
	employee.createdOn = Date.now();
	delete employee._id;
	console.log(employee);
	db.employees.findAndModify({
		query: { _id: mongojs.ObjectId(id) },
		update: { $set: employee },
		new: true
	}, function(err, doc, lastErrorObject) {
		console.log(err);
		console.log(doc);
		console.log(lastErrorObject);
	});
	return res.end();
});
app.post('/api/mongo/employees/:id/skills', function(req, res){
	console.log('POST - update skills array of existing employee');
	console.log(req.body.skills);
	var id = req.params.id;
	db.employees.findAndModify({
		query: { _id: mongojs.ObjectId(id) },
		update: { $set: { skills: req.body.skills } },
		new: true
	}, function(err, doc, lastErrorObject) {
		console.log(doc);
	});
	res.end();
});
app.post('/api/mongo/employees/:id/projects', function(req, res){
	console.log('POST - update projects array of existing employee');
	console.log(req.body.projects);
	var id = req.params.id;
	db.employees.findAndModify({
		query: { _id: mongojs.ObjectId(id) },
		update: { $set: { projects: req.body.projects } },
		new: true
	}, function(err, doc, lastErrorObject) {
		console.log(doc);
	});
	res.end();
});
app.get('/api/mongo/search/employees/skills', function(req, res){
	console.log('GET - array of employees with certain skills');

	// map incoming query parameter to mongodb search query
	console.log(req.query);
	var input = req.query;
	var fullQuery = {};
	if( util.isArray( input.skills ) ) {
		var query = input.skills.map(function(skill) { return { skills: skill} });
		fullQuery = { $and: query};
	} else {
		fullQuery = input;
	}
	console.log('fullQuery '+fullQuery);

	db.employees.find(fullQuery, function(err, employees) {
	  if( err || !employees || employees.length == 0) {
	    console.log("No employees found");
		return res.json(404, employees);
	  } else {
        return res.json(200, employees);
	  }
	});
});


// ################################################################
// ################################################################
// Testdata without MongoDB, will be removed later on
// ################################################################
// ################################################################


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

// ################################################################
// ################################################################
// CLEAN UP END
// ################################################################
// ################################################################


/**
 * MAIN
 */
app.listen(9000);
console.log('Listening on port 9000');
