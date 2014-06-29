(function() {
  'use strict';

  angular
  .module('project-staffing')
  .controller('StaffingController', function($http, $scope, $filter){

    console.log('Staffing Controller');
    this.test = 10;
    var location = {lat: 51.161295, lng: 7.010175000000004}; // default location
    
    $scope.details = {};
    
    $scope.skillQuery = '';
    
    this.searchCustomer = function(employee) {
      console.log('search customer');
      console.log('search with skills '+$scope.skillQuery);
      if( $scope.details.geometry ) {
        location = $scope.details.geometry.location;
      }
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
      console.log('initialze '+$scope.skillQuery);
      
      var searchUrl = 'http://localhost:9000/api/mongo/employees';
      if ($scope.skillQuery) {
        var queryArray= $scope.skillQuery.toLowerCase().split(',');
        console.log('QUERY '+fullQuery);
        var fullQuery = '';
        for (var k = 0; k < queryArray.length; k++) {
            var skill = queryArray[k].trim();
            fullQuery += '&skills='+skill; 
        }
        searchUrl = 'http://localhost:9000/api/mongo/search/employees/skills?'+fullQuery;      
      }
      console.log('searchUrl'+searchUrl);
      $http.get(searchUrl).success(function(data) {
        console.log('Get employees from backend');
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
                            
                            console.log('sort projects ' + emp.projects.length);
                            emp.projects.sort(function(a,b) {
                                if (a.start < b.start)
                                    return 1;
                                return 0;
                            });

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