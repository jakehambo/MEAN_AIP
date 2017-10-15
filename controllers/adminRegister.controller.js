var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

router.get('/', function (req, res) {
    res.render('adminRegister');
});

router.post('/', function (req, res) {
    // register using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/admins/register',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('adminRegister', { error: 'An error occurred' });
        }

        if (response.statusCode !== 200) {
            return res.render('adminRegister', {
                error: response.body,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username
            });
        }

        // return to login page with success message
        req.session.success = 'Registration successful';
        return res.redirect('/adminLogin');
    });
});

module.exports = router;
