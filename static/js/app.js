(function() {
  'use strict';

  angular.module('project-staffing', [
    'ngRoute',
    'ngAutocomplete',
    'employee-directives',
    'ngAnimate',    
  ]);

})();

(function() {
  'use strict';

  angular.module('project-staffing').controller('AddressController', function($http, $scope) {

    $scope.result = '';
    $scope.details = {};
    $scope.options = {};

    $scope.form = {
      type : 'geocode',
      watchEnter : true
    };

    this.saveAddress = function(employee) {
      console.log('update existing employee');
      console.log($scope.details);
      
      var keys = Object.keys($scope.details.geometry.location);
      employee.homeaddress = {};
      employee.homeaddress.longitude = $scope.details.geometry.location[keys[0]];
      employee.homeaddress.latitude = $scope.details.geometry.location[keys[1]];

      $http.post('http://localhost:9000/api/mongo/employees/' + employee._id, JSON.stringify(employee));
    };

  });

})();

(function() {
  'use strict';

  angular
  .module('project-staffing')
  .controller('CustomerController', function($http, $scope, $filter){

    console.log('Customer Controller');

    var company = this;
    company.customers = [];
    
    var drawCircle = false;

    this.customer = {};

    $scope.details = {};
    $scope.options = {};

    $scope.form = {
      type: 'geocode',
      watchEnter: true
    };

    $http.get('http://localhost:9000/api/mongo/customers').success(function(data) {
        console.log('Get all customers from backend');
        console.log(data);
        company.customers = data;
    });

    this.addCustomer = function() {
        console.log('add customer');
        this.customer.companyaddress = {};
        
        var keys = Object.keys($scope.details.geometry.location)
        this.customer.companyaddress.longitude = $scope.details.geometry.location[keys[0]];
        this.customer.companyaddress.latitude = $scope.details.geometry.location[keys[1]];
        
        $http.post('http://localhost:9000/api/mongo/customers', JSON.stringify(this.customer));

        $http.get('http://localhost:9000/api/mongo/customers').success(function(data) {
            console.log('Get all customers from backend');
            company.customers = data;
            console.log(data);
        });
    };

    this.deleteCustomer = function(id) {
      console.log('delete customer ' + id);
      $http.delete('http://localhost:9000/api/mongo/customers/' + id);

      for (var i in company.customers){
        console.log(company.customers[i]);
        console.log(i);
        if( company.customers[i]._id === id ) {
          console.log('Delete item from array');
          company.customers.splice(i,1);
        }
      }
    };

    this.editCustomer = function(id) {
      for (var i in company.customers){
        if( company.customers[i]._id === id ) {
          console.log('Edit Customer');
          this.customer = company.customers[i];
        }
      }
    };
    
    this.resetForm = function() {
        console.log('reset form');
        this.customer = {};
    };

    /** Google Map **/
    var location = {lat: 51.161295, lng: 7.010175000000004}; // default location
    var image = {
        url: 'img/company-icon.png',
        size: new google.maps.Size(64, 64),
        origin: new google.maps.Point(0,0),  // The origin for this image is 0,0
        anchor: new google.maps.Point(0, 64) // The anchor for this image is the base of the flagpole at 0,64
    };
    
    $scope.details = {};
    
    var customers = [];
    var drawCircle = false;
    
    this.searchCustomers = function() {
      console.log('search customers');
      
      if( $scope.details.geometry ) {
        location = $scope.details.geometry.location;
        drawCircle = true;
      }
      
      var searchUrl = 'http://localhost:9000/api/mongo/customers';
      $http.get(searchUrl).success(function(data) {
        console.log('Get customers from backend');
        customers = data;
        initializeMap();
      });      
   };
   
    /**
     * Function to initialize Google Map
     */
    function initializeMap() {
      console.log('initialze map');
         
      // Create the map
      var mapOptions = {
          zoom: 9,
          center: location,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };
    
      var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

      if ( drawCircle ) {
          var circleOptions = {
              strokeColor: '#4CC417',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#4CC417',
              fillOpacity: 0.35,
              map: map,
              center: location,
              radius: 50000
          };

          // Add the circle for this city to the map.
          new google.maps.Circle(circleOptions);
          new google.maps.Marker({
              position: location,
              map: map,
              title: 'Found Address',
          });
      }
      
      // Display multiple markers on a map
      var infoWindow = new google.maps.InfoWindow();
      var markerCustomer, i;
      var customer;
            
      for (i = 0; i < customers.length; i++) {
          customer = customers[i];
          
          markerCustomer = new google.maps.Marker({
              position: new google.maps.LatLng(customer.companyaddress.longitude, customer.companyaddress.latitude),
              map: map,
              icon: image,
              title: customer.company,
          });
          
           // Allow each marker to have an info window    
           google.maps.event.addListener(markerCustomer, 'click', (function(markerCustomer, i) {
                return function() {
                    var cust = customers[i];
                    var content = '<p><b>' + cust.company + '</b></p><table class="table"><tr>';
                    content += '<tr><td><span class="label label-primary">Industry</span></td><td>' + cust.industry + '</td></tr>';
                    content += '<tr><td><span class="label label-primary">Address</span></td><td>' + cust.address + '</td></tr></table>';
                                        
                    infoWindow.setContent(content);
                    infoWindow.open(map, markerCustomer);
                };
           })(markerCustomer, i));                
        }        
    }

    google.maps.event.addDomListener(window, 'load', initializeMap);

  });

})();
(function() {
  'use strict';

  angular.module('project-staffing').controller('DashboardController', function($http, $scope, $filter) {

    console.log('Dashboard Controller');
    
    var location = this;
    location.employees = [];
    location.latestprojects = [];
    
    // draw table
    var dataArray = [
        ['Lat', 'Long', 'Office', 'Revenue', 'No. Employees', 'Utilization'],
        [51.1672852,7.0626139, 'Solingen', {v: 12, f: '12.0%'}, 0, 85],
        [51.2111382,6.7822516, 'Düsseldorf', {v: 7.3, f: '7.3%'}, 0, 65],
        [48.1368364,11.5234671, 'München', {v: 3.6, f: '3.6%'}, 0, 75],
        [52.5083545,13.3771307, 'Berlin', {v: 2.1, f: '2.1%'}, 0, 86],
        [49.00367,8.36476, 'Karlsruhe', {v: 5.4, f: '5.4%'}, 0, 40],
        [50.0779865,8.6246555, 'Frankfurt', {v: 3.1, f: '3.1%'}, 0, 55],
        [53.55539,9.98492, 'Hamburg', {v: 2.5, f: '2.5%'}, 0, 30],
        [51.4969802, 11.9688029, 'Halle (Saale)', {v: -5.1, f: '5.1%'}, 0, 20]
    ];
    
    $http.get('http://localhost:9000/api/mongo/search/location/employees').success(function(data) {
        console.log('Get employees grouped by location');
        location.employees = data;
        for ( var id in dataArray ) {
            var locationKey = dataArray[id][2];
            for ( var idLocation in location.employees ) {
                if ( location.employees[idLocation]._id == locationKey ) {
                    var totalEmployees = location.employees[idLocation].total;
                    dataArray[id][4] = totalEmployees;
                };
            };            
        };
        
        var geoData = google.visualization.arrayToDataTable(dataArray);
        var geoView = new google.visualization.DataView(geoData);
        geoView.setColumns([0, 1]);

        var tableView = new google.visualization.DataView(geoData);
        tableView.setColumns([2, 3, 4, 5]);

        var table = new google.visualization.Table(document.getElementById('table_div'));

        var formatter = new google.visualization.ArrowFormat();
        formatter.format(geoData, 3); // Apply formatter to 4th column

        var barformatter = new google.visualization.BarFormat({width: 150, min: 0, max: 100});
        barformatter.format(geoData, 5); // Apply formatter to second column

        table.draw(tableView, {showRowNumber: false, allowHtml: true});

        // draw map
        var mapOptions = { mapType:'normal', showTip: false, enableScrollWheel: true};
        var map = new google.visualization.Map(document.getElementById('map_div'));
        map.draw(geoView, mapOptions);

        // Set a 'select' event listener for the table.
        // When the table is selected, we set the selection on the map.
        google.visualization.events.addListener(table, 'select',
        function() {
            map.setSelection(table.getSelection());
        });

        // Set a 'select' event listener for the map.
        // When the map is selected, we set the selection on the table.
        google.visualization.events.addListener(map, 'select',
        function() {
            table.setSelection(map.getSelection());
        });
 
    });

    $http.get('http://localhost:9000/api/mongo/search/employees/latestproject').success(function(data) {
        console.log('Get latest project for all employees');
        console.log(data);
        location.latestprojects = data;
        
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Name');
        data.addColumn('string', 'Office');
        data.addColumn('string', 'Project Name');
        data.addColumn('date', 'Start');
        data.addColumn('date', 'End');
        
        for ( var id in location.latestprojects) {
            var item = location.latestprojects[id];
            console.log(item);
            data.addRow([item.name, item.office, item.projects.name, new Date(item.projects.start), new Date(item.projects.end)]);
        };
        
        var table = new google.visualization.Table(document.getElementById('latestprojects_div'));
        table.draw(data, {showRowNumber: false, sortColumn: 4});
    });   
    
 });

})();

