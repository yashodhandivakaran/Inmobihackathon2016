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
        var GMAPS_CONFIG = {
            key             : GOOGLE_KEYS[Math.floor(Math.random() * GOOGLE_KEYS.length)],
            encode_polylines: false
        };
    };

    module.exports = {

        getRoutePolyline: function (source, destination, callback) {
            var gmaps = new GoogleMapsAPI(_getConfig());

            async.waterfall([
                function (callback) {
                    gmaps.directions({
                        origin     : source.join(','),
                        destination: destination.join(','),
                        mode       : 'driving'
                    }, callback);
                },
                function (data, callback){
                    var polyline = result.routes[0].overview_polyline[0].points;

                }

            ]);

        }
    }
})(module);