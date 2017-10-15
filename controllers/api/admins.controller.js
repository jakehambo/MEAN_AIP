var config = require('config.json');
var express = require('express');
var router = express.Router();
var adminService = require('services/admin.service');
var secret = "$2b$10$/3OqCt2shs.jf07yz6LRsO4MYkIggrBByC9W4qugQHK4fken0FSGK";

// routes
router.post('/authenticate', authenticateAdmin);
router.post('/register', registerAdmin);
router.get('/current', getCurrentAdmin);
router.put('/:_id', updateAdmin);
router.delete('/:_id', deleteAdmin);

module.exports = router;

function authenticateAdmin(req, res) {
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

function registerAdmin(req, res) {
    adminService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentAdmin(req, res) {
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

function updateAdmin(req, res) {
    var adminId = req.admin.sub;
    if (req.params._id !== adminId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }

    adminService.update(adminId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteAdmin(req, res) {
    var adminId = req.admin.sub;
    if (req.params._id !== adminId) {
        // can only delete own account
        return res.status(401).send('You can only delete your own account');
    }

    adminService.delete(adminId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