(function() {
  'use strict';

  angular
  .module('project-staffing')
  .controller('EmployeeController', function($http) {

    var company = this;

    this.tab = 1;
    this.employees = company.employees;
    this.employee = {};

    company.employees = [];

    $http.get('http://localhost:9000/api/mongo/employees').success(function(data) {
      console.log('Get all employees from backend');
      company.employees = data;
    });

    this.showTabs = function(){
      console.log('show tabs');
      if( this.employee._id === undefined ) {
        return false;
      }
      return true;
    };

    this.editEmployee = function(id) {
      for (var i in this.employees){
        if( this.employees[i]._id === id ) {
          console.log('Edit Employee');
          this.employee = this.employees[i];
        }
      }
    };

    this.resetForm = function() {
      this.employee = {};
    };

    this.addEmployee = function() {
      if( this.employee._id === undefined ) {
        console.log('add new employee');
        $http.post('http://localhost:9000/api/mongo/employees', JSON.stringify(this.employee));
      } else {
        console.log('update existing employee');
        $http.post('http://localhost:9000/api/mongo/employees/' + this.employee._id, JSON.stringify(this.employee));
      }
      $http.get('http://localhost:9000/api/mongo/employees').success(function(data) {
        console.log('Update all employees from backend');
        company.employees = data;
      });
    };

    this.deleteEmployee = function(id) {
      console.log('Delete employee with id: ' + JSON.stringify(id));
      $http.delete('http://localhost:9000/api/mongo/employees/' + id);

      for (var i in this.employees){
        console.log(this.employees[i]);
        console.log(i);
        if( this.employees[i]._id === id ) {
          console.log('Delete item from array');
          this.employees.splice(i,1);
        }
      }
    };

    });

})();

