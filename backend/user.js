(function (exports) {

    var async      = require('async');
    var _          = require('underscore');
    var res        = require('./response.js');
    var mongoModel = require('./model/mongo.js');

    var saveUserLocation = function (event, context) {
        var location  = event.location;
        var user_id = event.user_id;

        if (!_.isArray(location)) {
            return res.failure(context, new Error('Source is not an array'));
        }
        if (_.isEmpty(user_id)) {
            return res.failure(context, new Error('UserId is empty'));
        }

        async.waterfall([
            function (callback) {
                mongoModel.saveOrUpdateUserLocation({
                    user_id: user_id,
                    location : location
                }, callback);
            },
            function (callback) {
                mongoModel.checkforNotification(user_id, callback)
            },
            function (data, callback) {
                mongoModel.getAmbulanceInfo(data._id, callback)
            }
        ], function (error, data) {
            if (error) {
                console.log('saveUserLocation : error ', error);
                return res.failure(context, new Error(error));
            }

            console.log('saveUserLocation :Success');
            res.success(context, data);
        });

    };

    exports.handler = saveUserLocation;

})(exports);