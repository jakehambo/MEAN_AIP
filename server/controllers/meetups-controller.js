var Movie = require('../models/meetup');

module.exports.create = function (req, res) {
  var movie = new Movie(req.body);
  movie.save(function (err, result) {
    res.json(result);
  });
}

module.exports.list = function (req, res) {
  Movie.find({}, function (err, results) {
    res.json(results);
  });
}
