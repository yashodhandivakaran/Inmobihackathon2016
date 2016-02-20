(function (exports) {
    'use strict';
    var async    = require('async');
    var _        = require('underscore');
    var res      = require('./response');
    var polyline = require('polyline');

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
    };

    var _getRoutePolyline = function (source, destination, callback) {

    };

    var _decodePolyline = function (polyline) {
        return polyline.decode(polyline);
    };

    var _storeDetails = function (ambulanceId, source, destination, polyline, callback) {

    };

    exports.handler = saveLocation;

})(exports);