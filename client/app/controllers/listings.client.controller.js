angular.module('listings').controller('ListingsController', ['$scope', '$location', '$stateParams', '$state', 'Listings','firebase',
    function($scope, $location, $stateParams, $state, Listings,firebase){
        var map, geojson;


        var txtEmail=angular.element( document.getElementById("login_email_input"));
        var txtPassword=angular.element( document.getElementById("login_password_input"));

        var newEmail=angular.element( document.getElementById("sign_up_email_input"));
        var newPassword=angular.element( document.getElementById("sign_up_password_input"));

        var login_button=angular.element( document.getElementById("login_button"));
        var logout_button=angular.element( document.getElementById("logout_button"));

        // var login_btn=document.getElementById("login_btn");
        // var new_usr_btn=document.getElementById("new_usr_btn");

        $scope.find = function() {
            /* set loader*/
            console.log('line number' + 6 +"\n");
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
            // debugger;
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

                    //this block pre-fills the update form
                    $scope.name = $scope.listing.name;
                    $scope.rating = $scope.listing.rating;
                    $scope.address = $scope.listing.address;
                    $scope.crowdedness = $scope.listing.crowdedness;
                    $scope.data.rooms = $scope.listing.rooms;
                    $scope.data.movies = $scope.listing.movies;
                    //^

                    $scope.loading = false;
                }, function(error) {
                    $scope.error = 'Unable to retrieve listing with id "' + id + '"\n' + error;
                    $scope.loading = false;
                });
        };

        // $scope.getTheater = function() {
        //     // debugger;
        //     $scope.loading = true;
        //     var theaterName = $stateParams.theaterName;
        //     var id;
        //     console.log(theaterName);
        //
        //     Listings.forEach(function(listing) {
        //         if (listing.name == theaterName) {
        //             id = listing._id;
        //         }
        //     });
        //
        //     Listings.read(id).then(function(response) {
        //         $scope.listing = response.data;
        //
        //         $scope.name = $scope.listing.name;
        //         $scope.rating = $scope.listing.rating;
        //         $scope.address = $scope.listing.address;
        //         $scope.crowdedness = $scope.listing.crowdedness;
        //         $scope.data.rooms = $scope.listing.rooms;
        //         $scope.data.movies = $scope.listing.movies;
        //
        //         $scope.loading = false;
        //     }, function(error) {
        //         $scope.error = 'Unable to retrieve listing with id "' + id + '"\n' + error;
        //         $scope.loading = false;
        //     });
        //
        // };

        $scope.create = function(isValid) {
            $scope.error = null;

            /*
              Check that the form is valid. (https://github.com/paulyoder/angular-bootstrap-show-errors)
             */
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'articleForm');

                return false;
            }
