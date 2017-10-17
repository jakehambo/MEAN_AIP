/*
User service file to:
- assign a json web token
- encrypt passwords
- connect to the mongodb database
- authenticate the user
- get a single user by id
- create a user
- update a user
- delete a user
*/

//global variables for libraries and db
var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');

//get the mongo db path, path is found in config file
var db = mongo.db(config.connectionString, {
  native_parser: true
});

//declare the db collection
db.bind('users');

//service schema to assign service fields to functions so it can be used in app
var service = {};

//assign the service fields to the functions
service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

/*
Authenticate the user by gathering the username and password and comparing
the password with the bcrypt algorithm
used in the login process
*/
function authenticate(username, password) {
    var deferred = Q.defer();

    //mongodb function to find a single entry in db collection
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

/*
Get the user based on id, used to get logged in user
*/
function getById(_id) {
    var deferred = Q.defer();

    //mongodb function to return a row based on object id
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

/*
Function to create a user, used in register
*/
function create(userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findOne(
        {
          username: userParam.username
        },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                //username already exists
                deferred.reject('Username "' + userParam.username
                + '" is already taken');
            } else {
              //compare the secret with the one that was inputted
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

        //add the user to the databse
        db.users.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

/*
Function to update, used when user has to update credentials
*/
function update(_id, userParam) {
    var deferred = Q.defer();

    //find user in mongodb based on id
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        //check to make sure the user doesnt update someone else
        if (user.username !== userParam.username) {
            db.users.findOne(
                {
                  username: userParam.username
                },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    //check if the username exists
                    if (user) {
                        //show message in form if username is taken
                        deferred.reject('Username "' + req.body.username
                        + '" is already taken')
                    } else {
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
        //add a schema to update the user fields in the databse
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
        };

        //hash the new password if the user enters the password
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        //update the user with mongo function the certain parameters based on id
        db.users.update(
            {
              _id: mongo.helper.toObjectID(_id)
            },
            {
              $set: set
            },

            //return an error if it could not be updated successfully
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

    //mongodb function to remove the user based on id
    db.users.remove(
        {
          _id: mongo.helper.toObjectID(_id)
        },

        //display an error if the user could not be deleted
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}
