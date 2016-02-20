/**
 * Created by suraj on 20/02/16.
 */

(function (module) {
    'use strict';
    var geojsonTools = require('geojson-tools');

    module.exports = {
        getDistanceBetweenLatLng: function (source, destination) {
            return geojsonTools.getDistance([source, destination], 5);
        }
    }

})(module);