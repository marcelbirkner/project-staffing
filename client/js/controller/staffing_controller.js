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

