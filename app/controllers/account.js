'use strict';

const service = require('../services/account');

module.exports = {

    /**
     * Index action
     */
    index: (req, res, next) => {
        let message = service.getMessage();
        res.render('account/index', {
            message: message
        });
    }
};
