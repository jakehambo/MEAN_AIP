var express           = require('express'),
    app               = express(),
    bodyParser        = require('body-parser'),
    mongoose          = require('mongoose'),
    meetupsController = require('./server/controllers/meetups-controller');

mongoose.connect('mongodb://localhost:27017/mean-demo');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/client/views/index.html');
});

app.use('/js', express.static(__dirname + '/client/js'));

//REST API
app.get('/api/movies', meetupsController.list);
app.post('/api/movies', meetupsController.create);

app.listen(3000, function() {
  console.log('I\'m Listening...');
})
