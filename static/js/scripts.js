getStatistics();
getCategories();

function login() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    if (email != "" && password != "") {
        $.post("/api/auth",{email: email, password: password})
        .done(function(res) {
            if(res.isSuccess) {
                var x = document.getElementById('addEvent');
                x.style.display = 'block';
                x = document.getElementById('addEventItem');
                x.style.display = 'inline'
                $('#loginModal').modal('hide');
                closeLoginModal();
            }
            else console.log(res.message);
        })
        .fail(function() {
            console.log("login error");
        });
    }    
    else {
        console.log("Missing values");
    }
}

function signup() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("mail").value;
    var password = document.getElementById("pwd").value;
    var repassword = document.getElementById("repwd").value;

    if (name != "" && email != "" && password != "" && repassword != "") {
        if (password == repassword) {
            $.post("/api/auth/register",{name: name, email: email, password: password, repassword: repassword})
            .done(function(res) {
                console.log(res.message);
                if(res.isSuccess) {
                    $.post("/api/auth",{email: email, password: password})
                    .done(function(res) {
                       if(res.isSuccess) {
                           var x = document.getElementById('addEvent');
                           x.style.display = 'block';
                           x = document.getElementById('addEventItem');
                           x.style.display = 'inline'
                           $('#signupModal').modal('hide');
                           closeSignupModal();
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
        else {
            console.log("Control your password.")
        }
    }
    else {
        console.log("Missing values.")
    }
}

function getStatistics() { 
    $.get("/api/categories/count")
    .done(function(res) {
        if(res.isSuccess) {
            document.getElementById("categoryCount").innerHTML = res.data.categoryCount;
        }
    }) 
    .fail(function() {
        console.log("error");
    });

    $.get("/api/auth/count")
    .done(function(res) {
        if(res.isSuccess) {
            document.getElementById("activeUserCount").innerHTML = res.data.userCount;
        }
    }) 
    .fail(function() {
        console.log("error");
    });

    document.getElementById("eventCount").innerHTML = 25;
}

function getCategories() {
    $.get("/api/categories")
    .done(function(res) {
        var content = '';
        if(res.isSuccess) {
            $.each(res.data.categories, function(){
                content += '<li class="category col-sm-4">'+
                                '<img src="' + this.picture + '" alt="image" class="img-rounded">'+
                                '<a href="#" onclick="return false;"><span>' + this.name + '</span></a>'+
                            '</li>';

                $('#categoryList').html(content);
            })
        }
    }) 
    .fail(function() {
        console.log("error");
    });
}

function getEvents() {
    $.get("/api/events")
    .done(function(res) {
        var content = '';
        if(res.isSuccess) {
            $.each(res.data.events, function(){
                content += '<li>'+
                                '<a href="#" data-largesrc="images/upcoming-event-1.jpg" data-title="BMW Open Championship" data-description="Swiss chard pumpkin bunya nuts maize plantain aubergine napa cabbage soko coriander sweet pepper water spinach winter purslane shallot tigernut lentil beetroot.">'+
                                    '<img src="images/upcoming-event-1.jpg" alt="img01">'+
                                    '<div class="overlay"></div>'+
                                    '<div class="info">'+
                                        '<p>BMW Open Championship </p>'+
                                        '<p><span>25 August 2018</span></p>'+
                                    '</div>'+
                                '</a>'+
                            '</li>';

                $('#og-grid').html(content);
            })
        }
    }) 
    .fail(function() {
        console.log("error");
    });
}

function addEvent() {
    var eventName = document.getElementById("eventName").value;
    var date = document.getElementById("date").value;
    var latitude = document.getElementById("latitude").value;
    var longitude = document.getElementById("longitude").value;
    var city = document.getElementById("city").value;
    var town = document.getElementById("town").value;

    if (eventName != "" && date != "" && latitude != "" && longitude != "" && city != "" && town != "") {
        var body = {
            eventName: eventName,
            date: date,
            latitude: latitude,
            longitude: longitude,
            city: city,
            town: town,
            picture: "picture",
            private: "private"
        }

        $.post("/api/events", body)
        .done(function(res) {
            if (res.isSuccess) {
                console.log(res.message);
                getEvents();
            }
            else console.log(res.message);
        })
        .fail(function() {
            console.log("add event error");
        });
    }
    else {
        console.log("Missing values.")
    }
}

function closeLoginModal() {
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
}

function closeSignupModal() {
    document.getElementById("name").value = "";
    document.getElementById("mail").value = "";
    document.getElementById("pwd").value = "";
    document.getElementById("repwd").value = "";
}
