(function() {
  'use strict';

  angular.module('project-staffing', [
    'ngRoute',
    'ngAutocomplete',
    'employee-directives',
    'ngAnimate',
  ]);

})();

;(function() {
  'use strict';

  angular
  .module('project-staffing')
  .controller('AddressController', ['$http', '$scope', '$location', function($http, $scope, $location) {

    var url = $location.protocol() + '://' + $location.host() + ':' +
      $location.port();

    $scope.result = '';
    $scope.details = {};
    $scope.options = {};

    $scope.form = {
      type : 'geocode',
      watchEnter : true
    };

    this.saveAddress = function(employee) {
      var keys = Object.keys($scope.details.geometry.location);
      employee.homeaddress = {};
      employee.homeaddress.longitude =
        $scope.details.geometry.location[keys[0]];
      employee.homeaddress.latitude = $scope.details.geometry.location[keys[1]];

      $http.post(url + '/api/mongo/employees/' + employee._id,
        JSON.stringify(employee));

      // TODO: get userid from session
      var user = 'max';
      var msg = 'updated the address of an existing employee ';
      var activity = {
        timestamp: new Date(),
        subject: user,
        action: msg,
        object: employee.name
      };
      $http.post(url + '/api/mongo/activities', JSON.stringify(activity));

    };

  }]);

})();

;/* global google */
/* eslint-disable no-loop-func, no-new */
(function() {
  'use strict';

  angular
  .module('project-staffing')
  .controller('CustomerController', ['$http', '$scope', '$location', function($http, $scope, $location){

    var url = $location.protocol() + '://' + $location.host() + ':' +
      $location.port();

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

    $http.get(url + '/api/mongo/customers').success(function(data) {
        company.customers = data;
    });

    this.addCustomer = function() {
        this.customer.companyaddress = {};
        var keys = Object.keys($scope.details.geometry.location);
        this.customer.companyaddress.longitude = $scope.details.geometry.location[keys[0]];
        this.customer.companyaddress.latitude = $scope.details.geometry.location[keys[1]];

        // TODO: get userid from session
        var user = 'jon';
        var msg = 'created a new customer';
        var activity = {timestamp: new Date(), subject: user, action: msg, object: this.customer.company};
        $http.post(url + '/api/mongo/customers', JSON.stringify(this.customer));
        $http.post(url + '/api/mongo/activities', JSON.stringify(activity));

        $http.get(url + '/api/mongo/customers').success(function(data) {
            company.customers = data;
        });
    };

    this.deleteCustomer = function(id) {

      var deletedCustomer;
      for (var i in company.customers){
        if( company.customers[i]._id === id ) {
          deletedCustomer = company.customers[i];
          company.customers.splice(i,1);
        }
      }

      // delete customer in backend
      $http.delete(url + '/api/mongo/customers/' + id);

      // TODO: get userid from session
      var user = 'julia';
      var msg = 'deleted customer';
      var activity = {timestamp: new Date(), subject: user, action: msg, object: deletedCustomer.company};
      $http.post(url + '/api/mongo/activities', JSON.stringify(activity));

    };

    this.editCustomer = function(id) {
      for (var i in company.customers){
        if( company.customers[i]._id === id ) {
          this.customer = company.customers[i];
        }
      }
    };

    this.resetForm = function() {
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
    drawCircle = false;

    this.searchCustomers = function() {

      if( $scope.details.geometry ) {
        location = $scope.details.geometry.location;
        drawCircle = true;
      }

      var searchUrl = url + '/api/mongo/customers';
      $http.get(searchUrl).success(function(data) {
        customers = data;
        initializeMap();
      });
    };

    /**
     * Function to initialize Google Map
     */
    function initializeMap() {

      // Create the map
      var mapOptions = {
          zoom: 9,
          center: location,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

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
              position:
                new google.maps.LatLng(customer.companyaddress.longitude,
                customer.companyaddress.latitude),
              map: map,
              icon: image,
              title: customer.company,
          });

          // Allow each marker to have an info window
          google.maps.event.addListener(markerCustomer, 'click', (function(markerCustomer, i) {
            return function() {
              var cust = customers[i];
              var content = '<p><b id="customerTitle">' +
                cust.company + '</b></p><table class="table"><tr>' +
                '<tr><td><span class="label label-primary">' +
                'Industry</span></td><td>' + cust.industry + '</td></tr>' +
                '<tr><td><span class="label label-primary">Address' +
                '</span></td><td>' + cust.address + '</td></tr></table>';
              infoWindow.setContent(content);
              infoWindow.open(map, markerCustomer);
            };
          })(markerCustomer, i));
        }
      }

    google.maps.event.addDomListener(window, 'load', initializeMap);
  }]);

})();

