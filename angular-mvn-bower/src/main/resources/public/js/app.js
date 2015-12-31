
var xAuthTokenHeaderName = 'x-auth-token';

var exampleApp = angular.module('exampleApp', ['ngRoute', 'ngCookies', 'exampleApp.services','ngTable','angular-growl']);

exampleApp.config([ '$routeProvider', '$locationProvider', '$httpProvider','growlProvider', function($routeProvider, $locationProvider, $httpProvider, growlProvider) {

	growlProvider.globalTimeToLive(6000);
	
			$routeProvider.when('/create', {
				templateUrl: 'partials/create.html',
				controller: CreateController,
				activeNav: 'news'
			});

			$routeProvider.when('/edit/:id', {
				templateUrl: 'partials/edit.html',
				controller: EditController,
				activeNav: 'news'
			});

			$routeProvider.when('/login', {
				templateUrl: 'partials/login.html',
				controller: LoginController
			});
			
			$routeProvider.when('/personas', {
				templateUrl: 'partials/personas.html',
				controller: PersonasController,
				activeNav: 'personas'
			});
			
			
			$routeProvider.when('/createPersona', {
				templateUrl: 'partials/createPersona.html',
				controller: CreatePersonaController,
				activeNav: 'personas'
			});

			$routeProvider.otherwise({
				templateUrl: 'partials/index.html',
				controller: IndexController
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
		   // $httpProvider.responseInterceptors.push(interceptor);

		} ]

	);

exampleApp.run(function($rootScope, $http, $location, $cookieStore, LoginService, $log) {

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
		
		$http.get('angular.properties').then(function (response) {		
	        console.log('TestString is ', response.data.TestString);
	        console.log('BooleanValue is ', response.data.BooleanValue);
	      });

	});


function IndexController($scope, NewsService, NgTableParams, growl) {

	//$scope.simpleList = [{name: "Moroni", age: 50,money:11} ];
	$scope.data = NewsService.query();

	$scope.cols = [
	               { field: "id", title: "id", sortable: "id", show: true },
	               { field: "content", title: "content", sortable: "content", show: true } 
	             ];
	           
	$scope.tableParams = new NgTableParams({
	             // initial sort order
	             sorting: { age: "desc" } 
	           }, {
	             dataset: $scope.data
	           });
	
	
	
	$scope.newsEntries = NewsService.query();

	$scope.deleteEntry = function(newsEntry) {
		newsEntry.$remove(function() {
			$scope.newsEntries = NewsService.query();
		});
	};
	
	$scope.init = function () {
		growl.success("Accediendo a index ");
	}
	$scope.init();
	
}


function EditController($scope, $routeParams, $location, NewsService, $resource) {

	$scope.newsEntry = $resource('news/:id', 
			{
				id: '@id'
			})
			.get(
			{
				id: $routeParams.id
			});

	$scope.save = function() {
		$scope.newsEntry.$save(function() {
			$location.path('/');
		});
	};
}




function CreateController($scope, $location, NewsService) {

	$scope.newsEntry = new NewsService();

	$scope.save = function() {
		$scope.newsEntry.$save(function() {
			$location.path('/');
		});
	};
}



function LoginController($scope, $rootScope, $location, $http, $cookieStore, LoginService) {

	$scope.login = function() {
		LoginService.authenticate($.param({username: $scope.username, password: $scope.password}), function(user) {
			$rootScope.user = user;
			$http.defaults.headers.common[ xAuthTokenHeaderName ] = user.token;
			$cookieStore.put('user', user);
			$location.path("/");
		});
	};
}



function CreatePersonaController($scope, $location, PersonaService, TipoPersonaService) {
	
	$scope.tiposPersona = TipoPersonaService.query();
	
	$scope.persona = new PersonaService();
	
	
	
	$scope.save = function () {
		
		if ( $scope.persona.tipoPersona  === undefined || $scope.persona.tipoPersona === "" || $scope.persona.nombre  === undefined) {
			return;
		}
		
		$scope.persona.$save(function() {
			$location.path('/personas');
		});
	}
	
}

function PersonasController($scope, PersonaService) {
	
	$scope.personas = PersonaService.query();

	$scope.deleteEntry = function(persona) {
		persona.$remove(function() {
			$scope.personas = PersonaService.query();
		});
	};
}

var services = angular.module('exampleApp.services', ['ngResource']);

services.factory('LoginService', function($resource) {

	return $resource(':action', {},
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

	return $resource('news/:id', {id: '@id'});
});

services.factory('PersonaService', function($resource) {

	return $resource('personas/:id', {id: '@id'});
});

services.factory('TipoPersonaService', function($resource) {

	return $resource('tipoPersona/:id', {id: '@id'});
});

