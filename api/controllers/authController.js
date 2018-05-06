'use strict';
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config');
var ObjectId = require('mongodb').ObjectId; 
var User = require('./../models/user');

exports.register = function (req, res) {
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) return res.status(500).send({
            isSuccess: false,
            message: 'Error on the server.'
        });

        if (!user) {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(req.body.password, salt, function (err, hash) {
                    var user = new User({ 
                        name: req.body.name, 
                        email: req.body.email,
                        password: hash
                    });
                    user.save(function(err) {
                        if (err) return res.status(500).send({
                            isSuccess: false,
                            message: 'Error on the server.'
                        });
                        
                        res.status(200).send({
                            isSuccess: true,
                            message: "Registered successfully."
                        });
                    });
                });
            });
        } 

        res.set({'Cache-Control': 'public, max-age = 36500', 'Expires': 'Wed, 21 Oct 2019 07:28:00 GMT'}).status(200).send({ isSuccess: false, message: "This email is already registered. Please try a different email address or login." });
    });


}

exports.login = function (req, res) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(500).send({
            isSuccess: false,
            message: 'Error on the server.'
        });
        if (!user) return res.status(404).send({
            isSuccess: false,
            message: 'User not exists.'
        });

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ isSuccess: false, token: null });

        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 //expires in 24 hours
        });

        res.set({'Cache-Control': 'public, max-age = 36500', 'Expires': 'Wed, 21 Oct 2019 07:28:00 GMT'}).status(200).send({ isSuccess: true, token: token });
    });
}

exports.me = function (req, res) {
    var userId = null;
    var token = req.headers['authorization'];

    jwt.verify(token, config.secret, function(err, decoded) {      
        if (err) 
          return res.status(500).send({ isSuccess: false, message: 'Failed to authenticate token.' });    
        userId = decoded.id;
        User.findById(userId, function (err, user) {
            if (err) return res.status(500).send({
                isSuccess: false,
                message: 'Error on the server.'
            });
            if (!user) return res.status(404).send({
                isSuccess: false,
                message: 'Email not exists.'
            });
            res.set({'Cache-Control': 'public, max-age = 36500', 'Expires': 'Wed, 21 Oct 2019 07:28:00 GMT'}).status(200).send({
                isSuccess: true,
                data: {
                    name: user.name,
                    email: user.email,
                    id: user._id
                }
            });
        });
    });
}

exports.userCount = function (req, res) {
    User.count(function (err, count) {
        if (err) return res.status(500).send({
            isSuccess: false,
            message: 'Error on the server.'
        });
        if (!count) return res.status(404).send({
            isSuccess: false,
            message: 'Error occured.'
        });

        res.set({'Cache-Control': 'public, max-age = 36500', 'Expires': 'Wed, 21 Oct 2019 07:28:00 GMT'}).status(200).send({
            isSuccess: true,
            data: {
                userCount: count
            }
        });
    });
}