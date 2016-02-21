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
        insertAmbulanceLocation : function (ambulanceId, data, callback) {

            var polyline = data.polyline;

            if (polyline.length < 2) {
                console.log('resetting the polyline');
                polyline = [data.source, data.destination];
            }

            MongoClient.connect(_getMongoURL(), function (err, db) {
                if (err) {
                    return callback(err);
                }

                var collection = db.collection('ambulance');
                var doc        = {
                    _id        : ambulanceId,
                    source     : {
                        type       : "Point",
                        coordinates: data.source
                    },
                    destination: {
                        type       : "Point",
                        coordinates: data.destination
                    },
                    polyline   : {
                        type       : "LineString",
                        coordinates: polyline
                    }
                };

                collection.insertOne(doc, function (error, result) {
                    db.close();
                    callback(error);
                });
            });

        },
        getNearByUsers          : function (location, callback) {
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
                collection.find(query, projection, function (error, result) {
                    db.close();

                    if (error) {
                        return callback(error);
                    }

                    callback(null, result);
                });
            });
        },
        isUserNearAmbulance     : function (ambulanceId, userLocation, callback) {
            MongoClient.connect(_getMongoURL(), function (err, db) {
                if (err) {
                    return callback(err);
                }

                var collection = db.collection('ambulance');
                var query      = {
                    polyline: {
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

                collection.find(query, projection, function (err, data) {
                    db.close();

                    if (err) {
                        console.log('ERR:isUserNearAmbulance', err);
                        return callback(false);
                    }

                    callback(data.length > 0);
                });

            });
        },
        insertUsersForAlerting  : function (ambulanceId, users, callback) {
            MongoClient.connect(_getMongoURL(), function (err, db) {
                if (err) {
                    return callback(err);
                }

                var collection = db.collection('alerts');
                var doc        = {
                    _id  : ambulanceId,
                    users: users
                };

                collection.insertOne(doc, function (error, result) {
                    db.close();
                    callback(error);
                });
            });
        },
        saveOrUpdateUserLocation: function (data, callback) {
            MongoClient.connect(_getMongoURL(), function (err, db) {
                if (err) {
                    return callback(err);
                }

                var collection = db.collection('users');
                var query      = {
                    _id   : data.user_id,
                    source: {
                        type       : "Point",
                        coordinates: data.source
                    }
                };

                var projection = {
                    upsert: true
                };

                collection.update(query, projection, function (err, results) {
                    db.close();
                    if (error) {
                        return callback(error);
                    }
                    console.log('result obtained after adding user:', results);
                    callback(null, results);
                });

            });
        },
        checkforNotification    : function (user_id, callback) {
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
                    _id           : 1,
                    vehicle_number: 1
                };

                collection.find(query, projection, function (error, results) {
                    db.close();
                    if (error) {
                        callback(error, null);
                    }

                    callback(null, results);
                });

            });
        },
        getAmbulanceInfo        : function (ambulanceId, callback) {
            MongoClient.connect(_getMongoURL(), function (err, db) {
                if (err) {
                    return callback(err);
                }
                var collection = db.collection('ambulance');
                var query      = {
                    ambulanceId: ambulanceId
                };

                var projection = {
                    _id           : 1,
                    vehicle_number: 1,
                    source        : 1

                };

                collection.find(query, function (error, results) {
                    db.close();
                    if (error) {
                        callback(error, null);
                    }

                    callback(null, results);
                });

            });

        }
    }

})(module);