;/* global google */
(function() {
  'use strict';

  angular.module('project-staffing').controller('DashboardController', ['$http', '$location', function($http, $location) {

    var url = $location.protocol() + '://' + $location.host() + ':' + $location.port();

    var location = this;
    location.employees = [];
    location.latestprojects = [];

    // draw table
    var dataArray = [
        ['Lat', 'Long', 'Office', 'Revenue', 'No. Employees', 'Utilization'],
        [51.1672852, 7.0626139, 'Solingen', {v: 12, f: '12.0%'}, 0, 85],
        [51.2111382, 6.7822516, 'Düsseldorf', {v: 7.3, f: '7.3%'}, 0, 65],
        [48.1368364, 11.5234671, 'München', {v: 3.6, f: '3.6%'}, 0, 75],
        [52.5083545, 13.3771307, 'Berlin', {v: 2.1, f: '2.1%'}, 0, 86],
        [49.00367, 8.36476, 'Karlsruhe', {v: 5.4, f: '5.4%'}, 0, 40],
        [50.0779865, 8.6246555, 'Frankfurt', {v: 3.1, f: '3.1%'}, 0, 55],
        [53.55539, 9.98492, 'Hamburg', {v: 2.5, f: '2.5%'}, 0, 30],
        [51.4969802, 11.9688029, 'Halle (Saale)', {v: -5.1, f: '5.1%'}, 0, 20]
    ];

    $http.get(url + '/api/mongo/search/location/employees').success(function(data) {
        location.employees = data;

        for ( var id in dataArray ) {
            var locationKey = dataArray[id][2];
            for ( var idLocation in location.employees ) {
                if ( location.employees[idLocation]._id === locationKey ) {
                    var totalEmployees = location.employees[idLocation].total;
                    dataArray[id][4] = totalEmployees;
                }
            }
        }

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
    //.error(function (data, status, headers, config) {
    //  return status;
    //});

    $http.get(url + '/api/mongo/search/employees/latestproject').success(function(dataLatestProjects) {
        location.latestprojects = dataLatestProjects;

        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Name');
        data.addColumn('string', 'Office');
        data.addColumn('string', 'Project Name');
        data.addColumn('date', 'Start');
        data.addColumn('date', 'End');
        data.addColumn('number', 'Idle since (days)');

        for ( var id in location.latestprojects) {
            var item = location.latestprojects[id];
            var behind = Math.ceil( ( new Date(item.projects.end) - new Date() ) / (1000 * 60 * 60 * 24) );
            data.addRow([item.name, item.office, item.projects.name,
              new Date(item.projects.start), new Date(item.projects.end), behind]);
        }

        var colorformatter = new google.visualization.ColorFormat();
        colorformatter.addRange(-100000, -15, 'white', 'red');
        colorformatter.addRange(-14, 0, 'white', 'orange');
        colorformatter.addRange(1, 60, 'black', 'yellow');
        colorformatter.addRange(61, 100000, 'white', 'green');
        colorformatter.format(data, 5);

        var formatter = new google.visualization.DateFormat({pattern: 'yyyy-MM-dd'});
        formatter.format(data, 3);
        formatter.format(data, 4);

        var table = new google.visualization.Table(document.getElementById('latestprojects_div'));
        table.draw(data, {showRowNumber: false, allowHtml: true, sortColumn: 4});
    });

 }]);

})();

;(function() {
  'use strict';

  angular
  .module('project-staffing')
  .controller('EmployeeController', ['$http', '$location', function($http, $location) {

    var url = $location.protocol() + '://' + $location.host() + ':' + $location.port();

    var company = this;

    this.tab = 1;
    this.employees = company.employees;
    this.employee = {};

    company.employees = [];

    $http.get(url + '/api/mongo/employees').success(function(data) {
      company.employees = data;
    });

    this.showTabs = function(){
      if( this.employee._id === undefined ) {
        return false;
      }
      return true;
    };

    this.editEmployee = function(id) {
      for (var i in this.employees){
        if( this.employees[i]._id === id ) {
          this.employee = this.employees[i];
        }
      }
    };

    this.resetForm = function() {
      this.employee = {};
    };

    this.addEmployee = function() {
      if( this.employee._id === undefined ) {
        $http.post(url + '/api/mongo/employees', JSON.stringify(this.employee));
      } else {
        $http.post(url + '/api/mongo/employees/' + this.employee._id, JSON.stringify(this.employee));
      }
      // TODO: get userid from session
      var user = 'jon';
      var msg = 'added a new employee';
      var activity = {timestamp: new Date(), subject: user, action: msg, object: this.employee.name};
      $http.post(url + '/api/mongo/activities', JSON.stringify(activity));

      $http.get(url + '/api/mongo/employees').success(function(data) {
        company.employees = data;
      });
    };

    this.deleteEmployee = function(id) {
      $http.delete(url + '/api/mongo/employees/' + id);

      var deletedEmployee;
      for (var i in this.employees){
        if( this.employees[i]._id === id ) {
          deletedEmployee = this.employees[i];
          this.employees.splice(i,1);
        }
      }

      // TODO: get userid from session
      var user = 'max';
      var msg = 'deleted a employee';
      var activity = {timestamp: new Date(), subject: user, action: msg, object: deletedEmployee.name};
      $http.post(url + '/api/mongo/activities', JSON.stringify(activity));

    };

    }]);

})();

;(function() {
  'use strict';

  angular.module('project-staffing').controller('NavigationController', ['$scope', function($scope) {
    $scope.active = '';

    $scope.set = function(active) {
      $scope.active = active;
    };
  }]);

})();

;(function() {
  'use strict';

  angular.module('project-staffing').controller('ProjectController', ['$http', '$location', function($http, $location) {

    var url = $location.protocol() + '://' + $location.host() + ':' + $location.port();

    this.deleteProject = function(id, employee) {
      employee.projects.splice(id, 1);
      $http.post(url + '/api/mongo/employees/' + employee._id + '/projects', JSON.stringify(employee));

      // TODO: get userid from session
      var user = 'julia';
      var msg = 'deleted a project';
      var activity = {timestamp: new Date(), subject: user, action: msg, object: employee.projects[id].name};
      $http.post(url + '/api/mongo/activities', JSON.stringify(activity));
    };

    this.addProject = function(employee) {
      if (employee.projects == null) {
        employee.projects = [];
      }
      employee.projects.push(this.project);
      $http.post(url + '/api/mongo/employees/' + employee._id + '/projects', JSON.stringify(employee));
      this.project = {};

      // TODO: get userid from session
      var user = 'maria';
      var msg = 'added a new project';
      var activity = {timestamp: new Date(), subject: user, action: msg, object: this.project.name};
      $http.post(url + '/api/mongo/activities', JSON.stringify(activity));
    };

  }]);

})();

;(function() {
  'use strict';

  angular.module('project-staffing').controller('SkillController', ['$http', '$location', function($http, $location) {

    var url = $location.protocol() + '://' + $location.host() + ':' + $location.port();

    this.skill = '';

    this.deleteSkill = function(id, employee) {
      employee.skills.splice(id, 1);
      $http.post(url + '/api/mongo/employees/' + employee._id + '/skills', JSON.stringify(employee));

      // TODO: get userid from session
      var user = 'julia';
      var msg = 'deleted skill';
      var activity = {timestamp: new Date(), subject: user, action: msg, object: employee.skills[id]};
      $http.post(url + '/api/mongo/activities', JSON.stringify(activity));

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
      if( this.skill.length > 0 ) {
        employee.skills.push(this.skill);

        $http.post(url + '/api/mongo/employees/' + employee._id + '/skills', JSON.stringify(employee));

        // TODO: get userid from session
        var user = 'jon';
        var msg = 'added skill';
        var activity = {timestamp: new Date(), subject: user, action: msg, object: this.skill};
        $http.post(url + '/api/mongo/activities', JSON.stringify(activity));

        this.skill = '';
      }

    };

  }]);

})();

;/* global google */
/* eslint-disable no-loop-func, no-new */
(function() {
  'use strict';

  angular
  .module('project-staffing')
  .controller('StaffingController', ['$http', '$scope', '$filter', '$location', function($http, $scope, $filter, $location){

    var url = $location.protocol() + '://' + $location.host() + ':' + $location.port();

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
      if( $scope.details.geometry ) {
        var keys = Object.keys($scope.details.geometry.location);
        location.lat = $scope.details.geometry.location[keys[0]];
        location.lng = $scope.details.geometry.location[keys[1]];
        drawCircle = true;
      }

      var searchUrl = url + '/api/mongo/employees';
      if ($scope.skillQuery) {
        var queryArray = $scope.skillQuery.toLowerCase().split(',');
        var fullQuery = '';
        for (var k = 0; k < queryArray.length; k++) {
            var skill = queryArray[k].trim();
            fullQuery += '&skills=' + skill;
        }
        searchUrl = url + '/api/mongo/search/employees/skills?' + fullQuery;
      }

      $http.get(searchUrl).success(function(data) {
        employees = data;
        initializeMap();
      });
   };

    /**
     * Function to initialize Google Map
     */
    function initializeMap() {
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

                        emp.projects.sort(function(a, b) {
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
                            content += '<tr><td><span class="label label-primary">' +
                              $filter('date')(projectStart, 'yyyy-MM-dd') + '</span></td>';
                            content += '<td><span class="label label-info">' +
                              $filter('date')(projectEnd, 'yyyy-MM-dd') + '</span></td><td>' +
                              projectName + '</td></tr>';
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

  }]);

})();

;(function() {
  'use strict';

  angular.module('project-staffing').controller('TimelineController', ['$http', '$location', function($http, $location) {

    var url = $location.protocol() + '://' + $location.host() + ':' + $location.port();

    var timeline = this;
    timeline.list = [];

    $http.get(url + '/api/mongo/activities').success(function(data) {
      timeline.list = data;
    });
  }]);

})();

;(function(){
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

;(function() {
  'use strict';

  angular.module('project-staffing').filter('firstLetterUppercase', function() {
    return function(input) {
      if( input.length === 0 ) {
        return '';
      }
      var array = input.split(/[ ]+/);
      var result = '';
      for(var i = 0; i < array.length; i++) {
        result += array[i].charAt(0).toUpperCase() + array[i].slice(1) + ' ';
      }
      return result.trim();
    };
  });

})();

;'use strict';

/**
 * A directive for adding google places autocomplete to a text box
 * google places autocomplete info: https://developers.google.com/maps/documentation/javascript/places
 *
 * Usage:
 *
 * + ng-model - autocomplete textbox value
 *
 * + details - more detailed autocomplete result, includes address parts, latlng, etc. (Optional)
 *
 * + options - configuration for the autocomplete (Optional)
 *
 *       + types: type,        String, values can be 'geocode', 'establishment', '(regions)', or '(cities)'
 *       + bounds: bounds,     Google maps LatLngBounds Object, biases results to bounds, but may return results outside these bounds
 *       + country: country    String, ISO 3166-1 Alpha-2 compatible country code. examples; 'ca', 'us', 'gb'
 *       + watchEnter:         Boolean, true; on Enter select top autocomplete result. false(default); enter ends autocomplete
 *
 * example:
 *
 *    options = {
 *        types: '(cities)',
 *        country: 'ca'
 *    }
**/

angular.module( "ngAutocomplete", [])
  .directive('ngAutocomplete', function() {
    return {
      require: 'ngModel',
      scope: {
        ngModel: '=',
        options: '=?',
        details: '=?'
      },

      link: function(scope, element, attrs, controller) {

        //options for autocomplete
        var opts
        var watchEnter = false
        //convert options provided to opts
        var initOpts = function() {

          opts = {}
          if (scope.options) {

            if (scope.options.watchEnter !== true) {
              watchEnter = false
            } else {
              watchEnter = true
            }

            if (scope.options.types) {
              opts.types = []
              opts.types.push(scope.options.types)
              scope.gPlace.setTypes(opts.types)
            } else {
              scope.gPlace.setTypes([])
            }

            if (scope.options.bounds) {
              opts.bounds = scope.options.bounds
              scope.gPlace.setBounds(opts.bounds)
            } else {
              scope.gPlace.setBounds(null)
            }

            if (scope.options.country) {
              opts.componentRestrictions = {
                country: scope.options.country
              }
              scope.gPlace.setComponentRestrictions(opts.componentRestrictions)
            } else {
              scope.gPlace.setComponentRestrictions(null)
            }
          }
        }

        if (scope.gPlace == undefined) {
          scope.gPlace = new google.maps.places.Autocomplete(element[0], {});
        }
        google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
          var result = scope.gPlace.getPlace();
          if (result !== undefined) {
            if (result.address_components !== undefined) {

              scope.$apply(function() {

                scope.details = result;

                controller.$setViewValue(element.val());
              });
            }
            else {
              if (watchEnter) {
                getPlace(result)
              }
            }
          }
        })

        //function to get retrieve the autocompletes first result using the AutocompleteService
        var getPlace = function(result) {
          var autocompleteService = new google.maps.places.AutocompleteService();
          if (result.name.length > 0){
            autocompleteService.getPlacePredictions(
              {
                input: result.name,
                offset: result.name.length
              },
              function listentoresult(list, status) {
                if(list == null || list.length == 0) {

                  scope.$apply(function() {
                    scope.details = null;
                  });

                } else {
                  var placesService = new google.maps.places.PlacesService(element[0]);
                  placesService.getDetails(
                    {'reference': list[0].reference},
                    function detailsresult(detailsResult, placesServiceStatus) {

                      if (placesServiceStatus == google.maps.GeocoderStatus.OK) {
                        scope.$apply(function() {

                          controller.$setViewValue(detailsResult.formatted_address);
                          element.val(detailsResult.formatted_address);

                          scope.details = detailsResult;

                          //on focusout the value reverts, need to set it again.
                          var watchFocusOut = element.on('focusout', function(event) {
                            element.val(detailsResult.formatted_address);
                            element.unbind('focusout')
                          })

                        });
                      }
                    }
                  );
                }
              });
          }
        }

        controller.$render = function () {
          var location = controller.$viewValue;
          element.val(location);
        };

        //watch options provided to directive
        scope.watchOptions = function () {
          return scope.options
        };
        scope.$watch(scope.watchOptions, function () {
          initOpts()
        }, true);

      }
    };
  });
;(function() {
  'use strict';

  angular
  .module('project-staffing')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/index.html',
    })
    .when('/timeline', {
      templateUrl: 'views/timeline.html',
      controller: 'TimelineController',
      controllerAs: 'timelineCtrl',
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
  }]);
})();