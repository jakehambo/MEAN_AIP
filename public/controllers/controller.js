var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Controller started...");

//Refresh the table
var refresh = function() {
  $http.get('/moviesaip').success(function(response) {
    console.log("Refreshed");
    $scope.moviesaip = response;
    $scope.movie = "";
  });
};

refresh();

$scope.open = function () {
  console.log('opening pop up');
  var modalInstance = $modal.open({
    templateUrl: 'popup.html',
  });
};

//Attempted to show alert
$scope.showAlert = function(ev) {
   $mdDialog.show(
     $mdDialog.alert()
       .parent(angular.element(document.querySelector('#popupContainer')))
       .clickOutsideToClose(true)
       .title('Updated Movie')
       .textContent('You can specify some description text in here.')
       .ariaLabel('Movie Recommendation')
       .ok('Okay')
       .targetEvent(ev)
   );
 };

//Add the movie
$scope.addMovie = function() {
  console.log($scope.movie);
  $http.post('/moviesaip', $scope.movie).success(function(response) {
    console.log(response);
    refresh();
  });
};

//Remove the movie
$scope.remove = function(id) {
  console.log(id);
  $http.delete('/moviesaip/' + id).success(function(response) {
    refresh();
  });
};

//Get the info when clicked edit
$scope.edit = function(id) {
  console.log(id);
  $http.get('/moviesaip/' + id).success(function(response) {
    $scope.movie = response;
  });
};

//Update entries
$scope.update = function() {
  console.log($scope.movie._id);
  $http.put('/moviesaip/' + $scope.movie._id, $scope.movie).success(function(response) {
    refresh();
  })
};

//Make empty fields
$scope.deselect = function() {
  $scope.movie = "";
}

}]);﻿
