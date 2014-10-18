/* global google */
/* eslint-disable no-loop-func, no-new */
(function() {
  'use strict';

  angular
  .module('project-staffing')
  .controller('CustomerController', function($http, $scope, $location){

    console.log('Customer Controller');
    var url = $location.protocol() + '://' + $location.host() + ':' + $location.port();

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
        console.log('Get all customers from backend');
        console.log(data);
        company.customers = data;
    });

    this.addCustomer = function() {
        console.log('add customer');
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
            console.log('Get all customers from backend');
            company.customers = data;
            console.log(data);
        });
    };

    this.deleteCustomer = function(id) {
      console.log('delete customer ' + id);
      $http.delete(url + '/api/mongo/customers/' + id);

      var deletedCustomer;
      for (var i in company.customers){
        console.log(company.customers[i]);
        console.log(i);
        if( company.customers[i]._id === id ) {
          console.log('Delete item from array');
          deletedCustomer = company.customers[i];
          company.customers.splice(i,1);
        }
      }

      // TODO: get userid from session
      var user = 'julia';
      var msg = 'deleted customer';
      var activity = {timestamp: new Date(), subject: user, action: msg, object: deletedCustomer.company};
      $http.post(url + '/api/mongo/activities', JSON.stringify(activity));

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
    drawCircle = false;

    this.searchCustomers = function() {
      console.log('search customers');

      if( $scope.details.geometry ) {
        location = $scope.details.geometry.location;
        drawCircle = true;
      }

      var searchUrl = url + '/api/mongo/customers';
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
