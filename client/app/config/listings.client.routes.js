angular.module('listings').config(['$stateProvider', '$urlRouterProvider', 
  function($stateProvider) {
    //Listings state providing
    $stateProvider
      .state('listings.splash', {
        url: '',
        templateUrl: 'app/views/splash.client.view.html'
      })
      .state('listings', {
        url: '/listings', 
        abstract: true, 
        template: '<ui-view/>'
      })
      .state('listings.list', {
        url: '/list', 
        templateUrl: 'app/views/list-listings.client.view.html', 
        params: {
          successMessage: null
        }
      })
      .state('listings.create', {
        url: '/create', 
        templateUrl: 'app/views/create-listing.client.view.html'
      })
      .state('listings.map', {
        url: '/map', 
        templateUrl: 'app/views/map-listings.client.view.html'
      })
      .state('listings.edit', {
        url: '/edit/:listingId', 
        templateUrl: 'app/views/edit-listing.client.view.html'
      })
      .state('listings.geojson', {
        url: '/geojson', 
        templateUrl: 'app/views/geojson.client.view.html'
      })
      .state('listings.view', {
        url: '/:listingId', 
        templateUrl: 'app/views/view-listing.client.view.html'
      })
      .state('listings.theater', {
        url: '/listings/:theaterName',
        templateUrl: 'app/views/theater-listings.client.view.html'
      })


      /*
        Create a state for editing an individual listing, and another for the map view. 
       */
  } 
]);
angular.module('listings').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider) {
        //Listings state providing
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/views/login-listing.client.view.html'
            })

        /*
          Create a state for editing an individual listing, and another for the map view.
         */
    }
]);
