initialize();
getEvents();
getStatistics();

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
        $.ajax({
            type: "POST",
            url: "api/auth",
            data: {email: email, password: password},
            contentType: 'application/json; charset=utf-8',
            success: function (res) {
                if (res.isSuccess) {
                    localStorage.setItem("token", res.token);
                    getMe();     
                    $('#loginModal').modal('hide');
                    closeLoginModal();
                }
                else document.getElementById('login-error-label').innerHTML = res.message;
            },
            error: function (err) {
                document.getElementById('login-error-label').innerHTML = "An error occured, please try again.";
            }
        });
    }    
    else {
        document.getElementById('login-error-label').innerHTML = "Please fill out all the boxes.";
    }
}

function logout() {
    localStorage.clear();
    sessionStorage.clear();
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
            $.ajax({
                type: "POST",
                url: "api/auth/register",
                data: {name: name, email: email, password: password, repassword: repassword},
                contentType: 'application/json; charset=utf-8',
                success: function (res) {
                    if (res.isSuccess) {
                        $.ajax({
                            type: "POST",
                            url: "api/auth",
                            data: {email: email, password: password},
                            contentType: 'application/json; charset=utf-8',
                            success: function (res) {
                                if (res.isSuccess) {
                                    localStorage.setItem("token", res.token);
                                    getMe();     
                                    $('#loginModal').modal('hide');
                                    closeLoginModal();
                                }
                                else document.getElementById('register-error-label').innerHTML = res.message;
                            },
                            error: function (err) {
                                document.getElementById('register-error-label').innerHTML = "An error occured, please try again.";
                            }
                        });
                    }
                    else document.getElementById('register-error-label').innerHTML = res.message;
                },
                error: function (err) {
                    document.getElementById('register-error-label').innerHTML = "An error occured, please try again.";
                }
            });
        }
        else {
            document.getElementById('register-error-label').innerHTML = "Control your password.";
        }
    }
    else {
        document.getElementById('register-error-label').innerHTML = "Please fill all the boxes.";
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
                sessionStorage.id = res.data.id;
                sessionStorage.name = res.data.name;
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
    $.ajax({
        type: "GET",
        url: "api/categories/count",
        contentType: 'application/json; charset=utf-8',
        success: function (res) {
            if (res.isSuccess) {
                document.getElementById("categoryCount").innerHTML = res.data.categoryCount;
            }
        },
        error: function (err) {
            console.log(err);
        }
    });

    $.ajax({
        type: "GET",
        url: "api/auth/count",
        contentType: 'application/json; charset=utf-8',
        success: function (res) {
            if (res.isSuccess) {
                document.getElementById("activeUserCount").innerHTML = res.data.userCount;
            }
        },
        error: function (err) {
            console.log(err);
        }
    });

    $.ajax({
        type: "GET",
        url: "api/events/count",
        contentType: 'application/json; charset=utf-8',
        success: function (res) {
            if (res.isSuccess) {
                document.getElementById("eventCount").innerHTML = res.data.eventCount;
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function getCategories() {
    var content = '';
    var list = '';
    $.ajax({
        type: "GET",
        url: "api/categories",
        headers: { "Cache-Control": "public, max-age = 86400" },
        cache: true,
        success: function (res) {
            if(res.isSuccess) {
                $('#category').empty();
                $.each(res.data.categories, function(){
                    content += '<li class="category col-sm-4">'+
                                    '<img src="' + this.picture + '" alt="image" class="img-rounded">'+
                                    '<a href="#" onclick="return false;"><span>' + this.name + '</span></a>'+
                                '</li>';
                    list = 	'<option value="' + this._id + '">' + this.name + '</option>';
    
                    $('#categoryList').html(content);
                    $('#category').append(list);
                })
            }
            else console.log(res.message);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function getEvents() {
    $.ajax({
        type: "GET",
        url: "api/events",
        contentType: 'application/json; charset=utf-8',
        success: function (res) {
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
        },
        error: function (err) {
            document.getElementById('login-error-label').innerHTML = "An error occured, please try again.";
        }
    });
}

function getEventDetail(id) {
    $.ajax({
        type: "GET",
        url: "/api/eventDetail/" + id,
        contentType: 'application/json; charset=utf-8',
        success: function (res) {
            var display = "none";
            if(res.isSuccess) {
                if(res.data.userId == sessionStorage.id) display = "block";
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
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function deleteEvent(id) {
    $.ajax({
        type: "POST",
        url: "api/events/" + id,
        headers: { "authorization": localStorage.getItem("token") },
        contentType: 'application/json; charset=utf-8',
        success: function (res) {
            if (res.isSuccess) {
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

    if (eventName != "" && start != "" && city != "" && town != "" && fullAddress != "" && (photo != "" && photo != undefined && photo != null) && content != "" && categoryName != "") {

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
                        id: sessionStorage.id,
                        userName: sessionStorage.name
                    },
                    category: {
                        id: categoryId,
                        categoryName: categoryName
                    }
                }

                $.ajax({
                    type: "POST",
                    data: body,
                    url: "api/events",
                    contentType: 'application/json; charset=utf-8',
                    success: function (res) {
                        if (res.isSuccess) {
                            document.getElementById('add-error-label').innerHTML = "";
                            clearAddEventForm();
                            getEvents();
                        }
                        else document.getElementById('add-error-label').innerHTML = res.message;
                    },
                    error: function (err) {
                        document.getElementById('add-error-label').innerHTML = "An error occured, please try again.";
                    }
                });
            },
            error: function(jqXHR, textStatus, errorMessage) {
                document.getElementById('add-error-label').innerHTML = errorMessage;
            }
        });
    }
    else {
        document.getElementById('add-error-label').innerHTML = "Please fill out all the boxes.";
    }
}

function closeLoginModal() {
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById('login-error-label').innerHTML = "";
}

function closeSignupModal() {
    document.getElementById("name").value = "";
    document.getElementById("mail").value = "";
    document.getElementById("pwd").value = "";
    document.getElementById("repwd").value = "";
    document.getElementById('register-error-label').innerHTML = "";
}

function clearAddEventForm() {
    document.getElementById("eventName").value = "";
    document.getElementById("date").value = "";
    document.getElementById("city").value = "";
    document.getElementById("town").value = "";
    document.getElementById("fullAddress").value = "";
    document.getElementById("photo").files[0] = "";
    document.getElementById("content").value = "";
    document.getElementById("category").value = "";
    document.getElementById('add-error-label').innerHTML = ""; 
}
