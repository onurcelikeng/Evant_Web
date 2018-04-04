'use strict';

let userList = [
    {
        name: "Elif Seray Dönmez",
        email: "elifseraydonmez@gmail.com",
        password: "123"
    },
    {
        name: "Onur Çelik",
        email: "onurantmil@gmail.com",
        password: "123"
    },
    {
        name: "Musa Kaçmaz",
        email: "musakacmaz@gmail.com",
        password: "123"
    }
]

exports.login = function(req, res) {
    var found = false;
    var i = 0;
    for(i = 0; i < userList.length; i++) {
        if(userList[i].email == req.body.email && userList[i].password == req.body.password) {
            found = true;
            break;
        }
    };

    if(found) {
        res.json({
            isSuccess: true,
            token: "123456789"
        });
    } else {
        res.json({
            isSuccess: false,
            message: "Error"
        });
    }  
};

exports.register = function(req, res) {
    userList.concat(req.body);
    console.log(userList);
    res.json({
        isSuccess: true,
        message: "Success"
    })
}
