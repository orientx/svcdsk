'use strict';

const service = require('../services/index');

module.exports = {

    /**
     * Index action
     */
    index: (req, res, next) => {
        let message = service.getMessage();
        res.render('index', {
            message: message
        });
    }
};
