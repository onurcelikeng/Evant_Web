'use strict';
var config = require('../../config');
var Event = require('./../models/event');
var ObjectId = require('mongodb').ObjectId;

exports.eventCount = function (req, res) {
    Event.count(function (err, count) {
        if (err) return res.status(500).send({
            isSuccess: false,
            message: 'Error on the server.'
        });
        if (!count) return res.status(404).send({
            isSuccess: false,
            message: 'Error occured.'
        });

        res.status(200).send({
            isSuccess: true,
            data: {
                eventCount: count
            }
        });
    });
}

exports.events = function (req, res) {
    Event.find(function (err, events) {
        if (err) return res.status(500).send({
            isSuccess: false,
            message: 'Error on the server.'
        });
        if (!events) return res.status(404).send({
            isSuccess: false,
            message: 'No events found.'
        });

        // last 6 events
        var list = [];
        events.forEach(event => {
            list.push({
                id: event._id,
                start: event.start,
                city: event.address.city,
                title: event.title,
                photo: event.photo
            });
        });

        res.status(200).send({
            isSuccess: true,
            data: {
                events: list
            }
        });
    });
}

exports.eventDetail = function (req, res) {
    Event.findOne({ "_id": ObjectId(req.params.id) }, function (err, event) {
        if (err) return res.status(500).send({
            isSuccess: false,
            message: 'Error on the server.'
        });
        if (!event) return res.status(404).send({
            isSuccess: false,
            message: 'Error occured.'
        });

        res.status(200).send({
            isSuccess: true,
            data: event
        });
    });
}

exports.addEvent = function (req, res) {
    var event = new Event({ 
        title: req.body.title, 
        createDate: req.body.createDate,
        photo: req.body.photo,
        address: {
            city: req.body.city,
            town: req.body.town,
            fullAddress: req.body.city + " " + req.body.town
        },
        user: {
            id: "1",
            name: document.getElementById("username").innerHTML
        },
        start: "",
        content: "",
        category: {
            id: "1",
            name: ""
        }
    });

    event.save( function (err) {
        if (err) return res.status(500).send({
            isSuccess: false,
            message: 'Error on the server.'
        });

        res.status(200).send({ isSuccess: true, message: "Event added successfully." });
    });
};

