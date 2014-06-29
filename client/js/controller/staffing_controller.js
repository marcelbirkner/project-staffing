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
        location = $scope.details.geometry.location;
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
          google.maps.Circle(circleOptions);
          google.maps.Marker({
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
              position: new google.maps.LatLng(employee.homeaddress.k,employee.homeaddress.A),
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