/**
 * Created by suraj on 20/02/16.
 */

(function (module) {
    'use strict';
    var CONFIG      = require('../config/common.json');
    var MongoClient = require('mongodb').MongoClient;

    var _getMongoURL = function () {
        return 'mongodb://' + CONFIG.MONGODB.host + ':' + CONFIG.MONGODB.port + '/inmobi';

    };

    module.exports = {
        updateOrInsertAmbulanceLocation: function (ambulanceId, data, callback) {

            var location = data.location;

            if (location.length < 2) {
                console.log('resetting the location');
                location = [data.source, data.destination];
            }

            console.log('trying to connect to mongo');
            MongoClient.connect(_getMongoURL(), function (err, db) {
                if (err) {
                    return callback(err);
                }

                var collection = db.collection('ambulances');
                var doc        = {
                    source     : {
                        type       : "Point",
                        coordinates: data.source
                    },
                    destination: {
                        type       : "Point",
                        coordinates: data.destination
                    },
                    location   : {
                        type       : "LineString",
                        coordinates: location
                    }
                };

                console.log('tring to insert');
                collection.update({_id: ambulanceId}, doc, {upsert: true}, function (error, result) {
                    db.close();
                    callback(error);
                });
            });

        },
        getNearByUsers                 : function (location, callback) {
            console.log('location', location);
            MongoClient.connect(_getMongoURL(), function (err, db) {
                if (err) {
                    return callback(err);
                }

                var collection = db.collection('users');
                var query      = {
                    location: {
                        '$near': {
                            '$geometry'   : {
                                type       : "Point",
                                coordinates: location
                            },
                            '$maxDistance': 1000 // in meters
                        }
                    }
                };

                var projection = {
                    _id     : 1,
                    location: 1
                };

                console.log('getNearByUsers')
                collection.find(query, projection).toArray(function (error, result) {
                    db.close();
                    console.log('special find getNearByUsers', result)
                    if (error) {
                        return callback(error);
                    }

                    callback(null, result);
                });
            });
        },
        isUserNearAmbulance            : function (ambulanceId, userLocation, callback) {
            MongoClient.connect(_getMongoURL(), function (err, db) {
                if (err) {
                    return callback(err);
                }

                var collection = db.collection('ambulances');
                var query      = {
                    location: {
                        '$near': {
                            '$geometry'   : {
                                type       : "Point",
                                coordinates: userLocation
                            },
                            '$maxDistance': 10 // in meters
                        }
                    }
                };

                var projection = {
                    _id: 1
                };

                collection.find(query, projection).toArray(function (err, data) {
                    db.close();

                    if (err) {
                        console.log('ERR:isUserNearAmbulance', err);
                        return callback(false);
                    }

                    console.log('ambulanceId', ambulanceId, 'userLoc', userLocation);
                    callback(data.length > 0);
                });

            });
        },
        insertUsersForAlerting         : function (ambulanceId, users, callback) {
            MongoClient.connect(_getMongoURL(), function (err, db) {
                if (err) {
                    return callback(err);
                }

                var collection = db.collection('alerts');
                var doc        = {
                    users: users
                };

                collection.update({_id: ambulanceId}, doc, {upsert: true}, function (error, result) {
                    db.close();
                    callback(error);
                });
            });
        },
        saveOrUpdateUserLocation       : function (data, callback) {
            MongoClient.connect(_getMongoURL(), function (err, db) {
                if (err) {
                    return callback(err);
                }

                var collection = db.collection('users');
                var query      = {
                    location: {
                        type       : "Point",
                        coordinates: data.location
                    }
                };

                collection.update({_id: data.user_id}, query, {upsert: true}, function (err, results) {
                    db.close();
                    if (err) {
                        return callback(err);
                    }
                    console.log('result obtained after adding user:');
                    callback(null);
                });

            });
        },
        checkforNotification           : function (user_id, callback) {
            MongoClient.connect(_getMongoURL(), function (err, db) {
                if (err) {
                    return callback(err);
                }
                var collection = db.collection('alerts');
                var query      = {
                    users: {
                        '$in': [user_id]
                    }
                };

                var projection = {
                    _id: 1
                };

                collection.find(query, projection).toArray(function (error, results) {
                    db.close();
                    if (error) {
                        return callback(error, null);
                    }

                    console.log('checkforNotification', results);
                    callback(null, results);
                });

            });
        },
        getAmbulanceInfo               : function (ambulanceId, callback) {
            MongoClient.connect(_getMongoURL(), function (err, db) {
                if (err) {
                    return callback(err);
                }
                var collection = db.collection('ambulances');
                var query      = {
                    _id: ambulanceId
                };

                var projection = {
                    _id   : 1,
                    source: 1
                };

                collection.find(query, projection).toArray(function (error, results) {
                    db.close();
                    if (error) {
                        return callback(error, null);
                    }

                    callback(null, results);
                });

            });

        }
    }

})(module);