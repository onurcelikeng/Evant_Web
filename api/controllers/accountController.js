'use strict';

exports.login = function(req, res) {
    console.log(req);
    res.send("success");
};

exports.register = function(req, res) {
    res.send("success");
}
