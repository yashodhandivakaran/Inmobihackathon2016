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
        setAmbulanceLocation: function (ambulanceId, data, callback) {

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
                    _id           : ambulanceId,
                    vehicle_number: '',
                    source        : {
                        type       : "Point",
                        coordinates: data.source
                    },
                    destination   : {
                        type       : "Point",
                        coordinates: data.destination
                    },
                    polyline      : {
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
        getNearByUsers      : function (location, callback) {
            MongoClient.connect(_getMongoURL(), function (err, db) {
                if (err) {
                    return callback(err);
                }

                var collection = db.collection('users');
                var query      = {
                    location: {
                        '$near': {
                            $geometry   : {type: "Point", coordinates: location},
                            $maxDistance: 1000 // in meters
                        }
                    }
                };

                collection.find(query, function (error, result) {
                    if (error) {
                        return callback(error);
                    }

                    callback(null, result);
                });
            });
        }
    }

})(module);