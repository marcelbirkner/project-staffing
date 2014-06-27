(function() {
  'use strict';

  angular.module('project-staffing', [
    'ngRoute',
    'ngAutocomplete',
    'employee-directives',
  ]);

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
})();

(function() {
  'use strict';

  angular
  .module('project-staffing')
  .controller('AddressController', function($http, $scope){

    $scope.result = '';
	$scope.details = {};
    $scope.options = {};

    $scope.form = {
      type: 'geocode',
      watchEnter: true
    };

    this.saveAddress = function(employee) {
      console.log('update existing employee');
      console.log($scope.details);
      employee.homeaddress = $scope.details.geometry.location;
      $http.post('http://localhost:9000/api/mongo/employees/' + employee._id, JSON.stringify(employee));
    };

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
      this.employee = {};
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

  angular
  .module('project-staffing')
  .controller('NavigationController', function($scope){
    $scope.active = '';

    $scope.set = function(active) {
      $scope.active = active;
    };
  });

})();

(function() {
  'use strict';

  angular
  .module('project-staffing')
  .controller('ProjectController', function($http){

    this.deleteProject = function(id, employee) {
      console.log('delete project ' + id);
      console.log(employee.projects[id]);
      employee.projects.splice(id,1);
      $http.post('http://localhost:9000/api/mongo/employees/' + employee._id + '/projects', JSON.stringify(employee));
    };

    this.addProject = function(employee) {
      console.log(employee);
      if( employee.projects == null ) {
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

  angular
  .module('project-staffing')
  .controller('SkillController', function($http){

    this.skill = '';

    this.deleteSkill = function(id,employee) {
      console.log('delete skill ' + id);
      console.log(employee.skills[id]);
      employee.skills.splice(id,1);
      $http.post('http://localhost:9000/api/mongo/employees/' + employee._id + '/skills', JSON.stringify(employee));
    };

    this.addSkill = function(employee) {
      for(var skill in employee.skills ) {
        if( skill === this.skill ) {
          return;
        }
      }
      if( employee.skills == null ) {
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
  .controller('StaffingController', function($http){

    console.log('Staffing Controller');
    this.test = 10;
    
    var company = this;
    this.employees = company.employees;
    company.employees = [];

  
    var customermap = {};
    customermap['company1'] = {
      center: new google.maps.LatLng(51.2111382,6.7822516),
      name: 'Company 1 Düsseldorf'
    };

    var customerCircle;
    
    function initialize() {

        $http.get('http://localhost:9000/api/mongo/employees').success(function(data) {
          console.log('Get all employees from backend');
          company.employees = data;
        });

    
      // Create the map.
      var mapOptions = {
      zoom: 9,
      center: new google.maps.LatLng(51.2111382,6.7822516),
      mapTypeId: google.maps.MapTypeId.ROADMAP
      };

    
      var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

      // Construct the circle for each value in customermap
      for (var city in customermap) {
          var circleOptions = {
            strokeColor: '#4CC417',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#4CC417',
            fillOpacity: 0.35,
            map: map,
            center: customermap[city].center,
            radius: 50000
          };

          // Add the circle for this city to the map.
          customerCircle = new google.maps.Circle(circleOptions);
          var marker = new google.maps.Marker({
            position: customermap[city].center,
            map: map,
            title: customermap[city].name,
          });

          var infowindow = new google.maps.InfoWindow({
            content: '<b>Company 1</b><ul><li>Project: Hurrican</li><li>Java</li><li>HTML, CSS, JavaScript</li></ul>'
          });

          google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
          });
      }

        var image = {
            url: 'http://avatars.yandex.net/get-avatar/81634860/f30c9984082194d1e18aa03b3e53934d.4011-middle',
            size: new google.maps.Size(64, 64),
            // The origin for this image is 0,0.
            origin: new google.maps.Point(0,0),
            // The anchor for this image is the base of the flagpole at 0,64.
            anchor: new google.maps.Point(0, 64)
        };

        // Display multiple markers on a map
        var infoWindow = new google.maps.InfoWindow();
        var markerEmp, i;
        var employee;
        for (i = 0; i < company.employees.length; i++) {
              employee = company.employees[i];
              
              markerEmp = new google.maps.Marker({
                  position: new google.maps.LatLng(employee.homeaddress.k,employee.homeaddress.A),
                  map: map,
                  icon: image,
                  title: employee.name,
              });
              
               // Allow each marker to have an info window    
               google.maps.event.addListener(markerEmp, 'click', (function(markerEmp, i) {
                    return function() {
                        var emp = company.employees[i];
                        var content = '<b>' + emp.name + '</b>';
                        if (emp.skills) {
                            content += '<ul>';
                            for( var j = 0; j < emp.skills.length; j++) {
                                content += '<li>' + emp.skills[j] + '</li>';
                            }
                            content += '</ul>';
                        } else {
                            content += '<br>Keine Skills vorhanden.';
                        }
                        infoWindow.setContent(content);
                        infoWindow.open(map, markerEmp);
                    };
               })(markerEmp, i));                
        }        
    }

    google.maps.event.addDomListener(window, 'load', initialize);

    this.refreshMap = function() {
        initialize();
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
    })
    .when('/staffing', {
      templateUrl: 'views/staff_project.html',
      controller: 'StaffingController',
      controllerAs: 'staffingCtrl',
    })
    .when('/add-customer', {
      templateUrl: 'views/add_customer.html',
    })
    .when('/duesseldorf', {
      templateUrl: 'views/duesseldorf.html',
    })
    .when('/help', {
      templateUrl: 'views/help.html',
    })
    .otherwise({
      redirectTo: '/',
    });
  });
})();

