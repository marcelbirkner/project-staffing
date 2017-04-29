'use strict';

// ExpressJS settings
var express = require('express');
var app = express();
var cors = require('cors');
var expressValidator = require('express-validator');
var util = require('util');
var path = require('path');

// mongodb settings
var mongojs = require('mongojs');
var databaseUrl = 'projectstaffing';
if (typeof process.env.MONGODB_PORT_27017_TCP_ADDR !== 'undefined' && process.env
  .MONGODB_PORT_27017_TCP_ADDR) {
  databaseUrl = process.env.MONGODB_PORT_27017_TCP_ADDR +
    '/projectstaffing';
}
console.log('Setting databaseURL to ' + databaseUrl);
var collections = ['employees', 'customers', 'projects', 'activities'];
var db = mongojs.connect(databaseUrl, collections);

console.log('Register MongoDB events');
db.on('error', err => {
  console.log('Database error', err);
});
db.on('ready', () => {
  console.log('Database status: connected');
});

var customer = require('./data/customer.js');
var activityList = require('./data/activities.js');
var project = require('./data/project.js');
var employee = require('./data/employee.js');
var errors = require('./lib/errors');

/**
 * Version of backend system. Each addition of a new REST Service changes the version number.
 */
var version = {
  'version': '1.4.0'
};

function mapStatic(dirname, maxAge) {
  if (maxAge) {
    return express.static(path.join(__dirname, dirname), {
      maxAge: 31536000000
    });
  } else {
    return express.static(path.join(__dirname, dirname));
  }
}

/**
 * Deliver static content
 */
app.configure(() => {
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(expressValidator());
  app.use(cors());

  // dev mode assets (TODO Only serve when a DEV env variable is set)
  app.use('/dev', mapStatic('client/html', false));
  app.use('/dev/css', mapStatic('static/css', false));
  app.use('/dev/vendor/js', mapStatic('node_modules', true));
  app.use('/dev/js', mapStatic('client/js', true));

  // production routes
  app.use('/css', mapStatic('static/css', true));
  app.use('/js', mapStatic('static/js', true));

  // routes for comparison between optimized and non optimized page
  app.use('/no-cache/css', mapStatic('static/no-cache/css', false));
  app.use('/no-cache/js', mapStatic('static/no-cache/js', false));

  // fallback route
  app.use('/', mapStatic('static', false));
});

/**
 * Root resource
 */
app.get('/api', (req, res) => {
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
        },
        createCustomer: {
          href: '/api/mongo/customers',
          method: 'POST',
          description: 'Create new customer',
        },
        deleteCustomer: {
          href: '/api/mongo/customers/:id',
          method: 'DELETE',
          description: 'Delete customer by id',
        }
      }
    },
    activities: {
      links: {
        allActivities: {
          href: '/api/mongo/activities',
          method: 'GET',
          description: 'Get an array of all activities',
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
        }
      }
    },
  });
});

/**
 * REST SERVICE VERSION
 */
app.get('/api/version', (req, res) => {
  console.log('GET - version');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  return res.json(200, version);
});

/**
 * MONGODB INIT
 */
app.get('/api/mongo/init', (req, res) => {
  console.log('GET - init mongodb testdata');
  initTestData(req.query.all);
  return res.json(200, {
    'message': 'MongoDB test data initialized'
  });
});

function saveEmployee(item) {
  db.employees.save(item, (err, saved) => {
    if (err || !saved) {
      console.log('Employee not saved. ' + err);
    }
  });
}

function saveProject(item) {
  db.projects.save(item, (err, saved) => {
    if (err || !saved) {
      console.log('Projects not saved');
    }
  });
}

function saveCustomer(item) {
  db.customers.save(item, (err, saved) => {
    if (err || !saved) {
      console.log('Customer not saved');
    }
  });
}

function saveActivity(item) {
  db.activities.save(item, (err, saved) => {
    if (err || !saved) {
      console.log('Activity not saved');
    }
  });
}

function initTestData(all) {

  db.customers.remove({});
  db.projects.remove({});
  db.employees.remove({});
  db.activities.remove({});

  console.log('Initializing customer testdata in MongoDB ' + all);
  for (var id in customer) {
    var customerItem = customer[id];
    saveCustomer(customerItem);
  }

  console.log('Initializing employee testdata in MongoDB');
  for (var eid in employee) {
    var item = employee[eid];
    saveEmployee(item);
  }

  console.log('Initializing activity testdata in MongoDB');
  for (var aid in activityList) {
    var activityItem = activityList[aid];
    saveActivity(activityItem);
  }

  console.log('Initializing project testdata in MongoDB');
  for (var pid in project) {
    var projectItem = project[pid];
    saveProject(projectItem);
  }

  if (all) {
    console.log('Generate 200 test users for MongoDB');
    for (var i = 0; i < 200; i++) {
      var emp = {};
      emp.name = 'Test-' + i;
      emp.email = 'test-' + i + '@company.com';
      emp.twitter = '@test-' + i;
      emp.address = 'Test address-' + i;
      emp.office = 'Solingen';

      saveEmployee(emp);
    }
  }
}

