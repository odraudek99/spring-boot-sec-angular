
msmApp.register.controller('EditController', 	function EditController($scope, $location, NewsService, $routeParams, $http, $cookieStore, $resource) {

	
	$scope.newsEntry = NewsService.get({
				id: $routeParams.id
			});

	$scope.save = function() {
		$scope.newsEntry.$save(function() {
			$location.path('/');
		});
	};


	
});
