'use strict';
var db = require('../../config/db');
var config = require('../../config/config');

exports.getEvents = function (req, res) {
    var collection = db.get().collection('events');
    collection.find().toArray(function (err, events) {
        res.status(200).send({
            isSuccess: true,
            data: {
                events: events
            }
        })
    });
}

exports.addEvent = function (req, res) {
    db.get().collection('events').insert(req.body, function (err, result) {
        if (err) return res.status(500).send({
            isSuccess: false,
            message: 'Error on the server.'
        });
        if (!result) return res.status(404).send({
            isSuccess: false,
            message: 'Event could not be added.'
        });

        res.status(200).send({ isSuccess: true, message: "Event added successfully." });
    });
};

exports.getEventCount = function (req, res) {
    var collection = db.get().collection('events');
    collection.count(function (err, count) {
        res.status(200).send({
            isSuccess: true,
            data: {
                eventCount: count
            }
        });
    });
}

