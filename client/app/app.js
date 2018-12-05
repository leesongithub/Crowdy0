/* register the modules the application depends upon here*/

var config = {
    apiKey: "AIzaSyD3Z7koK5KJLv1V5HjB_keGFn6UaLOZ_TE",
    authDomain: "redtelephone-d8560.firebaseapp.com",
    databaseURL: "https://redtelephone-d8560.firebaseio.com",
    projectId: "redtelephone-d8560",
    storageBucket: "redtelephone-d8560.appspot.com",
    messagingSenderId: "863132904116"
};
firebase.initializeApp(config);
angular.module('listings', ['firebase']);

/* register the application and inject all the necessary dependencies */
var app = angular.module('directoryApp', ['ui.router', 'ui.bootstrap', 'uiGmapgoogle-maps', 'listings']);

/* application configuration */
app.config(['$urlRouterProvider', '$locationProvider',
  function($urlRouterProvider, $locationProvider) {
    /* https://docs.angularjs.org/api/ng/provider/$locationProvider */
    $locationProvider.html5Mode(true);

    /* go to the '/listings' URL if an invalid route is provided */
    $urlRouterProvider.otherwise('/listings');
  }
]);

/* set the initial state of the application */
app.run(['$state', 
  function($state) {
    $state.go('listings.list');
  }
]);

/*
<<<<<<< HEAD
=======

>>>>>>> 261717084359fa4704279c6a19a9b7d094a81093
*/