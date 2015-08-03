
msmApp.register.controller('EditController', 	function EditController($scope, $location, NewsService, $routeParams, $http, $cookieStore) {


	$scope.getNewsEntrie = function($routeParams) {
		
		var user = $cookieStore.get('user');
	
		
		$http.defaults.headers.common[ 'x-auth-token' ] = user.token;
		$cookieStore.put('user', user);
		
	
		$http({
	        method: 'GET',
	        url: 'http://localhost:8080/news/'+$routeParams.id,
	        
	        headers: {
	            'x-auth-token': user.token
	        }
	    }).success(function(data, status, headers, config) {
	    	$scope.newsEntry = data;
	    	
	    	console.info("data: " + data);
	    	
	    }).error(function(data, status, headers, config) {
	        if (status === 400) {
	            defered.reject(data);
	        } else {
	            throw new Error("Fallo obtener los datos:" + status + "\n" + data);
	        }
	    });
    }
	$scope.getNewsEntrie($routeParams);
	
	
	$scope.save = function() {
		$scope.newsEntry.$save(function() {
			$location.path('/');
		});
	};
	
});
