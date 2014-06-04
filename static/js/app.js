(function() {
  var app = angular.module('employee', ['employee-directives', 'tab-controller', 'ngAutocomplete']);

  app.controller("AddressController",function ($scope) {

    $scope.result = '';
    $scope.options = {};

    $scope.form = {
      type: 'geocode',
      bounds: {SWLat: 49, SWLng: -97, NELat: 50, NELng: -96},
      country: 'ca',
      typesEnabled: false,
      boundsEnabled: false,
      componentEnabled: false,
      watchEnter: true
    }

    //watch form for changes
    $scope.watchForm = function () {
      return $scope.form
    };
    $scope.$watch($scope.watchForm, function () {
      $scope.checkForm()
    }, true);


    //set options from form selections
    $scope.checkForm = function() {

      $scope.options = {};

      $scope.options.watchEnter = $scope.form.watchEnter

      if ($scope.form.typesEnabled) {
        $scope.options.types = $scope.form.type
      }
      if ($scope.form.boundsEnabled) {

        var SW = new google.maps.LatLng($scope.form.bounds.SWLat, $scope.form.bounds.SWLng)
        var NE = new google.maps.LatLng($scope.form.bounds.NELat, $scope.form.bounds.NELng)
        var bounds = new google.maps.LatLngBounds(SW, NE);
        $scope.options.bounds = bounds

      }
      if ($scope.form.componentEnabled) {
        $scope.options.country = $scope.form.country
      }
    };

  });

  /**
   * Employee Controller
   */
  app.controller('EmployeeController', ['$http', function($http){
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
	}

	this.addEmployee = function() {
		if( this.employee._id === undefined ) {
		  console.log('add new employee');
		  $http.post('http://localhost:9000/api/mongo/employees', JSON.stringify(this.employee));
		} else {
		  console.log('update existing employee');
		  $http.post('http://localhost:9000/api/mongo/employees/'+this.employee._id, JSON.stringify(this.employee));
		}
		$http.get('http://localhost:9000/api/mongo/employees').success(function(data) {
			console.log('Update all employees from backend');
			company.employees = data;
		});
		this.employee = {};
	};

	this.deleteEmployee = function(id) {
		console.log('Delete employee with id: '+JSON.stringify(id));
		$http.delete('http://localhost:9000/api/mongo/employees/'+id);

		for (var i in this.employees){
			console.log(this.employees[i]);
			console.log(i);
			if( this.employees[i]._id === id ) {
				console.log('Delete item from array');
				this.employees.splice(i,1);
			}
		}
	};

  }]);
})();
