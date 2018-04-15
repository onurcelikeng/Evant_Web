'use strict';
var db = require('../../config/db');
var jwt = require('jsonwebtoken');
var config = require('../../config/config');

exports.getCategories = function (req, res) {
    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        var collection = db.get().collection('categories');
        collection.find().toArray(function (err, docs) {
            res.status(200).send({
                isSuccess: true,
                data: {
                    categories: docs
                }
            })
         });
    });
}