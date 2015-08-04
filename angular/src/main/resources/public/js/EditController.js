
msmApp.register.controller('EditController', 	function EditController($scope, $location, NewsService, $routeParams, $http, $cookieStore, $resource) {

	$scope.newsEntry = $resource('http://localhost:8080/news/:id', 
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


	
});
