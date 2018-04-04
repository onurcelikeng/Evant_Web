getStatistics();

function login(){
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    $.post("/account/login",{email: email, password: password})
    .done(function(res) {
        if(res.isSuccess) {
            var x = document.getElementById('addEvent');
            x.style.display = 'block';
            x = document.getElementById('addEventItem');
            x.style.display = 'inline'
            $('#loginModal').modal('hide');
            console.log(res.token);
        }
        else console.log(res.message);
    })
    .fail(function() {
        console.log("login error");
    });
}

function signup(){
    var name = document.getElementById("name").value;
    var email = document.getElementById("mail").value;
    var password = document.getElementById("pwd").value;
    var repassword = document.getElementById("repwd").value;

    $.post("/account/register",{name: name, email: email, password: password, repassword: repassword})
    .done(function(res) {
        console.log(res.message);
        if(res.isSuccess) {
            $.post("/account/login",{email: email, password: password})
            .done(function(res) {
               if(res.isSuccess) {
                   var x = document.getElementById('addEvent');
                   x.style.display = 'block';
                   x = document.getElementById('addEventItem');
                   x.style.display = 'inline'
                   $('#signupModal').modal('hide');
                   console.log(res.token);
               }
               else console.log(res.message);
            })
            .fail(function() {
               console.log("login error");
            });
        }
    })
    .fail(function() {
        console.log("register error");
    });
}

function getStatistics() {
    $.get("/statistics")
    .done(function(res) {
        if(res.isSuccess) {
            document.getElementById("eventCount").innerHTML = res.data.events;
            document.getElementById("activeUserCount").innerHTML = res.data.activeUser;
            document.getElementById("categoryCount").innerHTML = res.data.categories;
        }
    }) 
    .fail(function() {
        console.log("error");
    });
}