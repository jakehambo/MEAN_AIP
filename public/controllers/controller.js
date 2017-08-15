var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from controller");


var refresh = function() {
  $http.get('/moviesaip').success(function(response) {
    console.log("I got the data I requested");
    $scope.moviesaip = response;
    $scope.movie = "";
  });
};

refresh();

$scope.addMovie = function() {
  console.log($scope.movie);
  $http.post('/moviesaip', $scope.movie).success(function(response) {
    console.log(response);
    refresh();
  });
};

$scope.remove = function(id) {
  console.log(id);
  $http.delete('/moviesaip/' + id).success(function(response) {
    refresh();
  });
};

$scope.edit = function(id) {
  console.log(id);
  $http.get('/moviesaip/' + id).success(function(response) {
    $scope.movie = response;
  });
};

$scope.update = function() {
  console.log($scope.movie._id);
  $http.put('/moviesaip/' + $scope.movie._id, $scope.movie).success(function(response) {
    refresh();
  })
};

$scope.deselect = function() {
  $scope.movie = "";
}

}]);﻿
