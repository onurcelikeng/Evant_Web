'use strict';

exports.getStatistics = function(req, res) {
    res.json({
        isSuccess: true,
        data: {
            events: "598",
            activeUser: "16,173",
            categories: "6"
        }
    })
}
