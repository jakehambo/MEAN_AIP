var mongoose = require('mongoose');

module.exports = mongoose.model('Movie', {
  title: String,
  release_date: String,
  duration: String,
  genre: String,
  synopsis: String
});
