'use strict';

const express = require('express');
const router = express.Router();

const controller = require('../controllers/account');

router.get('/', controller.index);

module.exports = router;
