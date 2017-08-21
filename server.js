
//Variables to include express, mongo and to declare the mongo db name
var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('walksaip', ['walksaip']);
var bodyParser = require('body-parser');

//Showing where the views are
app.use(express.static(__dirname + '/public'));

//Including the json file for packages
app.use(bodyParser.json());

//REST METHOD function called get to call function in controller to display data
app.get('/walksaip', function (req, res) {
  console.log('GET request');
  db.walksaip.find(function (err, docs) {
    console.log(docs);
    res.json(docs);
  });
});

//REST METHOD function called POST to add the data in the database
app.post('/walksaip', function (req, res) {
  console.log(req.body);
  db.walksaip.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

//REST METHOD function to delete the entry in the database
app.delete('/walksaip/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  db.walksaip.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

//REST METHOD function to get a single entry of the data to be put in form
app.get('/walksaip/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  db.walksaip.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

//REST METHOD function to update a field in the database when user clicks edit
app.put('/walksaip/:id', function (req, res) {
  var id = req.params.id;
  console.log(req.body.title);
  db.walksaip.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: {title: req.body.title, releasedate: req.body.releasedate, duration: req.body.duration, genre: req.body.genre, synopsis: req.body.synopsis}},
    new: true}, function (err, doc) {
      res.json(doc);
    }
  );
});

//Server message when it is running and the port number
var port = 8000;
app.listen(port);
console.log("Server running on port "+port);
