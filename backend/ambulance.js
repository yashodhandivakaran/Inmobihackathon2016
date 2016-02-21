(function (exports) {
    'use strict';
    var async      = require('async');
    var _          = require('underscore');
    var res        = require('./response');
    var polyline   = require('polyline');
    var gmapsModel = require('./model/gmaps');
    var mongoModel = require('./model/mongo');

    var saveLocation = function (event, context) {
        var source      = event.source;
        var destination = event.destination;

        // less secure. Should actually use sessions. For sake of hackday, keeping this simple.
        var ambulanceId = event.ambulance_id;

        if (_.isEmpty(ambulanceId)) {
            return res.failure(context, new Error('ambulance_id not set'));
        }

        if (!_.isArray(source) || !_.isArray(destination)) {
            return res.failure(context, new Error('Location is not an array'));
        }

        async.waterfall([
            function (callback) {
                _getRoutePolyline(source, destination, callback);
            },
            function (data, callback) {
                if (data.length === 0) {
                    return callback('no polyline found');
                }
                _storeDetails(ambulanceId, source, destination, data, callback);
            },
            function getNearByUsers(callback) {
                console.log('getNearByUsers')
                mongoModel.getNearByUsers(source, callback);
            },
            function filterUsers(users, callback) {


                console.log('filterUsers');
                if (users.length === 0) {
                    return callback(null, []);
                }

                console.log('users', users);

                var finalUsers = [];
                async.each(users, function (item, callback) {
                    var location = item.location.coordinates;
                    console.log('item', item);
                    mongoModel.isUserNearAmbulance(ambulanceId, location, function (error, data) {
                        if (error) {
                            return callback(error);
                        }

                        if (data === true) {
                            finalUsers.push(item._id);
                        }
                    });
                }, function (error) {
                    if (error) {
                        console.log('filterUsers err', error);
                        return callback(error);
                    }

                    callback(null, finalUsers);
                });

                //async.filter(users, function (user, callback) {
                //    console.log('user', user);
                //    var location = user.coordinates;
                //    mongoModel.isUserNearAmbulance(ambulanceId, location, callback);
                //}, callback);
            },
            function markUsersForAlert(users, callback) {
                console.log('markUsersForAlert');
                if (users.length === 0) {
                    return callback(null);
                }

                console.log('users', users);
                mongoModel.insertUsersForAlerting(ambulanceId, users, callback);
            }
        ], function (error) {
            if (error) {
                console.log('saveLocation Error: ', error);
                return res.failure(context, error);
            }

            console.log('saveLocation success');
            res.success(context);
        });
    };

    var _getRoutePolyline = function (source, destination, callback) {
        gmapsModel.getRoutePolyline(source, destination, callback);
    };

    var _decodePolyline = function (pl) {
        return polyline.decode(pl);
    };

    var _storeDetails = function (ambulanceId, source, destination, polyline, callback) {
        mongoModel.updateOrInsertAmbulanceLocation(ambulanceId, {
            source     : source,
            destination: destination,
            location   : _decodePolyline(polyline)
        }, callback);
    };

    exports.handler = saveLocation;

})(exports);