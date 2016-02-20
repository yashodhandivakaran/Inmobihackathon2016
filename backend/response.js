/**
 * Created by suraj on 20/02/16.
 */

(function (module) {
    'use strict';

    module.exports = {

        failure: function (context, error, data) {
            if (error) {
                console.log('context fail ', error);
            }

            context.fail({
                error_code: 1001,
                message   : 'something went wrong',
                data      : data
            });
        },
        success: function (context, data) {
            context.succeed({
                error_code: 0,
                data      : data
            });
        }

    }

})(module);