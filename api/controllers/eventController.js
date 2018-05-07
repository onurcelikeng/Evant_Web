'use strict';
var jwt = require('jsonwebtoken');
var config = require('../../config');
var Event = require('./../models/event');
var ObjectId = require('mongodb').ObjectId;
var moment = require('moment');

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

        res.set({'Cache-Control': 'no-cache'}).status(200).send({
            isSuccess: true,
            data: {
                eventCount: count
            }
        });
    });
}

exports.events = function (req, res) {
    Event.find({isDeleted: false})
    .sort({createDate: -1})
    .limit(6)
    .exec(function (err, events) {
        if (err) return res.status(500).send({
            isSuccess: false,
            message: 'Error on the server.'
        });
        if (!events) return res.status(404).send({
            isSuccess: false,
            message: 'No events found.'
        });

        var list = [];
        events.forEach(event => {
            list.push({
                id: event._id,
                day: moment(event.start).format('DD'),
                month: moment(event.start).format('MMMM'),
                year: moment(event.start).format('YYYY'),
                city: event.address.city,
                title: event.title,
                photo: event.photo
            });
        });

        res.set({'Cache-Control': 'no-cache'}).status(200).send({
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

        res.set({'Cache-Control': 'no-cache'}).status(200).send({
            isSuccess: true,
            data: {
                id: event._id,
                start: moment(event.start).format('lll'),
                userName: event.user.name,
                userId: event.user.id,
                title: event.title,
                photo: event.photo,
                content: event.content,
                address: event.address.fullAddress
            }
        });
    });
}

exports.deleteEvent = function (req, res) {
    var token = req.headers['authorization'];

    Event.findOneAndUpdate({_id: ObjectId(req.params.id)}, { $set: { isDeleted: true }}, null, function (err, response) {
        if (err) return res.status(500).send({
            isSuccess: false,
            message: 'Error on the server.'
        });

        res.set({'Cache-Control': 'no-cache'}).status(200).send({ isSuccess: true, message: "Event deleted successfully." });
    });
}

exports.addEvent = function (req, res) {
    var event = new Event({ 
        title: req.body.title, 
        createDate: moment().format(),
        photo: req.body.photo,
        address: {
            city: req.body.city,
            town: req.body.town,
            fullAddress: req.body.fullAddress
        },
        user: {
            id: ObjectId(req.body.user.id),
            name: req.body.user.userName
        },
        start: req.body.start,
        content: req.body.content,
        category: {
            id: ObjectId(req.body.category.id),
            name: req.body.category.categoryName
        },
        isDeleted: false
    });

    event.save( function (err) {
        if (err) return res.status(500).send({
            isSuccess: false,
            message: 'Error on the server.'
        });

        res.set({'Cache-Control': 'no-cache'}).status(200).send({ isSuccess: true, message: "Event added successfully." });
    });
};

