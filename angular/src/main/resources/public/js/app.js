
var xAuthTokenHeaderName = 'x-auth-token';

var msmApp = angular.module('msmApp', ['ngRoute', 'ngCookies', 'msmApp.services']);

msmApp.config([ '$routeProvider', '$locationProvider', '$httpProvider','$controllerProvider', '$compileProvider', '$filterProvider', '$provide'
                , function($routeProvider, $locationProvider, $httpProvider,
		$controllerProvider, $compileProvider, $filterProvider, $provide) {

	msmApp.register = {
	        controller: $controllerProvider.register,
	        directive: $compileProvider.directive,
	        filter: $filterProvider.register,
	        factory: $provide.factory,
	        service: $provide.service
	    };
	
			$routeProvider.when('/create', {
				templateUrl: 'partials_1/create.html'
				//, controller: CreateController
			});

			$routeProvider.when('/edit/:id', {
				templateUrl: 'partials_1/edit.html'
				 //, controller: EditController
			});

			$routeProvider.when('/login', {
				templateUrl: 'partials_1/login.html'
				, controller: LoginController
			});

			$routeProvider.otherwise({
				templateUrl: 'partials_1/index.html'
				// , controller: IndexController
			});

			$locationProvider.hashPrefix('!');

			/* Intercept http errors */
			var interceptor = function ($rootScope, $q, $location) {

		        function success(response) {
		            return response;
		        }

		        function error(response) {

		            var status = response.status;
		            var config = response.config;
		            var method = config.method;
		            var url = config.url;

		            if (status == 401) {
		            	$location.path( "/login" );
		            } else {
		            	$rootScope.error = method + " on " + url + " failed with status " + status;
		            }

		            return $q.reject(response);
		        }

		        return function (promise) {
		            return promise.then(success, error);
		        };
		    };
		    $httpProvider.responseInterceptors.push(interceptor);
		} ]
	);

msmApp.run(function($rootScope, $http, $location, $cookieStore, LoginService) {

	/* Reset error when a new view is loaded */
	$rootScope.$on('$viewContentLoaded', function() {
		delete $rootScope.error;
	});

	$rootScope.hasRole = function(role) {

		if ($rootScope.user === undefined) {
			return false;
		}

		if ($rootScope.user.roles[role] === undefined) {
			return false;
		}

		return $rootScope.user.roles[role];
	};



	$rootScope.logout = function() {
		delete $rootScope.user;
		delete $http.defaults.headers.common[xAuthTokenHeaderName];
		$cookieStore.remove('user');
		$location.path("/login");
	};

	 /* Try getting valid user from cookie or go to login page */
	var originalPath = $location.path();
	
	$location.path("/login");
	var user = $cookieStore.get('user');
	
	
	if (user !== undefined) {
		$rootScope.user = user;
		$http.defaults.headers.common[xAuthTokenHeaderName] = user.token;

		$location.path(originalPath);
	}

});


function LoginController($scope, $rootScope, $location, $http, $cookieStore, LoginService) {

	$scope.login = function() {
		LoginService.authenticate($.param({username: $scope.username, password: $scope.password}), function(user) {
			$rootScope.user = user;
			$http.defaults.headers.common[ xAuthTokenHeaderName ] = user.token;
			$cookieStore.put('user', user);
			$location.path("/aa");
		});
	};
}

var services = angular.module('msmApp.services', ['ngResource']);

services.factory('LoginService', function($resource) {

	return $resource('http://localhost:8080/:action', {},
			{
				authenticate: {
					method: 'POST',
					params: {'action' : 'authenticate'},
					headers : {'Content-Type': 'application/x-www-form-urlencoded'}
				}
			}
		);
});

services.factory('NewsService', function($resource) {
	return $resource('http://localhost:8080/news/:id', {id: '@id'});
});

