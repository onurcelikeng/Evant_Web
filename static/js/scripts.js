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
                console.log(res);
                if(res.isSuccess) {
                    $.post("/api/auth",{email: email, password: password})
                    .done(function(res) {
                        if (res.isSuccess) {
                            localStorage.setItem("token", res.token);
                            getMe();
                            $('#signupModal').modal('hide');
                            closeSignupModal();
                       }
                       else console.log(res.message);
                    })
                    .fail(function() {
                       console.log("login error");
                    });
                } else console.log(res.message);
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
                localStorage.setItem("id", res.data.id);
                localStorage.setItem("name", res.data.name);
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
        var list = '';
        if(res.isSuccess) {
            $.each(res.data.categories, function(){
                content += '<li class="category col-sm-4">'+
                                '<img src="' + this.picture + '" alt="image" class="img-rounded">'+
                                '<a href="#" onclick="return false;"><span>' + this.name + '</span></a>'+
                            '</li>';
                list += 	'<option value="' + this._id + '">' + this.name + '</option>';

                $('#categoryList').html(content);
                document.getElementById("category").innerHTML = list;
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
                content += '<li style="cursor:pointer; margin: 10px" onclick="getEventDetail(\'' + this.id + '\')">' +
								'<div class="date">' +
									'<a href="#">' +
										'<span class="day">' + this.day + '</span>' +
										'<span class="month">' + this.month + '</span>' +
										'<span class="year">' + this.year + '</span>' +
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
        var display = "none";
        console.log(localStorage.getItem("id"))
        if(res.data.userId == localStorage.getItem("id")) display = "block";
        content = '<div class="modal-header">' +
                      '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                      '<h4 class="modal-title">' + res.data.title + '</h4>' +
                  '</div>' +
                  '<div class="modal-body">' +
                      '<img class="col-12 col-md-4" src="' + res.data.photo + '" alt="image">' +

                      '<p style="font-weight: bold; font-size: 20px; margin:0">' + res.data.title + '-' + res.data.userName + '</p>' +
                      '<p style="margin:0">' + res.data.start + '</p>' +
                      '<p style="margin:0">' + res.data.address + '</p>' +

                      '<div col-12 col-md-12>' + 
                          '<p style="margin: 10px; margin-top: 30px">' + res.data.content + '</p>' +
                      '</div>' +
                  '</div>' +
                  '<div class="modal-footer">' +
                    '<button type="button" class="btn btn-danger btn-default pull-left" style="margin-left: 10px; display: ' + display + '" onclick="deleteEvent(\'' + res.data.id + '\');"><span class="glyphicon glyphicon-trash"></span> Delete</button>' +
                    '<button type="submit" class="btn btn-primary btn-default pull-right" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span> Cancel</button>' +
                  '</div>';

        document.getElementById("eventDetail").innerHTML = content;
        $('#eventDetailModal').modal();
    });
}

function deleteEvent(id) {
    console.log(localStorage.getItem("token"));
    $.ajax({
        type: "POST",
        url: "api/events/" + id,
        headers: { "authorization": localStorage.getItem("token") },
        contentType: 'application/json; charset=utf-8',
        success: function (res) {
            if (res.isSuccess) {
                console.log(res.message);
                $('#eventDetailModal').modal('hide');
                getEvents();
            }
            else console.log(res.message);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function addEvent() {
    var eventName = document.getElementById("eventName").value;
    var start = document.getElementById("date").value;
    var city = document.getElementById("city").value;
    var town = document.getElementById("town").value;
    var fullAddress = document.getElementById("fullAddress").value;
    var photo = document.getElementById("photo").files[0];
    var content = document.getElementById("content").value;
    var categoryId = document.getElementById("category").value;
    var categoryName = $("#category option:selected").text();

    if (eventName != "" && date != "" && city != "" && town != "") {

        var formData = new FormData();
        formData.append("File", photo);

        $.ajax({
            url: "https://evantapp.azurewebsites.net/api/events/photo",
            type: "POST",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(response) {
                photo = response.message;

                var body = {
                    title: eventName,
                    start: start,
                    city: city,
                    town: town,
                    fullAddress: fullAddress,
                    photo: photo,
                    content: content,
                    user: {
                        id: localStorage.getItem("id"),
                        userName: localStorage.getItem("name")
                    },
                    category: {
                        id: categoryId,
                        categoryName: categoryName
                    }
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
            },
            error: function(jqXHR, textStatus, errorMessage) {
                console.log(errorMessage);
            }
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
