/*
Controller file to:
- Manage the application
  - Calls CRUD functions and updates the table
*/
var myBushWalkApp = angular.module('myBushWalkApp', []);

//The main controller function
myBushWalkApp.controller('AppCtrl', ['$scope', '$http',
function ($scope, $http) {

  //Refresh the table
  var refresh = function () {
    $http.get('/walksaip')
    .success(function (response) {
      $scope.walksaip = response;
      $scope.walk = ""; //set fields as no value
    });
  };

  refresh(); //refresh the fields

  //Open the correct html file for the view on the server
  $scope.open = function () {
    var modalInstance = $modal.open({
      templateUrl: 'popup.html',
    });
  };

  //Add the walk
  $scope.addWalk = function () {
    $http.post('/walksaip', $scope.walk)
    .success(function (response) {
      refresh();
      alert('Walk ' + $scope.walk.name + ' has been added');
    }).error(function(error){
      alert('Walk ' + $scope.walk.name + ' could not be added');
    });
  };

  //Remove the walk, using
  $scope.remove = function (id) {
    $http.delete('/walksaip/' + id)
    .success(function (response) {
      refresh();
      alert('Successfully removed ' + $scope.walk.name);
    }).error(function(error){
      alert('Walk ' + $scope.walk.name + ' could not be removed');
    });
  };

  //Get the info when clicked edit, using get rest method
  $scope.edit = function (id) {
    $http.get('/walksaip/' + id)
    .success(function (response) {
      $scope.walk = response;
    });
  };

  //Update entries, calling the put function
  $scope.update = function () {
    $http.put('/walksaip/' + $scope.walk._id, $scope.walk)
    .success(function (response) {
      refresh();
      alert('Successfully updated ' + $scope.walk.name);
    }).error(function(error){
      alert('Walk ' + $scope.walk.name + ' could not be updated');
    });
  };

  //Make empty fields
  $scope.deselect = function () {
    $scope.walk = "";
  }


}]);﻿
