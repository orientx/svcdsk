'use strict';

const express = require('express');
const router = express.Router();

const controller = require('../controllers/register');

router.get('/', controller.index);

module.exports = router;
