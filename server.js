require('rootpath')();
//Variables to include express, mongo and to declare the mongo db name
var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('walksaip', ['walksaip']);
var bodyParser = require('body-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));
// routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/adminRegister', require('./controllers/adminRegister.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});

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
