'use strict';

const logger = require('log4js').getLogger('app');

module.exports = {

    getMessage: () => {
        return 'Question Page';
    },

    createSearch: (req) => {
        logger.debug('searchType : ' + req.query.searchType);
        logger.debug('searchText : ' + req.query.searchText);

        var findQuestion = {},
            findUser = null,
            highlight = {};
        if (req.query.searchType && req.query.searchText) {
            var searchTypes = req.query.searchType.toLowerCase().split(",");
            logger.debug('searchTypes : ' + JSON.stringify(searchTypes));
            var questionQueries = [];
            if (searchTypes.indexOf("title") >= 0) {
                questionQueries.push({
                    title: { $regex : new RegExp(req.query.searchText, "i") }
                });
                logger.debug('questionQueries : ' + JSON.stringify(questionQueries));
                highlight.title = req.query.searchText;
            }
            if (searchTypes.indexOf("content") >= 0) {
                questionQueries.push({
                    content:{ $regex : new RegExp(req.query.searchText, "i") }
                });
                logger.debug('questionQueries : ' + questionQueries);
                highlight.content = req.query.searchText;
            }
            if (questionQueries.length > 0) findQuestion = {
                $or: questionQueries
            };
        }
        logger.debug('findQuestion : ' + JSON.stringify(findQuestion));
        return {
            searchType: req.query.searchType,
            searchText: req.query.searchText,
            findQuestion: findQuestion,
            findUser: findUser,
            highlight: highlight
        };
    }

};
