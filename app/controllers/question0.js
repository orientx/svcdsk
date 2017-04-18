'use strict';

const mongoose = require('mongoose');
const async = require('async');
const User = require('../models/User');
const Question = require('../models/Question');
const Counter = require('../models/Counter');
const service = require('../services/question');
const logger = require('log4js').getLogger(__filename);

module.exports = {
    index: index,
    new: new,
    save: save,
    show: show,
    edit: edit,
    update: update,
    delete: delete
}

function index(req, res, next) {
    var vistorCounter = null;
    var page = Math.max(1, req.query.page) > 1 ? parseInt(req.query.page) : 1;
    var limit = Math.max(1, req.query.limit) > 1 ? parseInt(req.query.limit) : 10;
    var search = service.createSearch(req.query);

    async.waterfall([function(callback) {
        Counter.findOne({
            name: "vistors"
        }, function(err, counter) {
            if (err) callback(err);
            vistorCounter = counter;
            callback(null);
        });
    }, function(callback) {
        if (!search.findUser) return callback(null);
        User.find(search.findUser, function(err, users) {
            if (err) callback(err);
            var or = [];
            users.forEach(function(user) {
                or.push({
                    author: mongoose.Types.ObjectId(user._id)
                });
            });
            if (search.findQuestion.$or) {
                search.findQuestion.$or = search.findQuestion.$or.concat(or);
            } else if (or.length > 0) {
                search.findQuestion = {
                    $or: or
                };
            }
            callback(null);
        });

    }, function(callback) {
        if (search.findUser && !search.findQuestion.$or) return callback(null, null, 0);

        Question.count(search.findQuestion, function(err, count) {
            if (err) {
                console.log('Trace66', err);
                return res.json({
                    success: false,
                    message: err
                });
            }
            var skip = (page - 1) * limit;
            var maxPage = Math.ceil(count / limit);
            callback(null, skip, maxPage);
        });
    }, function(skip, maxPage, callback) {
        if (search.findUser && !search.findQuestion.$or) return callback(null, [], 0);
        Question.find(search.findQuestion)
            .populate("author")
            .sort('-createdAt')
            .skip(skip).limit(limit)
            .exec(function(err, question) {
                if (err) callback(err);
                callback(null, question, maxPage);
            });

    }], function(err, question, maxPage) {
        if (err) {
            console.log('Trace8', err);
            return res.json({
                success: false,
                message: err
            });
        }
        console.log(question);
        res.render("question/index", {
            question: question,
            user: req.user,
            page: page,
            maxPage: maxPage,
            urlQuery: req._parsedUrl.query,
            search: search,
            counter: vistorCounter,
            questionMessage: req.flash("questionMessage")[0]
        });
    });
}

function new(req, res, next) {
    res.render("question/new");
}

function save(req, res, next) {
    async.waterfall([function(callback) {
        console.log('Trace777');
        Counter.findOne({
            name: "question"
        }, function(err, counter) {
            if (err) callback(err);
            if (counter) {
                callback(null, counter);
            } else {
                Counter.create({
                    name: "question",
                    totalCount: 0
                }, function(err, counter) {
                    if (err) return res.json({
                        success: false,
                        message: err
                    });
                    callback(null, counter);
                });
            }
        });
    }], function(callback, counter) {
        var newQuestion = req.body.question;
        console.log('body', req.body);
        console.log('newQuestion', newQuestion);
        console.log('etcInfo', req.body.etcInfo);
        //newQuestion.author = req.body.etcInfo.name;
        newQuestion.numId = counter.totalCount + 1;
        Question.create(req.body.question, function(err, question) {
            console.log('err', err, '\n');
            /*
            if (err) return res.json({
                success: false,
                message: err
            });
            */
            if (err) {
                console('Trace111\n');
                res.render("http/500", {
                    err: err
                });
            }
            counter.totalCount++;
            counter.save();
            res.redirect('/question');
        });

        //res.redirect('/question');
    });
}

function show(req, res, next) {
    console.log("Trace11");
    Question.findById(req.params.id).populate("author").exec(function(err, question) {
        if (err) return res.json({
            success: false,
            message: err
        });
        question.views++;
        //question.save();
        //console.log('aaa : %s',req._parsedUrl.query);
        res.render("question/show", {
            question: question,
            urlQuery: req._parsedUrl.query,
            user: req.user,
            search: service.createSearch(req.query)
        });
    });
}

function edit(req, res, next) {
    console.log("Trace edit", req.params.id);
    Question.findById(req.params.id, function(err, question) {
        if (err) return res.json({
            success: false,
            message: err
        });
        //if (!req.user._id.equals(question.author)) return res.json({
        //    success: false,
        //    message: "Unauthrized Attempt"
        //});
        res.render("question/edit", {
            question: question,
            user: req.user
        });
    });
}

function update(req, res, next) {
    console.log("Trace update", req.params.id);
    console.log(req.body);
    req.body.question.updatedAt = Date.now();
    Question.findOneAndUpdate({
        _id: req.params.id
        //,author: req.user._id
    }, req.body.question, function(err, question) {
        if (err) return res.json({
            success: false,
            message: err
        });
        if (!question) return res.json({
            success: false,
            message: "No data found to update"
        });
        res.redirect('/question/show/' + req.params.id);
    });
}

function delete(req, res, next) {
    console.log("Trace delete", req.params.id);

    Question.findOneAndRemove({
        _id: req.params.id
        //,author: req.user._id
    }, function(err, question) {
        if (err) return res.json({
            success: false,
            message: err
        });
        if (!question) return res.json({
            success: false,
            message: "No data found to delete"
        });
        res.redirect('/question');
    });
}
