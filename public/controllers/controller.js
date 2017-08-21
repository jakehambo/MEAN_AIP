var myBushWalkApp = angular.module('myBushWalkApp', []);
myBushWalkApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Controller started...");

//Refresh the table
var refresh = function() {
  $http.get('/walksaip').success(function(response) {
    console.log("Refreshed");
    $scope.walksaip = response;
    $scope.walk = "";
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
       .title('Updated walk')
       .textContent('You can specify some description text in here.')
       .ariaLabel('walk Recommendation')
       .ok('Okay')
       .targetEvent(ev)
   );
 };

//Add the walk
$scope.addwalk = function() {
  console.log($scope.walk);
  $http.post('/walksaip', $scope.walk).success(function(response) {
    console.log(response);
    refresh();
  });
};

//Remove the walk
$scope.remove = function(id) {
  console.log(id);
  $http.delete('/walksaip/' + id).success(function(response) {
    refresh();
  });
};

//Get the info when clicked edit
$scope.edit = function(id) {
  console.log(id);
  $http.get('/walksaip/' + id).success(function(response) {
    $scope.walk = response;
  });
};

//Update entries
$scope.update = function() {
  console.log($scope.walk._id);
  $http.put('/walksaip/' + $scope.walk._id, $scope.walk).success(function(response) {
    refresh();
  })
};

//Make empty fields
$scope.deselect = function() {
  $scope.walk = "";
}

}]);﻿
