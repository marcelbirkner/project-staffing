(function() {
  'use strict';

  angular
  .module('project-staffing')
  .controller('StaffingController', function($http, $scope){

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