console.log('line number' + 96 +"\n");
            /* Create the listing object */
            var listing = {
                name: $scope.name,
                rating: $scope.rating,
                address: $scope.address,
                crowdedness: $scope.crowdedness,
                rooms: [{
                    number: $scope.data.rooms[0].number,
                    capacity: $scope.data.rooms[0].capacity
                }],
                movies: [{
                    title: $scope.data.movies[0].title,
                    description: $scope.data.movies[0].description,
                    showings: $scope.data.movies[0].showings
                }]
            };

            //adds all extra rooms to the theater
            for (var i = 1; i < $scope.data.rooms.length; i++)
            {
                var room = {
                    number: $scope.data.rooms[i].number,
                    capacity: $scope.data.rooms[i].capacity
                };
                listing.rooms.push(room);
            }

            //adds all movies to the theater
            for (var i = 1; i < $scope.data.movies.length; i++)
            {
                var movie = $scope.data.movies[i];
                listing.movies.push(movie);
            }

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
            console.log('line number' + 149 +"\n");

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
        $scope.login=function(){
            // firebase.initializeApp(config);

            const email = txtEmail.value;
            const password = txtPassword.value;
            login_button.display="none";
            logout_button.display="inline";

            // const auth=firebase.auth();
            // auth.signInWithEmailAndPassword(email, password).then(function(){
            //     // this runs if the promise is returned successfully
            //
            //
            //     console.log("Login Successful, redirecting to Index");
            //     window.location.href = "../../index.html";
            // }).catch(e =>console.log(e.message) );
            // TODO: return username to replace the login button
        };
        $scope.signup=function(){
            // firebase.initializeApp(config);
            login_button.display="none";
            logout_button.display="inline";
            // const email = newEmail.value;
            //   const password = newPassword.value;
            //   const auth=firebase.auth();
            //    auth.createUserWithEmailAndPassword(email, password).then(function(){
            //
            //     console.log("New User Creation Successful, redirecting to Index");
            //     window.location.href = "../../index.html";
            //
            //    }).catch(e =>console.log(e.message) );
        };
        //Creates a MapBox map with markers for each listing
        $scope.createMap = function() {
console.log('line number' + 198 +"\n");
            /* set loader*/
            $scope.loading = true;
            // alert("hey1");
            
            /* Get all the listings, then bind it to the scope */
            Listings.getAll().then(function(response) {
                $scope.loading = false; //remove loader
                $scope.listings = response.data;
    console.log('line number' + 205 +"\n");
                // mapboxgl.accessToken = 'pk.eyJ1IjoiYmhvbWVyIiwiYSI6ImNqbmRzYmNyZjA2em8za245dDFueDllbHoifQ.MtcTAOAiOWUoHyrfbcjeVQ';
                // map = new mapboxgl.Map({
                //     container: 'map',
                //     style: 'mapbox://styles/mapbox/streets-v9',
                //     center: [-82.3645, 29.6301], //starting coordinates (g-ville) in [long, lat]
                //     zoom: 13 //starting zoom
                // });
                var JavaScript = {
                    load: function(src, callback) {
                        var script = document.createElement('script'),
                            loaded;
                        script.setAttribute('src', src);
                        if (callback) {
                            script.onreadystatechange = script.onload = function() {
                                if (!loaded) {
                                    callback();
                                }
                                loaded = true;
                            };
                        }
                        document.getElementsByTagName('head')[0].appendChild(script);
                    }
                };
                JavaScript.load("https://api.mapbox.com/mapbox-gl-js/v0.39.1/mapbox-gl.js", function() {
                    mapboxgl.accessToken = 'pk.eyJ1IjoiYmhvbWVyIiwiYSI6ImNqbmRzYmNyZjA2em8za245dDFueDllbHoifQ.MtcTAOAiOWUoHyrfbcjeVQ';
                    map = new mapboxgl.Map({
                        container: 'map',
                        style: 'mapbox://styles/mapbox/streets-v9',
                        center: [-82.3645, 29.6301], //starting coordinates (g-ville) in [long, lat]
                        zoom: 13 //starting zoom
                    });
                    if(!mapboxgl) alert("oops!");

                    // Add zoom and rotation controls to the map.
                    map.addControl(new mapboxgl.NavigationControl());

                    // Add geolocate control to the map.
                    map.addControl(new mapboxgl.GeolocateControl({
                        positionOptions: {
                            enableHighAccuracy: true
                        },
                        trackUserLocation: true
                    }));
                    map.on('click', function(e) {
                        var features = e.lngLat;

                        var lat = Math.round(features.lat * 100000) / 100000;
                        var long = Math.round(features.lng * 100000) / 100000;

                        $scope.listings.forEach(function(listing) {
                            console.log(listing.coordinates);
                            if(listing.coordinates[0] < (long + .002) && listing.coordinates[0] > (long - .002)) {
                                if(listing.coordinates[1] < (lat + .002) && listing.coordinates[1] > (lat - .002)) {
                                    document.getElementById("entryName1").innerText = listing.name;
                                    document.getElementById("entryCrowdedness1").innerText = listing.crowdedness;
                                    document.getElementById("entryRating1").innerText = listing.rating;
                                    document.getElementById("entryAddress1").innerText = listing.address;
                                    $scope.entryID1 = listing._id;
                                }
                            }
                        });
                    });

                    //create a GeoJSON skeleton
                    geojson = {
                        type: 'FeatureCollection',
                        features: []
                    };

                    /* PLaces the current theaters as map markers */
                    $scope.listings.forEach(function(listing) {
                        var newGeo = {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: listing.coordinates
                            },
                            properties:{
                                name: listing.name,
                                rating: listing.rating
                            }
                        };

                        geojson.features.push(newGeo);
                    });
                    // place the markers
                    map.on('load', function(e) {
                        map.addSource('locations', {
                            type: 'geojson',
                            data: geojson
                        });
                    });

                    geojson.features.forEach(function(marker) {
                        // Create a div element for the marker
                        var el = document.createElement('div');
                        // Add a class called 'marker' to each div
                        el.className = 'marker';

                        //determines which icon to use
                        var rating = marker.properties.rating;

                        if(rating < 40){
                            el.title = "notcrowdy";
                        }
                        else if (rating < 70){
                            el.title = "kindacrowdy";
                        }
                        else{
                            el.title = "crowdy";
                        }


                        // By default the image for your custom marker will be anchored
                        // by its center. Adjust the position accordingly
                        // Create the custom markers, set their position, and add to map
                        new mapboxgl.Marker(el, { offset: [0, -23] })
                            .setLngLat(marker.geometry.coordinates)
                            .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                                .setHTML('<h3 style="font-family: phosphate;">' + marker.properties.name + '</h3><p style="text-align: center; font-size: 16px;"> Crowdedness: ' + marker.properties.rating + '%</p>'))
                            .addTo(map);
                    });

                });



                //makes the map available to the view
                // module.exports = map;

            }, function(error) {
                $scope.loading = false;
                $scope.error = 'Unable to retrieve listings!\n' + error;
            });
        }
        // var possible_coordinate_set=[];
        // $scope.showDetails = function(e) {
        //     map.on('click', function(e) {
        //         var features = e.lngLat;
        //
        //         var lat = Math.round(features.lat * 100000) / 100000;
        //         var long = Math.round(features.lng * 100000) / 100000;
        //
        //         $scope.listings.forEach(function(listing) {
        //             console.log(listing.coordinates);
        //             if(listing.coordinates[0] < (long + .002) && listing.coordinates[0] > (long - .002)) {
        //                 if(listing.coordinates[1] < (lat + .002) && listing.coordinates[1] > (lat - .002)) {
        //                     document.getElementById("entryName1").innerText = listing.name;
        //                     document.getElementById("entryCrowdedness1").innerText = listing.crowdedness;
        //                     document.getElementById("entryRating1").innerText = listing.rating;
        //                     document.getElementById("entryAddress1").innerText = listing.address;
        //                 }
        //             }
        //         });
        //     });
        // }

        //initializes room and movie array
        $scope.data ={
            rooms:[{ number:0, capacity: 0}],
            movies:[{
                title:"",
                description:"",
                showings: [{
                    form: "",
                    room: 0,
                    time: "",
                    tickets_bought: 0
                }]
            }]
        };

        //used in create-listing to add another room
        $scope.addRow = function(index){
            var room = { number:0, capacity: 0};
            if($scope.data.rooms.length <= index+1){
                $scope.data.rooms.splice(index+1,0,room);
            }
        };

        //used in create-listing to delete a room
        $scope.deleteRow = function($event,number){
            var index = $scope.data.rooms.indexOf(number);
            if($event.which == 1)
                $scope.data.rooms.splice(index,1);
        };


        //used in create-listing to add another room
        $scope.addMovie = function(index){
            var movie = {
                title:"",
                description:"",
                showings: [{
                    form: "",
                    room: 0,
                    time: "",
                    tickets_bought: 0
                }]
            };

            if($scope.data.movies.length <= index+1){
                $scope.data.movies.splice(index+1,0,movie);
            }
        };

        //used in create-listing to delete a room
        $scope.deleteMovie = function($event,title){
            var index = $scope.data.movies.indexOf(title);
            if($event.which == 1)
                $scope.data.movies.splice(index,1);
        };

        /* Bind the success message to the scope if it exists as part of the current state */
        if($stateParams.successMessage) {
            $scope.success = $stateParams.successMessage;
        }
    }
]);
