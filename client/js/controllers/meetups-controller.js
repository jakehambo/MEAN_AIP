app.controller('meetupsController', ['$scope', '$resource', function ($scope, $resource) {
  var Movie = $resource('/api/movies');

  Movie.query(function (results) {
    $scope.movies = results;
  });

  $scope.movies = []

  $scope.createMeetup = function () {
    var movie = new Movie();
    movie.title = $scope.meetupName;
    movie.$save(function (result) {
      $scope.movies.push(result);
      $scope.meetupName = '';
    });
  }
}]);
