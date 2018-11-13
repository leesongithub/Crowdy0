angular.module('listings').controller('ListingsController', ['$scope', '$location', '$stateParams', '$state', 'Listings', 
  function($scope, $location, $stateParams, $state, Listings){
    var map, geojson;
    $scope.find = function() {
      /* set loader*/
      $scope.loading = true;

      /* Get all the listings, then bind it to the scope */
      Listings.getAll().then(function(response) {
        $scope.loading = false; //remove loader
        $scope.listings = response.data;
      }, function(error) {
        $scope.loading = false;
        $scope.error = 'Unable to retrieve listings!\n' + error;
      });
    };

    $scope.findOne = function() {
      debugger;
      $scope.loading = true;

      /*
        Take a look at 'list-listings.client.view', and find the ui-sref attribute that switches the state to the view 
        for a single listing. Take note of how the state is switched: 

          ui-sref="listings.view({ listingId: listing._id })"

        Passing in a parameter to the state allows us to access specific properties in the controller.

        Now take a look at 'view-listing.client.view'. The view is initialized by calling "findOne()". 
        $stateParams holds all the parameters passed to the state, so we are able to access the id for the 
        specific listing we want to find in order to display it to the user. 
       */

      var id = $stateParams.listingId;

      Listings.read(id)
              .then(function(response) {
                $scope.listing = response.data;

                //this block pre-fills the updaate form
                $scope.name = $scope.listing.name;
                $scope.rating = $scope.listing.rating;
                $scope.address = $scope.listing.address;
                //^

                $scope.loading = false;
              }, function(error) {  
                $scope.error = 'Unable to retrieve listing with id "' + id + '"\n' + error;
                $scope.loading = false;
              });
    };  

    $scope.create = function(isValid) {
      $scope.error = null;

      /* 
        Check that the form is valid. (https://github.com/paulyoder/angular-bootstrap-show-errors)
       */
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      /* Create the listing object */
      var listing = {
        name: $scope.name, 
        rating: $scope.rating, 
        address: $scope.address
      };

      /* Save the article using the Listings factory */
      Listings.create(listing)
              .then(function(response) {
                //if the object is successfully saved redirect back to the list page
                $state.go('listings.list', { successMessage: 'Listing succesfully created!' });
              }, function(error) {
                //otherwise display the error
                $scope.error = 'Unable to save listing!\n' + error;
              });
    };

    $scope.update = function(isValid) {
      /*
        Fill in this function that should update a listing if the form is valid. Once the update has 
        successfully finished, navigate back to the 'listing.list' state using $state.go(). If an error 
        occurs, pass it to $scope.error. 
       */
       $scope.error = null;

      /* 
        Check that the form is valid. (https://github.com/paulyoder/angular-bootstrap-show-errors)
       */
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      /* Create the listing object */
      var listing = {
        name: $scope.name, 
        rating: $scope.rating, 
        address: $scope.address
      };

      //grabs the listing id (the same way as the findOne() method above)
      var id = $stateParams.listingId;

      /* Update the article using the Listings factory */
      Listings.update(id, listing)
              .then(function(response) {
                //if the object is successfully saved redirect back to the list page
                $state.go('listings.list', { successMessage: 'Listing succesfully updated!' });
              }, function(error) {
                //otherwise display the error
                $scope.error = 'Unable to update listing!\n' + error;
              });
    };

    $scope.remove = function(id) {
      /*
        Implement the remove function. If the removal is successful, navigate back to 'listing.list'. Otherwise, 
        display the error. 
       */
       Listings.delete(id).then(function(response) {
                //if the object is successfully deleted redirect back to the list page
                $state.go('listings.list', { successMessage: 'Listing succesfully deleted!' });
              }, function(error) {
                //otherwise display the error
                $scope.error = 'Unable to delete listing!\n' + error;
              });
    };

    //Creates a MapBox map with markers for each listing
    $scope.createMap = function() {

       /* set loader*/
        $scope.loading = true;

        /* Get all the listings, then bind it to the scope */
        Listings.getAll().then(function(response) {
          $scope.loading = false; //remove loader
          $scope.listings = response.data;    

          if(!mapboxgl) alert("oops!");

        mapboxgl.accessToken = 'pk.eyJ1IjoiYmhvbWVyIiwiYSI6ImNqbmRzYmNyZjA2em8za245dDFueDllbHoifQ.MtcTAOAiOWUoHyrfbcjeVQ';
          map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [-82.3645, 29.6301], //starting coordinates (g-ville) in [long, lat]
            zoom: 13 //starting zoom
        });

        // Add zoom and rotation controls to the map.
        map.addControl(new mapboxgl.NavigationControl());

        // Add geolocate control to the map.
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        }));


        //create a GeoJSON skeleton
        geojson = {
          type: 'FeatureCollection',
          features: []
        };

        
          $scope.listings.forEach(function(listing) {
            var newGeo = {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: listing.coordinates
              },
              properties:{
                name: listing.name,
                rating: "Rating: " + listing.rating + "/5"
              }
            };

            geojson.features.push(newGeo);
          });

        map.on('load', function(e) {
         map.addSource('locations', {
           type: 'geojson',
           data: geojson
         });
       })

       geojson.features.forEach(function(marker) {
         // Create a div element for the marker
         var el = document.createElement('div');
         // Add a class called 'marker' to each div
         el.className = 'marker';
         // By default the image for your custom marker will be anchored
         // by its center. Adjust the position accordingly
         // Create the custom markers, set their position, and add to map
         new mapboxgl.Marker(el, { offset: [0, -23] })
           .setLngLat(marker.geometry.coordinates)
           .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
           .setHTML('<h3>' + marker.properties.name + '</h3><p>' + marker.properties.rating + '</p>'))
           .addTo(map);
       });

        //makes the map available to the view
        module.exports = map; 

       }, function(error) {
        $scope.loading = false;
        $scope.error = 'Unable to retrieve listings!\n' + error;
      });
    }

    $scope.showDetails = function(e) {
      map.on('click', function(e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['locations'] });
        console.log(features);
        $scope.listings.forEach(function(listing) {
          if(geojson.features[0].geometry.coordinates == listing.coordinates) {
            document.getElementById("entryCrowdedness1").innerText = listing.crowdedness;
            document.getElementById("entryRating1").innerText = listing.rating;
            document.getElementById("entryAddress1").innerText = listing.address;
          }
        }); 
      });
    }

    /* Bind the success message to the scope if it exists as part of the current state */
    if($stateParams.successMessage) {
      $scope.success = $stateParams.successMessage;
    }
  }
]);
