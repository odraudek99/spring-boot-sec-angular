


msmApp.register.controller('CreateController', 	function CreateController($scope, $location, NewsService) {

	
	$scope.newsEntry = new NewsService();

	$scope.save = function() {
		$scope.newsEntry.$save(function() {
			$location.path('/');
		});
	};

});

