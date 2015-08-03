

msmApp.register.controller('IndexController', 	function IndexController($scope, $location, NewsService,$rootScope, $resource,$http, $cookieStore) {

	
	$scope.getNewsEntries = function() {
		
		var persona = {};
		
		var user = $cookieStore.get('user');
		
		
		
		$http.defaults.headers.common[ 'x-auth-token' ] = user.token;
		$cookieStore.put('user', user);
		
	
		$http({
	        method: 'GET',
	        url: 'http://localhost:8080/news/',
	        headers: {
	            'x-auth-token': user.token
	        }
	    }).success(function(data, status, headers, config) {
	    	$scope.newsEntries = data;
	    	
	    	console.info("data: " + data);
	    	
	    }).error(function(data, status, headers, config) {
	        if (status === 400) {
	            defered.reject(data);
	        } else {
	            throw new Error("Fallo obtener los datos:" + status + "\n" + data);
	        }
	    });
		
		
    }
	$scope.getNewsEntries();
	
	
	$scope.deleteEntry = function(newsEntry) {
		
		$http.delete('http://localhost:8080/news/' + newsEntry.id)
        .success(function(data, status, headers, config) {

            console.log(data);
            $scope.newsEntries =  $scope.getNewsEntries();
        })
        .error(function(data, status, headers, config) {
            console.log('Error:' + data);
            if (status === 400) {
	            defered.reject(data);
	        } else {
	            throw new Error("Fallo obtener los datos:" + status + "\n" + data);
	        }
        });
		


	};

});




