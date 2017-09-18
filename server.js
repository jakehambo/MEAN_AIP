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
  db.walksaip.find(function (err, docs) {
    res.json(docs);
  });
});

//REST METHOD function called POST to add the data in the database
app.post('/walksaip', function (req, res) {
  db.walksaip.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.post('/users', function (req, res) {
  db.walksaip.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

//REST METHOD function to delete the entry in the database
app.delete('/walksaip/:id', function (req, res) {
  var id = req.params.id;
  db.walksaip.remove({
    _id: mongojs.ObjectId(id)
  },
  function (err, doc) {
    res.json(doc);
  });
});

//REST METHOD function to get a single entry of the data to be put in form
app.get('/walksaip/:id', function (req, res) {
  var id = req.params.id;
  db.walksaip.findOne({
    _id: mongojs.ObjectId(id)
  },
  function (err, doc) {
    res.json(doc);
  });
});

//REST METHOD function to search the database
app.get('/walksaip', function (req, res) {
  db.walksaip.find({
    name: req.query.name,
    location: req.query.location,
    difficulty: req.query.difficulty,
    tips: req.query.tips,
    description: req.query.description
  },
  function (err, doc) {
    res.json(doc);
  });
});

//REST METHOD function to update a field in the database when user clicks edit
app.put('/walksaip/:id', function (req, res) {
  var id = req.params.id;
  db.walksaip.findAndModify({
    query: {
      _id: mongojs.ObjectId(id)
    },
    update: {
      $set: {
        name: req.body.name,
        location: req.body.location,
        difficulty: req.body.difficulty,
        tips: req.body.tips,
        description: req.body.description
      }},
    new: true
  },
  function (err, doc) {
    res.json(doc);
  });
});

//Server message when it is running and the port number
var port = 8000; //port number
app.listen(port);
console.log("Server running on port " + port);
