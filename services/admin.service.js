var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
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

    db.admin.findOne({ username: username }, function (err, admin) {
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

function create(userParam) {
    var deferred = Q.defer();
    var adminName = 'admin';

    // validation
    db.admins.findOne(
        { username: adminName },
        function (err, admin) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (admin) {
                // username already exists
                deferred.reject('Username "' + adminName + '" is already taken');
            } else {
                createUser();
            }
        });

    function createUser() {
        // set admin object to userParam without the cleartext password
        var admin = _.omit(userParam, 'password');
        var password = 'admin';
        // add hashed password to admin object
        admin.hash = bcrypt.hashSync(password, 10);

        db.admins.insert(
            admin,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}