(function() {
  'use strict';

  angular.module('project-staffing').controller('NavigationController', function($scope) {
    $scope.active = '';

    $scope.set = function(active) {
      $scope.active = active;
    };
  });

})();

(function() {
  'use strict';

  angular.module('project-staffing').controller('ProjectController', function($http) {

    this.deleteProject = function(id, employee) {
      console.log('delete project ' + id);
      console.log(employee.projects[id]);
      employee.projects.splice(id, 1);
      $http.post('http://localhost:9000/api/mongo/employees/' + employee._id + '/projects', JSON.stringify(employee));
    };

    this.addProject = function(employee) {
      console.log(employee);
      if (employee.projects == null) {
        employee.projects = [];
      }
      employee.projects.push(this.project);
      $http.post('http://localhost:9000/api/mongo/employees/' + employee._id + '/projects', JSON.stringify(employee));
      this.project = {};
    };
  });

})();

(function() {
  'use strict';

  angular.module('project-staffing').controller('SkillController', function($http) {

    this.skill = '';

    this.deleteSkill = function(id, employee) {
      console.log('delete skill ' + id);
      console.log(employee.skills[id]);
      employee.skills.splice(id, 1);
      $http.post('http://localhost:9000/api/mongo/employees/' + employee._id + '/skills', JSON.stringify(employee));
    };

    this.addSkill = function(employee) {
      for ( var skill in employee.skills) {
        if (skill === this.skill) {
          return;
        }
      }
      if (employee.skills == null) {
        employee.skills = [];
      }
      employee.skills.push(this.skill);

      $http.post('http://localhost:9000/api/mongo/employees/' + employee._id + '/skills', JSON.stringify(employee));

      this.skill = '';
    };
  });

})();

