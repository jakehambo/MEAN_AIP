var config = require('config.json');
var express = require('express');
var router = express.Router();
var adminService = require('services/admin.service');

// routes
router.post('/authenticate', authenticateUser);
router.get('/current', getCurrentUser);

module.exports = router;

function authenticateUser(req, res) {
    adminService.authenticate(req.body.username, req.body.password)
        .then(function (token) {
            if (token) {
                // authentication successful
                res.send({ token: token });
            } else {
                // authentication failed
                res.status(401).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentUser(req, res) {
    adminService.getById(req.admin.sub)
        .then(function (admin) {
            if (admin) {
                res.send(admin);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
