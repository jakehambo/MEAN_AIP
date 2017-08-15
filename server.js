// MEAN Stack RESTful API Tutorial - Contact List App

var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('moviesaip', ['moviesaip']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/moviesaip', function (req, res) {
  console.log('I received a GET request');

  db.moviesaip.find(function (err, docs) {
    console.log(docs);
    res.json(docs);
  });
});

app.post('/moviesaip', function (req, res) {
  console.log(req.body);
  db.moviesaip.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/moviesaip/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  db.moviesaip.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

app.get('/moviesaip/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  db.moviesaip.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

app.put('/moviesaip/:id', function (req, res) {
  var id = req.params.id;
  console.log(req.body.title);
  db.moviesaip.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: {title: req.body.title, releasedate: req.body.releasedate, duration: req.body.duration, genre: req.body.genre, synopsis: req.body.synopsis}},
    new: true}, function (err, doc) {
      res.json(doc);
    }
  );
});

app.listen(3000);
console.log("Server running on port 3000");