/**
 * Customer API
 */
app.get('/api/mongo/customers', (req, res) => {
  console.log('GET - array of all customers');
  db.customers.find({}, (err, customers) => {
    if (err || !customer || customer.length === 0) {
      return res.json(404, {
        error: 'No customers found'
      });
    } else {
      console.log(err);
      return res.json(200, customers);
    }
  });
});
app.post('/api/mongo/customers', (req, res) => {
  console.log('POST - create new customer');
  db.customers.save(req.body, (err, saved) => {
    if (err || !saved) {
      console.log('Customer not saved');
      return res.send(500, {
        error: 'Customer not saved.'
      });
    } else {
      console.log('Customer saved');
      return res.end();
    }
  });
});
app.delete('/api/mongo/customers/:id', (req, res) => {
  console.log('DELETE - customer by id');
  var id = req.params.id;
  db.customers.remove({
    _id: mongojs.ObjectId(id)
  }, err => {
    if (err) {
      console.log(err);
    }
  });
  return res.end();
});

/**
 * Project API
 */
app.get('/api/mongo/projects', (req, res) => {
  console.log('GET - array of all projects');
  db.projects.find({}, (err, projects) => {
    if (err || !projects || projects.length === 0) {
      return res.json(404, {
        error: 'No projects found'
      });
    } else {
      return res.json(200, projects);
    }
  });
});

/**
 * Activities API
 */
app.get('/api/mongo/activities', (req, res) => {
  console.log('GET - array of all activities');
  db.activities.find().limit(20).sort({
    timestamp: -1
  }, (err, activities) => {
    if (err || !activities) {
      return res.json(404, {
        error: 'No activities found'
      });
    } else {
      return res.json(200, activities);
    }
  });
});
app.post('/api/mongo/activities', (req, res) => {
  console.log('POST - create new activity');
  db.activities.save(req.body, (err, saved) => {
    if (err || !saved) {
      console.log('Activity not saved');
      return res.send(500, {
        error: 'Activity not saved.'
      });
    } else {
      console.log('Activity saved');
      return res.end();
    }
  });
});

/**
 * Employee API
 */
app.get('/api/mongo/employees', (req, res) => {
  console.log('GET - array of all employees');
  db.employees.find({}, (err, employees) => {
    if (err || !employees) {
      return res.json(404, {
        error: 'No employees found'
      });
    } else {
      return res.json(200, employees);
    }
  });
});
app.get('/api/mongo/employees/:id', (req, res) => {
  console.log('GET - employee by id');
  var id = req.params.id;
  db.employees.findOne({
    _id: mongojs.ObjectId(id)
  }, (err, employeeObject) => {
    if (err || !employeeObject) {
      console.log('No employee found');
      return res.json(404, employeeObject);
    } else {
      return res.json(200, employeeObject);
    }
  });
});
app.post('/api/mongo/employees', (req, res) => {
  console.log('POST - create new employee');
  db.employees.save(req.body, (err, saved) => {
    if (err || !saved) {
      console.log('Employee not saved');
      return res.send(500, {
        error: 'Employee not saved.'
      });
    } else {
      console.log('Employee saved');
      return res.end();
    }
  });
});
app.delete('/api/mongo/employees/:id', (req, res) => {
  console.log('DELETE - employee by id');
  var id = req.params.id;
  db.employees.remove({
    _id: mongojs.ObjectId(id)
  }, err => {
    if (err) {
      console.log(err);
    }
  });
  return res.end();
});
app.get('/api/mongo/search/employee', (req, res) => {
  console.log('GET - search employee with query param');
  db.employees.find(req.query, (err, employees) => {
    if (err || employees.length === 0) {
      console.log('No employees found');
      return res.json(404, employees);
    } else {
      return res.json(200, employees);
    }
  });
});
app.post('/api/mongo/employees/:id', (req, res) => {
  console.log('POST - update employee by id');
  var id = req.params.id;
  var employeeObject = req.body;
  employeeObject.createdOn = Date.now();
  delete employeeObject._id;
  console.log(employeeObject);
  db.employees.findAndModify({
    query: {
      _id: mongojs.ObjectId(id)
    },
    update: {
      $set: employeeObject
    },
    new: true
  }, (err, doc, lastErrorObject) => {
    console.log(err);
    console.log(doc);
    console.log(lastErrorObject);
  });
  return res.end();
});
app.post('/api/mongo/employees/:id/skills', (req, res) => {
  console.log('POST - update skills array of existing employee');
  var id = req.params.id;
  db.employees.findAndModify({
    query: {
      _id: mongojs.ObjectId(id)
    },
    update: {
      $set: {
        skills: req.body.skills
      }
    },
    new: true
  }, (err, doc) => {
    console.log(doc);
  });
  res.end();
});
app.post('/api/mongo/employees/:id/projects', (req, res) => {
  console.log('POST - update projects array of existing employee');
  var id = req.params.id;
  db.employees.findAndModify({
    query: {
      _id: mongojs.ObjectId(id)
    },
    update: {
      $set: {
        projects: req.body.projects
      }
    },
    new: true
  }, (err, doc) => {
    console.log(doc);
  });
  res.end();
});
app.get('/api/mongo/search/employees/skills', (req, res) => {
  console.log('GET - array of employees with certain skills');
  // map incoming query parameter to mongodb search query
  var input = req.query;
  var fullQuery = {};
  if (util.isArray(input.skills)) {
    var query = input.skills.map(skill => ({
      skills: skill
    }));
    fullQuery = {
      $and: query
    };
  } else {
    fullQuery = input;
  }
  console.log(fullQuery);

  db.employees.find(fullQuery, (err, employees) => {
    if (err || !employees || employees.length === 0) {
      console.log('No employees found');
      return res.json(404, employees);
    } else {
      return res.json(200, employees);
    }
  });
});

