'use strict';
var db = require('../../config/db');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config/config');

exports.login = function (req, res) {
    db.get().collection('users').findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(500).send({
            isSuccess: false,
            message: 'Error on the server.'
        });
        if (!user) return res.status(404).send({
            isSuccess: false,
            message: 'User not found.'
        });

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ isSuccess: false, token: null });

        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 //expires in 24 hours
        });
        res.status(200).send({ isSuccess: true, token: token });
    });
};

exports.register = function (req, res) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            var body = {
                name: req.body.name,
                email: req.body.email,
                password: hash
            };

            db.get().collection('users').insert(body, function (err, result) {
                if (err) return res.status(500).send({
                    isSuccess: false,
                    message: 'Error on the server.'
                });
                if (!result) return res.status(404).send({
                    isSuccess: false,
                    message: 'Could not register.'
                });

                res.status(200).send({
                    isSuccess: true,
                    message: "Registered successfully."
                });
            });
        });
    });
}

exports.getUserCount = function (req, res) {
    var collection = db.get().collection('users');
    collection.count(function (err, count) {
        res.status(200).send({
            isSuccess: true,
            data: {
                userCount: count
            }
        });
    });
}
