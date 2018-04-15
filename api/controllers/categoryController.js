'use strict';
var db = require('../../config/db');
var config = require('../../config/config');

exports.getCategories = function (req, res) {
    var collection = db.get().collection('categories');
    collection.find().toArray(function (err, categories) {
        res.status(200).send({
            isSuccess: true,
            data: {
                categories: categories
            }
        })
    });
}

exports.getCategoryCount = function (req, res) {
    var collection = db.get().collection('categories');
    collection.count(function (err, count) {
        res.status(200).send({
            isSuccess: true,
            data: {
                categoryCount: count
            }
        });
    });
}