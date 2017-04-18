'use strict';

module.exports = {

    /**
     *
     */
    getMessage: () => {
        return 'Register Page';
    },
    register: (user, callback) => {
    UserSchema.findOne({user_name: user.user_name}, (err, usr) => {
        if (err) {
            return callback(err);
        }

        if (usr) {
            return callback(null, [{ messageCode: 'user.exists' }]);
        }

        user = new UserSchema(user);
        user.save((err, user) => {
            if (err) {
                if (ValidationUtils.hasValidationErrors(err)) {
                    return callback(null, ValidationUtils.extractErrors(err, 'user'));
                }
                return callback(err);
            }

            callback(null, null, user);
        });
    });
}
};