(function() {
  'use strict';

  angular
  .module('project-staffing')
  .controller('StaffingController', function($http, $scope, $filter){

    console.log('Staffing Controller');

    var location = {lat: 51.161295, lng: 7.010175000000004}; // default location
    var image = {
        url: 'img/default-face.png',
        size: new google.maps.Size(64, 64),
        origin: new google.maps.Point(0,0),  // The origin for this image is 0,0
        anchor: new google.maps.Point(0, 64) // The anchor for this image is the base of the flagpole at 0,64
    };
    
    $scope.details = {};    
    $scope.skillQuery = '';
    
    var employees = [];
    var drawCircle = false;
    
    this.searchCustomer = function() {
      console.log('search customer');
      
      if( $scope.details.geometry ) {
        var keys = Object.keys($scope.details.geometry.location)
        location.lat = $scope.details.geometry.location[keys[0]];
        location.lng = $scope.details.geometry.location[keys[1]];
        drawCircle = true;
      }
      
      var searchUrl = 'http://localhost:9000/api/mongo/employees';
      if ($scope.skillQuery) {
        var queryArray = $scope.skillQuery.toLowerCase().split(',');
        var fullQuery = '';
        for (var k = 0; k < queryArray.length; k++) {
            var skill = queryArray[k].trim();
            fullQuery += '&skills=' + skill; 
        }
        searchUrl = 'http://localhost:9000/api/mongo/search/employees/skills?' + fullQuery;      
      }
      
      $http.get(searchUrl).success(function(data) {
        console.log('Get employees from backend');
        employees = data;
        initializeMap();
      });      
   };
   
    /**
     * Function to initialize Google Map
     */
    function initializeMap() {
      console.log('initialze map');
         
      // Create the map
      var mapOptions = {
          zoom: 9,
          center: location,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };
    
      var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

      if ( drawCircle ) {
          var circleOptions = {
              strokeColor: '#4CC417',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#4CC417',
              fillOpacity: 0.35,
              map: map,
              center: location,
              radius: 50000
          };

          // Add the circle for this city to the map.
          new google.maps.Circle(circleOptions);
          new google.maps.Marker({
              position: location,
              map: map,
              title: 'Selected Customer',
          });
      }
      
      // Display multiple markers on a map
      var infoWindow = new google.maps.InfoWindow();
      var markerEmp, i;
      var employee;
            
      for (i = 0; i < employees.length; i++) {
          employee = employees[i];
          
          markerEmp = new google.maps.Marker({
              position: new google.maps.LatLng(employee.homeaddress.longitude,employee.homeaddress.latitude),
              map: map,
              icon: image,
              title: employee.name,
          });
          
           // Allow each marker to have an info window    
           google.maps.event.addListener(markerEmp, 'click', (function(markerEmp, i) {
                return function() {
                    var emp = employees[i];
                    var content = '<p><b>' + emp.name + '</b></p>';
                    if (emp.skills) {
                        content += '<p><span class="label label-success">Skills</span><table class="table"><tr><td>';
                        for( var j = 0; j < emp.skills.length; j++) {
                            content += emp.skills[j] + ', ';
                        }
                        content = content.slice(0, - 2); // remove last colon
                        content += '</td></tr></table></p>';
                    } else {
                        content += '<br>No skills.';
                    }
                    if (emp.projects) {
                        content += '<p><span class="label label-success">Projects</span><table class="table">';
                        
                        emp.projects.sort(function(a,b) {
                            if (a.start < b.start) {
                                return 1;
                            }
                            return 0;
                        });

                        for(var m = 0; m < emp.projects.length; m++) {
                            var projectStart = emp.projects[m].start;
                            var projectEnd = emp.projects[m].end;
                            if( projectEnd === undefined ) {
                                projectEnd = 'Current';
                            }
                            var projectName = emp.projects[m].name;                                
                            content += '<tr><td><span class="label label-primary">' + $filter('date')(projectStart, 'yyyy-MM-dd') + '</span></td>';
                            content += '<td><span class="label label-info">' + $filter('date')(projectEnd, 'yyyy-MM-dd') + '</span></td><td>' + projectName + '</td></tr>';
                        }
                        content += '</table></p>';
                    } else {
                        content += '<br>No projects.';
                    }
                    
                    infoWindow.setContent(content);
                    infoWindow.open(map, markerEmp);
                };
           })(markerEmp, i));                
        }        
    }

    google.maps.event.addDomListener(window, 'load', initializeMap);
 
  });

})();
(function(){
  'use strict';

  var app = angular.module('employee-directives', []);

  app.directive('navigation', function(){
  return {
    restrict: 'E',
    templateUrl: 'navigation.html'
  };
  });
  app.directive('employeeTable', function(){
  return {
    restrict: 'E',
    templateUrl: 'employee-table.html'
  };
  });
  app.directive('employeeList', function(){
  return {
    restrict: 'E',
    templateUrl: 'employee-list.html'
  };
  });
  app.directive('employeeForm', function(){
  return {
    restrict: 'E',
    templateUrl: 'employee-form.html'
  };
  });
  app.directive('skillForm', function(){
  return {
    restrict: 'E',
    templateUrl: 'skill-form.html'
  };
  });
  app.directive('projectForm', function(){
  return {
    restrict: 'E',
    templateUrl: 'project-form.html'
  };
  });
  app.directive('homeaddressForm', function(){
  return {
    restrict: 'E',
    templateUrl: 'homeaddress-form.html'
  };
  });
  app.directive('searchaddressForm', function(){
  return {
    restrict: 'E',
    templateUrl: 'searchaddress-form.html'
  };
  });
  app.directive('customerTable', function() {
  return {
    restrict : 'E',
    templateUrl : 'customer-table.html'
  };
  });
  app.directive('searchCustomerAddressForm', function(){
  return {
    restrict: 'E',
    templateUrl: 'searchcustomeraddress-form.html'
  };
  });
})();

(function() {
  'use strict';

  angular
  .module('project-staffing')
  .config(function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/index.html',
    })
    .when('/dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardController',
      controllerAs: 'dashboardCtrl',
    })
    .when('/list-employees', {
      templateUrl: 'views/list_employees.html',
      controller: 'EmployeeController',
      controllerAs: 'employeeCtrl',
    })
    .when('/add-employee', {
      templateUrl: 'views/add_employee.html',
      controller: 'EmployeeController',
      controllerAs: 'employeeCtrl',
    })
    .when('/list-customers', {
      templateUrl: 'views/list_customers.html',
      controller: 'CustomerController',
      controllerAs: 'customerCtrl',
    })
    .when('/staffing', {
      templateUrl: 'views/staff_project.html',
      controller: 'StaffingController',
      controllerAs: 'staffingCtrl',
    })
    .when('/add-customer', {
      templateUrl: 'views/add_customer.html',
      controller: 'CustomerController',
      controllerAs: 'customerCtrl',
    })
    .when('/help', {
      templateUrl: 'views/help.html',
    })
    .otherwise({
      redirectTo: '/',
    });
  });
})();

