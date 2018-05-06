'use strict';
var config = require('../../config');
var Category = require('./../models/category');

exports.categories = function (req, res) {
    Category.find(function (err, categories) {
        if (err) return res.status(500).send({
            isSuccess: false,
            message: 'Error on the server.'
        });
        if (!categories) return res.status(404).send({
            isSuccess: false,
            message: '0 category found.'
        });
        
        res.set({'Cache-Control': 'public, max-age = 36500'}).status(200).send({
            isSuccess: true,
            data: {
                categories: categories
            }
        })
    });
}

exports.categoryCount = function (req, res) {
    Category.count(function (err, count) {
        if (err) return res.status(500).send({
            isSuccess: false,
            message: 'Error on the server.'
        });
        if (!count) return res.status(404).send({
            isSuccess: false,
            message: 'Error occured.'
        });

        res.set({'Cache-Control': 'public, max-age = 36500'}).status(200).send({
            isSuccess: true,
            data: {
                categoryCount: count
            }
        });
    });
}