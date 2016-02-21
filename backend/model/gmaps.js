/**
 * Created by suraj on 20/02/16.
 */

(function (module) {
    'use strict';
    var CONFIG        = require('../config/common.json');
    var GoogleMapsAPI = require('googlemaps');
    var async         = require('async');
    var GOOGLE_KEYS   = CONFIG.GOOGLE_KEYS;

    var _getConfig = function () {
        return {
            key             : GOOGLE_KEYS[Math.floor(Math.random() * GOOGLE_KEYS.length)],
            encode_polylines: false
        };
    };

    module.exports = {
        getRoutePolyline: function (source, destination, callback) {
            var gmaps = new GoogleMapsAPI({
                key             : GOOGLE_KEYS[Math.floor(Math.random() * GOOGLE_KEYS.length)],
                encode_polylines: false
            });

            async.waterfall([
                function (callback) {
                    gmaps.directions({
                        origin     : source.join(','),
                        destination: destination.join(','),
                        mode       : 'driving'
                    }, callback);
                }

            ], function (error, result) {
                if (error) {
                    return callback(error);
                }

                console.log('polyline',result.routes[0].overview_polyline.points);
                return callback(error, result.routes[0].overview_polyline.points);
            });

        }
    }
})(module);