(function() {
  'use strict';

  angular.module('project-staffing', [
    'ngRoute',
    'ngAutocomplete',
    'employee-directives',
  ]);

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
  .controller('StaffingController', function($http, $scope, $filter){

    console.log('Staffing Controller');
    this.test = 10;
    var location = {lat: 51.161295, lng: 7.010175000000004}; // default location
    
    $scope.details = {};
    
    this.searchCustomer = function(employee) {
      console.log('search customer');
      location = $scope.details.geometry.location;
      initialize();
    };
    
    var company = this;
    this.employees = company.employees;
    company.employees = [];
  
    var customermap = {};
    customermap['company1'] = {
      center: location,
      name: 'Provinzial'
    };

    var customerCircle;
    
    function initialize() {
    
      $http.get('http://localhost:9000/api/mongo/employees').success(function(data) {
        console.log('Get all employees from backend');
        company.employees = data;
      });
    
      console.log('Current Map Center location');
      console.log(location);
    
      // Create the map.
      var mapOptions = {
          zoom: 9,
          center: location,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };
    
      var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

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
          customerCircle = new google.maps.Circle(circleOptions);
          var marker = new google.maps.Marker({
            position: location,
            map: map,
            title: 'Customer',
          });

          var infowindow = new google.maps.InfoWindow({
            content: '<b>Company 1</b><ul><li>Project: Hurrican</li><li>Java</li><li>HTML, CSS, JavaScript</li></ul>'
          });

          google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
          });

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
                            for( var j = 0; j < emp.projects.length; j++) {
                                console.log($filter('date')(emp.projects[j].end, 'yyyy-MM-dd'));
                                var projectStart = emp.projects[j].start;
                                var projectEnd = emp.projects[j].end;
                                if( projectEnd === undefined ) {
                                    projectEnd = 'Current';
                                }
                                var projectName = emp.projects[j].name;                                
                                content += '<tr><td><span class="label label-primary">'+ $filter('date')(projectStart, 'yyyy-MM-dd') + '</span></td>';
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

    google.maps.event.addDomListener(window, 'load', initialize);

    this.refreshMap = function() {
        initialize();
    };
    
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
    .when('/help', {
      templateUrl: 'views/help.html',
    })
    .otherwise({
      redirectTo: '/',
    });
  });
})();

