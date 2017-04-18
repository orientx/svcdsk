'use strict';

const CONFIG = require('./config.json');
const mongoose = require('mongoose');

const CONN_STR = CONFIG.DATABASE.DATABASE_URL;
const options = CONFIG.DATABASE.options;

mongoose.connect(CONN_STR, options);
//mongoose.connect('mongodb://mysd:mysd123qwe@127.0.0.1/servicedesk');
//mongoose.connect('mongodb://127.0.0.1/servicedesk');

mongoose.connection.on('connected', () => {
    console.log(`Mongoose default connection open to ${CONN_STR}`);
});

mongoose.connection.on('error', err => {
    console.log(`Mongoose default connection error: ${err}`);
    if (CONFIG.DATABASE.RECONNECT) {
        return;
    }
    process.exit(1);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
    if (CONFIG.DATABASE.RECONNECT) {
        reconnect();
    }
});

mongoose.connection.once('open', () => {
    console.log('Mongoose default connection is open');
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

const reconnect = () => {
    const timeout = CONFIG.DATABASE.RECONNECTION_INTERVAL || 5000;
    console.log(`Retrying to connect to database in ${timeout / 1000} seconds`);

    setTimeout(() => {
        mongoose.connect(CONN_STR);
    }, timeout);
};