/**
 * Dashboard API
 */
app.get('/api/mongo/search/location/employees', (req, res) => {
  console.log('GET - array of employees grouped by location');

  db.employees.aggregate([{
    $group: {
      _id: '$office',
      total: {
        $sum: 1
      }
    }
  }], (err, employees) => {
    if (err) {
      console.log('No employees found');
      return res.json(404, employees);
    } else {
      return res.json(200, employees);
    }
  });

});
app.get('/api/mongo/search/employees/latestproject', (req, res) => {
  console.log('GET - array of employees with latest project');

  /*
    var oldQuery = [{
      $unwind: "$projects"
    }, {
      $group: {
        _id: '$_id',
        test: {
          end: {
            $max: '$end'
          }
        }
      }
    }];
    */

  var query = [{
    $project: {
      name: 1,
      office: 1,
      projects: 1
    }
  }, {
    '$unwind': '$projects '
  }, {
    '$sort': {
      'projects.end': -1
    }
  }];
  db.employees.aggregate(query, (err, employees) => {
    if (err) {
      console.log(err);
      console.log('No employees found');
      return res.json(404, employees);
    } else {
      return res.json(200, employees);
    }
  });
});

/**

db.col.aggregate([
    {$unwind: '$Array'},
    {$group: {_id: '$_id', Array: {K: {$max: '$K'}, V: {$max: '$V'}}}}
])

{
    "_id": "53c10a4cb29815f8044be9f0",
    "name": "Andreas",
    "projects": [
      {
        "name": "Smoketest Project 3",
        "description": "Develop a Java backend Java application",
        "start": "2012-01-01",
        "end": "2013-04-01"
      },
      {
        "name": "Smoketest Project 4",
        "description": "Develop a JavaScript frontend application",
        "start": "2013-05-01",
        "end": "2014-09-01"
      }
    ]
  },

{
    "host" : "example.com",
    "ips" : [
        {
            "ip" : NumberLong("1111111111"),
            "timestamp" : NumberLong(1373970044)
        },
        {
            "ip" : NumberLong("2222222222"),
            "timestamp" : NumberLong(1234978746)
        }
    ]
}

coll.aggregate([
  {$unwind: "$ips"},
  {$project:{host:"$host",ip:"$ips.ip", ts:"$ips.timestamp"} },
  {$sort:{ts:1} },
  {$group: {_id: "$host", IPOfMaxTS:{$last: "$ip"}, ts:{$last: "$ts"} } }
])


*/



// ################################################################
// ################################################################
// Static testdata, will be removed later on
// ################################################################
// ################################################################


/**
 * PROJECTS
 */
app.get('/api/project', (req, res) => {
  console.log('GET project list');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  addLinksToAllProjects(project);
  return res.json(200, project);
});
app.get('/api/project/:id', (req, res) => {
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

function addLinksToProject(proj) {
  proj.links = {
    self: {
      href: '/api/project/' + proj.id
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
app.get('/api/customer', (req, res) => {
  console.log('GET list of customers');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  addLinksToAllCustomers(customer);
  return res.json(200, customer);
});
app.get('/api/customer/:id', (req, res) => {
  console.log('GET customer by id');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  addLinksToCustomer(customer[req.params.id]);
  return res.json(200, customer[req.params.id]);
});

function addLinksToCustomer(cust) {
  cust.links = {
    self: {
      href: '/api/customer/' + cust.id
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
app.get('/api/employee', (req, res) => {
  console.log('GET employee list');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  addLinksToAllEmployees(employee);
  return res.json(200, employee);
});
app.get('/api/employee/:id', (req, res) => {
  console.log('GET employee by id');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  var emp = employee[req.params.id];
  if (!emp) {
    return errors.notFound(res);
  }
  addLinksToEmployee(emp);
  return res.json(200, emp);
});

function addLinksToEmployee(emp) {
  emp.links = {
    self: {
      href: '/api/employee/' + emp.id
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
 * MAIN APP
 */
app.listen(9000);
console.log('Listening on port 9000');

initTestData();
