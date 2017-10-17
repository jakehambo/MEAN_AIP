/*
User service file to:
- authenticate the user
- get a single user by id
*/

//Global variables for libraries and db
var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });

//Declare the db collection
db.bind('users');

//Service schema to assign service fields to functions so it can be used in app
var service = {};

//Assign the service fields to the functions
service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();

    db.users.findOne({
      username: username
    }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve(jwt.sign({
              sub: user._id
            }, config.secret));
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findOne(
        { username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
              if (userParam.type != 'user') {
                var hash = bcrypt.hashSync(userParam.secret, 10);
                if (bcrypt.compareSync(userParam.secret, hash)) {
                createUser();
              }
              else {
                deferred.reject('Secret does not match');
              }
              }
              else {
                  createUser();
              }
            }
        });

    function createUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);

        db.users.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== userParam.username) {
            db.users.findOne(
                {
                  username: userParam.username
                },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    //Check if the username exists
                    if (user) {
                        //Show message in form if username is taken
                        deferred.reject('Username "' + req.body.username
                        + '" is already taken')
                    } else {
                        //Update the user if
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    /*
    Function to handle the update section of the app where the user can
    update data such as firstname, lastname, username and password
    */
    function updateUser() {
        //Add a schema to update the user fields in the databse
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
        };

        //Hash the new password if the user enters the password
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        //Update the user with mongo function the certain parameters based on id
        db.users.update(
            {
              _id: mongo.helper.toObjectID(_id)
            },
            {
              $set: set
            },

            //Return an error if it could not be updated successfully
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

/*
Delete function so the user can remove their account
Takes the user id
*/
function _delete(_id) {
    var deferred = Q.defer();

    //Mongodb function to remove the user based on id
    db.users.remove(
        {
          _id: mongo.helper.toObjectID(_id)
        },

        //Display an error if the user could not be deleted
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}
