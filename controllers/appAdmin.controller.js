
var express = require('express');
var router = express.Router();

// use session auth to secure the angular app files
router.use('/', function (req, res, next) {
    if (req.path !== '/adminLogin' && !req.session.token) {
        return res.redirect('/adminLogin?returnUrl=' + encodeURIComponent('/' + req.path));
    }
    next();
});

// make JWT token available to angular app
router.get('/token', function (req, res) {
    res.send(req.session.token);
});

// serve angular app files from the '/app' route
router.use('/', express.static('appAdmin'));

module.exports = router;
