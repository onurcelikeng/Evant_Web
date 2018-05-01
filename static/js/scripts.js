initialize();
getEvents();
getStatistics();
getCategories();


function initialize() {
    var token = localStorage.getItem("token");
    if (token != null) {
        getMe();
    }
}

function login() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    if (email != "" && password != "") {
        $.post("/api/auth",{email: email, password: password})
        .done(function(res) {
            if (res.isSuccess) {
                localStorage.setItem("token", res.token);
                getMe();     
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

function logout() {
    // expire date = -1
    localStorage.clear();
    x = document.getElementById('loggedOutPanel');
    x.style.display = 'block';
    x = document.getElementById('loggedInPanel');
    x.style.display = 'none';
    x = document.getElementById('addEvent');
    x.style.display = 'none';
    x = document.getElementById('addEventItem');
    x.style.display = 'none';
    $('#logoutModal').modal('hide');
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
                if(res.isSuccess) {
                    $.post("/api/auth",{email: email, password: password})
                    .done(function(res) {
                        if (res.isSuccess) {
                            getMe();
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

function getMe() {
    $.ajax({
        type: "GET",
        url: "api/auth/me",
        headers: { "authorization": localStorage.getItem("token") },
        contentType: 'application/json; charset=utf-8',
        success: function (res) {
            if (res.isSuccess) {
                document.getElementById("username").innerHTML = res.data.name;
                var x = document.getElementById('addEvent');
                x.style.display = 'block';
                x = document.getElementById('addEventItem');
                x.style.display = 'inline';
                x = document.getElementById('loggedOutPanel');
                x.style.display = 'none';
                x = document.getElementById('loggedInPanel');
                x.style.display = 'block';
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
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

    $.get("/api/events/count")
    .done(function(res) {
        if(res.isSuccess) {
            document.getElementById("eventCount").innerHTML = res.data.eventCount;
        }
    }) 
    .fail(function() {
        console.log("error");
    });
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
            console.log(res.data.events);
            $.each(res.data.events, function(){
                content += '<li style="cursor:pointer;" onclick="getEventDetail(\'' + this.id + '\')">' +
								'<div class="date">' +
									'<a href="#">' +
										'<span class="day">25</span>' +
										'<span class="month">August</span>' +
										'<span class="year">2016</span>' +
									'</a>' +
								'</div>' +
								'<a href="#">' +
									'<img src="' + this.photo + '" alt="image">' +
								'</a>' +
								'<div class="info">' +
									'<p>' + this.title + ' <span>' + this.city + '</span></p>' +
								'</div>' +
							'</li>';

                document.getElementById("eventsPanel").innerHTML = content;
            })
        }
    }) 
    .fail(function() {
        console.log("error");
    });
}

function getEventDetail(id) {
    console.log(id);
    $.get("/api/eventDetail/" + id)
    .done(function(res) {
        console.log(res);
        content = '<div class="modal-header">' +
                      '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                      '<h4 class="modal-title">' + res.data.title + '</h4>' +
                  '</div>' +
                  '<div class="modal-body">' +
                      '<img src="' + res.data.photo + '" alt="image">' +
                      '<div>Are you sure?</div>' +
                  '</div>';

        document.getElementById("eventDetail").innerHTML = content;
        $('#eventDetailModal').modal('show');
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
            title: eventName,
            CreateDate: new Date(),
            city: city,
            town: town,
            photo: "picture",
            fullAddress: ""
        }

       /* $.post("/api/events", body)
        .done(function(res) {
            if (res.isSuccess) {
                console.log(res.message);
                getEvents();
            }
            else console.log(res.message);
        })
        .fail(function() {
            console.log("add event error");
        });*/
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
