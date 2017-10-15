var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var secret = "$2b$10$/3OqCt2shs.jf07yz6LRsO4MYkIggrBByC9W4qugQHK4fken0FSGK";
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('admins');

var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();

    db.admins.findOne({ username: username }, function (err, admin) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (admin && bcrypt.compareSync(password, admin.hash)) {
            // authentication successful
            deferred.resolve(jwt.sign({ sub: admin._id }, config.secret));
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.admins.findById(_id, function (err, admin) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (admin) {
            // return admin (without hashed password)
            deferred.resolve(_.omit(admin, 'hash'));
        } else {
            // admin not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(adminParam) {
    var deferred = Q.defer();

    // validation
    db.admins.findOne(
        { username: adminParam.username },
        function (err, admin) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (admin) {
                // username already exists
                deferred.reject('Username "' + adminParam.username + '" is already taken');
            } else {
                createUser();
            }
        });

    function createUser() {
        // set admin object to adminParam without the cleartext password
        var admin = _.omit(adminParam, 'password');

        // add hashed password to admin object
        admin.hash = bcrypt.hashSync(adminParam.password, 10);

        db.admins.insert(
            admin,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, adminParam) {
    var deferred = Q.defer();

    // validation
    db.admins.findById(_id, function (err, admin) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (admin.username !== adminParam.username) {
            // username has changed so check if the new username is already taken
            db.admins.findOne(
                { username: adminParam.username },
                function (err, admin) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (admin) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: adminParam.firstName,
            lastName: adminParam.lastName,
            username: adminParam.username,
        };

        // update password if it was entered
        if (adminParam.password) {
            set.hash = bcrypt.hashSync(adminParam.password, 10);
        }

        db.admins.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.admins.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}
