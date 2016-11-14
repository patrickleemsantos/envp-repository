var myApp = new Framework7({
    modalTitle: 'Envyp',
    material: true,
    preloadPreviousPage: false,
    fastClicks: true
});

var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: false
});

const ENVYP_API_URL = 'http://patricks-macbook-air.local/envyp/api/';
// const ENVYP_API_URL = 'http://115.85.17.61/envyp/';
const NO_INTERNET_ALERT = 'Please check your internet connection';
const ERROR_ALERT = 'An error occured, please try again.';

var imgfile = '';
var latitude = '';
var longitude = '';

$(document).on({
    'DOMNodeInserted': function() {
        $('.pac-item, .pac-item span', this).addClass('no-fastclick');
    }
}, '.pac-container');

// document.addEventListener("deviceready", onDeviceReady, false);
// function onDeviceReady() {
//     console.log(FileTransfer);
// }

if (localStorage.getItem('account_id') != null) {
    mainView.router.loadPage('choose_sports.html');
    // mainView.router.loadPage('edit_tournament_stats.html');
}

/* ===== Login Page ===== */
$$('#btn-email-login').on('click', function () {
    if (checkInternetConnection() == true ) {
        $$('#btn-email-login').attr('disabled', true);
        $$('#btn-signup-page').attr('disabled', true);
        var txt_username = $$('#txt-log-email-add').val();
        var txt_password = $$("#txt-log-email-pass").val();

        if (txt_username == '' || txt_password == '') {
            myApp.alert('Username or Password cannot be empty');
            $$('#btn-email-login').removeAttr("disabled");
            $$('#btn-signup-page').removeAttr("disabled");
        } else {
            $$.ajax({
                type: "POST",
                url: ENVYP_API_URL + "login.php",
                data: "account=" + txt_username + "&password=" + txt_password,
                dataType: "json",
                success: function(msg, string, jqXHR) {
                    if (msg.status == '0') {
                        localStorage.setItem('account_id', msg.account_id);
                        localStorage.setItem('email', msg.email);
                        localStorage.setItem('first_name', msg.first_name);
                        localStorage.setItem('last_name', msg.last_name);
                        localStorage.setItem('age', msg.age);
                        localStorage.setItem('description', msg.description);
                        localStorage.setItem('account_image', msg.account_image);
                        mainView.router.loadPage('choose_sports.html');
                    } else {
                        myApp.alert(msg.message);
                    }
                    $$('#btn-email-login').removeAttr("disabled");
                    $$('#btn-signup-page').removeAttr("disabled");
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    myApp.alert(ERROR_ALERT);
                    $$('#btn-email-login').removeAttr("disabled");
                    $$('#btn-signup-page').removeAttr("disabled");
                }
            });
        }
    } else {
        myApp.alert(NO_INTERNET_ALERT);
    }
});


$$('#btn-signup-page').on('click', function () {
    mainView.router.loadPage('signup.html');
});

/* ===== Signup Page ===== */
myApp.onPageInit('signup', function(page) {
    $$('#btn-signup').on('click', function() {
        if (checkInternetConnection() == true ) {
            $$('#btn-signup').attr('disabled', true);
            var txt_email_add = $$('#txt-email-add').val();
            var txt_password = $$('#txt-password').val();
            var txt_repeat_password = $$('#txt-repeat-password').val();

            // if (txt_email_add == '') {
            //     myApp.alert('Please enter email!');
            //     $$('#btn-signup').removeAttr("disabled");
            //     return false;
            // }

            // if (validateEmail(txt_email_add) == false) {
            //     myApp.alert('Please enter valid email!');
            //     $$('#btn-signup').removeAttr("disabled");
            //     return false;
            // }

            // if (txt_password == '') {
            //     myApp.alert('Please enter password!');
            //     $$('#btn-signup').removeAttr("disabled");
            //     return false;
            // }

            // if (txt_repeat_password == '') {
            //     myApp.alert('Please repeat the password!');
            //     $$('#btn-signup').removeAttr("disabled");
            //     return false;
            // }

            // if (txt_password != txt_repeat_password) {
            //     myApp.alert('Password is not the same!');
            //     $$('#btn-signup').removeAttr("disabled");
            //     return false;
            // } 

            // if (txt_password.length < 6) {
            //     myApp.alert("min 6 characters, max 50 characters");
            //     $$('#btn-signup').removeAttr("disabled");
            //     return false;
            // }

            // if (txt_password.length > 50) {
            //     myApp.alert("min 6 characters, max 50 characters");
            //     $$('#btn-signup').removeAttr("disabled");
            //     return false;
            // }

            // if (txt_password.search(/\d/) == -1) {
            //     myApp.alert("must contain at least 1 number");
            //     $$('#btn-signup').removeAttr("disabled");
            //     return false;
            // }

            // if (txt_password.search(/[a-zA-Z]/) == -1) {
            //     myApp.alert("must contain at least 1 letter");
            //     $$('#btn-signup').removeAttr("disabled");
            //     return false;
            // }

            // if (txt_password.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\.\,\;\:]/) != -1) {
            //     myApp.alert("character ivalid");
            //     $$('#btn-signup').removeAttr("disabled");
            //     return false;
            // // }

            // if ($('#chkbox-terms').is(':checked') == false) {
            //     myApp.alert("Please agree with the terms and conditions");
            //     $$('#btn-signup').removeAttr("disabled");
            //     return false;
            // } else {
                $$.ajax({
                    type: "POST",
                    url: ENVYP_API_URL + "add_user.php",
                    data: "account=" + txt_email_add + "&password=" + txt_password +"&account_type=1",
                    dataType: "json",
                    success: function(msg, string, jqXHR) {
                        console.log(msg);
                        if (msg.status == '0') {
                            localStorage.setItem('account_id', msg.account_id);
                            mainView.router.loadPage('profile_add.html');         
                        } else {
                            $$('#txt-password').val('');
                            $$('#txt-repeat-password').val('');
                        }
                        myApp.alert(msg.message);
                        $$('#btn-signup').removeAttr("disabled");
                    },
                    error: function(msg, string, jqXHR) { 
                        myApp.alert(ERROR_ALERT);
                        $$('#btn-signup').removeAttr("disabled");
                    }
                });
            // }
        } else {
            myApp.alert(NO_INTERNET_ALERT);
        }
    });
});

/* ===== Add Profile Page ===== */
myApp.onPageInit('profile-add', function(page) {
    $$('#btn-continue').on('click', function() {
        if (checkInternetConnection() == true ) {
            $$('#btn-continue').attr('disabled', true);
            var first_name = $$('#txt-firstname').val();
            var last_name = $$('#txt-lastname').val();
            var age = $$('#txt-age').val();
            var description = $$('#txt-description').val();

            if (first_name == '' || first_name == null) {
                myApp.alert('Please enter first name!');
                $$('#btn-continue').removeAttr("disabled");
                return false;
            }

            if (last_name == '' || last_name == null) {
                myApp.alert('Please enter last name!');
                $$('#btn-continue').removeAttr("disabled");
                return false;
            }

            if (age == '' || age == 0) {
                myApp.alert('Please enter age!');
                $$('#btn-continue').removeAttr("disabled");
                return false;
            }

            $$.ajax({
                type: "POST",
                url: ENVYP_API_URL + "update_user.php",
                data: "account_id=" + localStorage.getItem('account_id') + "&first_name=" + first_name + "&last_name=" + last_name + "&age=" + age + "&description=" + description,
                dataType: "json",
                success: function(msg, string, jqXHR) {
                    if (msg.status == '0') {
                        localStorage.setItem('first_name', first_name);
                        localStorage.setItem('last_name', last_name);
                        localStorage.setItem('age', age);
                        localStorage.setItem('description', description);
                        localStorage.setItem('profile_image', imgfile);
                        if (imgfile != '') {
                            uploadProfilePic(localStorage.getItem('account_id'));
                        }
                        myApp.alert('Welcome ' + first_name + ' ' + last_name + '!');
                        clearLogInDetails();
                        mainView.router.loadPage('choose_sports.html');
                    } else {
                        myApp.alert(msg.message);
                    }
                    $$('#btn-continue').removeAttr("disabled");
                },
                error: function(msg, string, jqXHR) { 
                    myApp.alert(ERROR_ALERT);
                    $$('#btn-continue').removeAttr("disabled");
                }
            });
        } else {
            myApp.alert(NO_INTERNET_ALERT);
        }
    });
});

/* ===== Choose Sports Page ===== */
myApp.onPageInit('choose-sports', function(page) {

});

/* ===== Home Page ===== */
myApp.onPageInit('home', function(page) {
    localStorage.setItem('selectedSportID', page.query.sport_id);
    $$("#img-sport-selected").attr("src", page.query.image_url);
});

/* ===== Team Add Page ===== */
myApp.onPageInit('team-add', function(page) {
    $$('#btn-add-team').on('click', function() {
        if (checkInternetConnection() == true ) {
            $$('#btn-add-team').attr('disabled', true);
            var team_name = $$('#txt-team-name').val();
            var team_description = $$('#txt-team-description').val();
            var team_password = $$('#txt-team-password').val();

            if (team_name == '' || team_name == null) {
                myApp.alert('Please enter team name!');
                $$('#btn-add-team').removeAttr("disabled");
                return false;
            }

            if (team_password == '' || team_password == null) {
                myApp.alert('Please enter team password!');
                $$('#btn-add-team').removeAttr("disabled");
                return false;
            }

            $$.ajax({
                type: "POST",
                url: ENVYP_API_URL + "add_team.php",
                data: "account_id=" + localStorage.getItem('account_id') + "&sport_id=" + localStorage.getItem('selectedSportID') + "&team_name=" + team_name + "&team_description=" + team_description + "&team_password=" + team_password,
                dataType: "json",
                success: function(msg, string, jqXHR) {
                    if (msg.status == '0') {
                        clearTeamDetails();
                        mainView.router.loadPage('team_management.html?team_id='+msg.team_id+'&team_name=' + team_name);  
                    }
                    myApp.alert(msg.message);
                    $$('#btn-add-team').removeAttr("disabled");
                },
                error: function(msg, string, jqXHR) { 
                    myApp.alert(ERROR_ALERT);
                    $$('#btn-add-team').removeAttr("disabled");
                }
            });
        }
    });
});

/* ===== Team List Page ===== */
myApp.onPageInit('team-list', function (page) {
    if (checkInternetConnection() == true ) {
        myApp.showIndicator();
        var items = [];
        $.getJSON(ENVYP_API_URL + "get_team_list.php?sport_id=" + localStorage.getItem('selectedSportID'), function(result) {
            $.each(result, function(i, field) {
                if (field.status == 'empty') {
                    myApp.alert('No teams yet :(');
                } else {
                    items.push({
                        team_id: field.team_id,
                        team_admin: field.team_admin,
                        team_name: field.team_name,
                        team_password: field.team_password,
                        created_by: field.first_name + ' ' + field.last_name
                    });
                }
            });

            var virtualList = myApp.virtualList($$(page.container).find('.virtual-list'), {
                items: items,
                searchAll: function (query, items) {
                    var found = [];
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].team_name.indexOf(query) >= 0 || query.trim() === '') found.push(i);
                    }
                    return found;
                },
                template: '<li>' +
                            '<a href="#" onclick="getTeamPassword({{team_id}},{{team_admin}},\'{{team_name}}\',\'{{team_password}}\')" class="item-link item-content">' +
                              '<div class="item-inner">' +
                                '<div class="item-title-row">' +
                                  '<div class="item-title"><b>{{team_name}}</b></div>' +
                                '</div>' +
                                '<div class="item-subtitle">Administrator: {{created_by}}</div>' +
                              '</div>' +
                            '</a>' +
                          '</li>',
                height: 73,
            });

            myApp.hideIndicator();
        });
    } else {
        myApp.alert(NO_INTERNET_ALERT);
    }
});

/* ===== Team Management Page ===== */
myApp.onPageInit('team-management', function(page) {
    $('#header-team-name').append(page.query.team_name);
    localStorage.setItem('selectedTeamID', page.query.team_id);
    localStorage.setItem('selectedTeamName', page.query.team_name);
    localStorage.setItem('currentTeamAdmin', page.query.team_admin);

    $$('#btn-roster').on('click', function() {
        mainView.router.loadPage('roster_list.html');
    });

    $$('#btn-tournament').on('click', function() {
        mainView.router.loadPage('tournament_list.html');
    });

    $$('#open-right-panel').on('click', function (e) {
        getParticipantList();
        getTeamAdministratorList();
        myApp.openPanel('right');
    });

    $$('#close-right-panel').on('click', function() {
        myApp.closePanel();
    });
});

/* =====Roster List Page ===== */
myApp.onPageInit('roster-list', function (page) {
    if ((localStorage.getItem('currentTeamAdmin') != localStorage.getItem('account_id')) && localStorage.getItem('currentAccountIsTeamAdmin') == 0) {
        $('#btn-show-add-roster').hide();    
    } 

    if (checkInternetConnection() == true ) {
        var items = [];
        $.getJSON(ENVYP_API_URL + "get_roster_list.php?team_id=" + localStorage.getItem('selectedTeamID'), function(result) {
            $.each(result, function(i, field) {
                if (field.status == 'empty') {
                     myApp.alert('No roster yet :(');
                } else {
                    var roster_image = (field.image_url == '' || field.image_url == null ? "img/icon-basketball.png" : field.image_url);
                    items.push({
                        roster_id: field.roster_id,
                        roster_name: field.name,
                        roster_image: roster_image,
                        roster_position: field.position
                    });
                }
            });

            var virtualList = myApp.virtualList($$(page.container).find('.virtual-list'), {
                items: items,
                searchAll: function (query, items) {
                    var found = [];
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].roster_name.indexOf(query) >= 0 || query.trim() === '') found.push(i);
                    }
                    return found; 
                },
                template: '<li>' +
                            '<a href="#" class="item-link item-content">' +
                            '<div class="item-media"><img src="{{roster_image}}" style="width:44px; height:44px;"/></div>' +
                            '<div class="item-inner">' +
                              '<div class="item-title-row">' +
                                '<div class="item-title"><b>{{roster_name}}</b></div>' +
                              '</div>' +
                              '<div class="item-subtitle">{{roster_position}}</div>' +
                            '</div></a></li>',
                height: 62,
            });
        });
    } else {
        myApp.alert(NO_INTERNET_ALERT);
    }
});

/* ===== Roster Add Page ===== */
myApp.onPageInit('roster-add', function (page) {
    $$('#btn-add-roster').on('click', function() {
        if (checkInternetConnection() == true ) {
            $$('#btn-add-roster').attr('disabled', true);
            var roster_name = $$('#txt-roster-name').val();
            var roster_position = $$('#txt-roster-position').val();

            if (roster_name == '' || roster_name == null) {
                myApp.alert('Please enter roster name!');
                $$('#btn-add-roster').removeAttr("disabled");
                return false;
            }

            $$.ajax({
                type: "POST",
                url: ENVYP_API_URL + "add_roster.php",
                data: "account_id=" + localStorage.getItem('account_id') + "&team_id=" + localStorage.getItem('selectedTeamID') + "&roster_name=" + roster_name + "&roster_position=" + roster_position,
                dataType: "json",
                success: function(msg, string, jqXHR) {
                    if (msg.status == '0') {
                        clearRosterDetails();
                        mainView.router.loadPage('roster_list.html');
                    }
                    myApp.alert(msg.message);
                    $$('#btn-add-roster').removeAttr("disabled");
                },
                error: function(msg, string, jqXHR) { 
                    myApp.alert(ERROR_ALERT);
                    $$('#btn-add-roster').removeAttr("disabled");
                }
            });
        }
    });
});

/* =====Participant List Page ===== */
myApp.onPageInit('account-list', function (page) {
    myApp.closePanel();
    var selectedParticipants = new Array();

    if (checkInternetConnection() == true ) {
        var items = [];
        $.getJSON(ENVYP_API_URL + "get_account_list.php?team_id=" + localStorage.getItem('selectedTeamID'), function(result) {
            $.each(result, function(i, field) {
                if (field.status == 'empty') {
                     // myApp.alert('No accounts available :(');
                } else {
                    var account_image = (field.image_url == '' || field.image_url == null ? "img/profile.jpg" : field.image_url);
                    items.push({
                        account_id: field.account_id,
                        account_name: field.first_name + " " +field.last_name,
                        account_image: account_image,
                        account_description: field.account_description
                    });
                }
            });

            var virtualList = myApp.virtualList($$(page.container).find('.virtual-list'), {
                items: items,
                searchAll: function (query, items) {
                    var found = [];
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].account_name.indexOf(query) >= 0 || query.trim() === '') found.push(i);
                    }
                    return found; 
                },
                template: '<li>' +
                                '<label class="label-checkbox item-content">' +
                                '<input id="checkbox-participants" type="checkbox" name="ks-media-checkbox" value="{{account_id}}"/>' +
                                '<div class="item-media"><img src="{{account_image}}" style="width:44px; height:44px;" height="44"/></div>' +
                                '<div class="item-inner">' +
                                  '<div class="item-title-row">' +
                                    '<div class="item-title"><b>{{account_name}}</b></div>' +
                                    '<div class="item-after"><i class="icon icon-form-checkbox"></i></div>' +
                                  '</div>' +
                                  '<div class="item-subtitle">{{account_description}}</div>' +
                                '</div>' +
                              '</label>' +
                            '</li>',
                height: 73,
            });
        });
    } else {
        myApp.alert(NO_INTERNET_ALERT);
    }

    $$('#btn-account-back-tm').on('click', function (e) {
        $("input:checkbox[id=checkbox-participants]:checked").each(function() {
            selectedParticipants.push($(this).val());
        });

        if (selectedParticipants.length != 0) {
            $$.ajax({
                type: "POST",
                url: ENVYP_API_URL + "add_participant.php",
                data: "account_ids=" + selectedParticipants + "&team_id=" + localStorage.getItem('selectedTeamID'),
                dataType: "json",
                success: function(msg, string, jqXHR) {
                    if (msg.status == 0) {
                        getParticipantList();
                    } else {
                        myApp.alert(msg.message);
                    }
                },
                error: function(msg, string, jqXHR) { 
                    myApp.alert(ERROR_ALERT);
                }
            });
        }

        myApp.openPanel('right');
    });
});

/* =====Administrator List Page ===== */
myApp.onPageInit('administrator-list', function (page) {
    myApp.closePanel();
    var selectedAdministrator = new Array();

    if (checkInternetConnection() == true ) {
        var items = [];
        $.getJSON(ENVYP_API_URL + "get_team_participant_list.php?team_id=" + localStorage.getItem('selectedTeamID'), function(result) {
            $.each(result, function(i, field) {
                if (field.status == 'empty') {
                     // myApp.alert('No accounts available :(');
                } else {
                    var account_image = (field.image_url == '' || field.image_url == null ? "img/profile.jpg" : field.image_url);
                    items.push({
                        account_id: field.account_id,
                        account_name: field.first_name + " " +field.last_name,
                        account_image: account_image,
                        account_description: field.account_description
                    });
                }
            });

            var virtualList = myApp.virtualList($$(page.container).find('.virtual-list'), {
                items: items,
                searchAll: function (query, items) {
                    var found = [];
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].account_name.indexOf(query) >= 0 || query.trim() === '') found.push(i);
                    }
                    return found; 
                },
                template: '<li>' +
                                '<label class="label-checkbox item-content">' +
                                '<input id="checkbox-administrator" type="checkbox" name="ks-media-checkbox" value="{{account_id}}"/>' +
                                '<div class="item-media"><img src="{{account_image}}" style="width:44px; height:44px;"/></div>' +
                                '<div class="item-inner">' +
                                  '<div class="item-title-row">' +
                                    '<div class="item-title"><b>{{account_name}}</b></div>' +
                                    '<div class="item-after"><i class="icon icon-form-checkbox"></i></div>' +
                                  '</div>' +
                                  '<div class="item-subtitle">{{account_description}}</div>' +
                                '</div>' +
                              '</label>' +
                            '</li>',
                height: 73,
            });
        });
    } else {
        myApp.alert(NO_INTERNET_ALERT);
    }

    $$('#btn-admin-back-tm').on('click', function (e) {
        $("input:checkbox[id=checkbox-administrator]:checked").each(function() {
            selectedAdministrator.push($(this).val());
        });

        if (selectedAdministrator.length != 0) {
            $$.ajax({
                type: "POST",
                url: ENVYP_API_URL + "add_team_administrator.php",
                data: "account_ids=" + selectedAdministrator + "&team_id=" + localStorage.getItem('selectedTeamID'),
                dataType: "json",
                success: function(msg, string, jqXHR) {
                    if (msg.status == 0) {
                        getTeamAdministratorList();
                    } else {
                        myApp.alert(msg.message);
                    }
                },
                error: function(msg, string, jqXHR) { 
                    myApp.alert(ERROR_ALERT);
                }
            });
        }

        myApp.openPanel('right');
    });
});

/* =====Tournament Add Page ===== */
myApp.onPageInit('tournament-add', function (page) {
    var places = new google.maps.places.Autocomplete(document.getElementById('txt-tournament-location'));
    google.maps.event.addListener(places, 'place_changed', function() {
        place = places.getPlace();
        address = place.formatted_address;
        latitude = place.geometry.location.lat();
        longitude = place.geometry.location.lng();
    });

    $("#txt-tournament-date").val(new Date().toJSON().slice(0,16));

    $$('#btn-add-tournament').on('click', function() {
        if (checkInternetConnection() == true ) {
            $$('#btn-add-tournament').attr('disabled', true);
            var opponent_name = $$('#txt-opponent-name').val();
            var tournament_date = $$('#txt-tournament-date').val();
            var tournament_desc = $$('#txt-tournament-description').val();
            var tournament_location =  $$('#txt-tournament-location').val();

            if (opponent_name == '' || opponent_name == null) {
                myApp.alert('Please enter opponent name!');
                $$('#btn-add-tournament').removeAttr("disabled");
                return false;
            }

            if (longitude == '' || longitude == null) {
                myApp.alert('Please enter a valid location!');
                $$('#btn-add-tournament').removeAttr("disabled");
                return false;
            }

            if (imgfile == '') {
                 $$.ajax({
                    type: "POST",
                    url: ENVYP_API_URL + "add_tournament.php",
                    data: "account_id=" + localStorage.getItem('account_id') + "&team_id=" + localStorage.getItem('selectedTeamID') + "&opponent=" + opponent_name + "&tournament_date=" + tournament_date + "&tournament_desc=" + tournament_desc + "&tournament_location=" + tournament_location + "&longitude=" + longitude + "&latitude=" + latitude,
                    dataType: "json",
                    success: function(msg, string, jqXHR) {
                        if (msg.status == '0') {
                            clearTournamentDetails();
                            mainView.router.loadPage('tournament_list.html');
                        }
                        myApp.alert(msg.message);
                        $$('#btn-add-tournament').removeAttr("disabled");
                    },
                    error: function(msg, string, jqXHR) { 
                        myApp.alert(ERROR_ALERT);
                        $$('#btn-add-tournament').removeAttr("disabled");
                    }
                });
            } else {
                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = imgfile.substr(imgfile.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                options.chunkedMode = false;

                var params = new Object();
                params.account_id = localStorage.getItem('account_id');
                params.team_id = localStorage.getItem('selectedTeamID');
                params.opponent = opponent_name;
                params.tournament_date = tournament_date;
                params.tournament_desc = tournament_desc;
                params.tournament_location = tournament_location;
                params.longitude = longitude;
                params.latitude = latitude;

                options.params = params;

                var ft = new FileTransfer();
                ft.upload(imgfile, ENVYP_API_URL + "add_tournament.php", winAddTournament, failAddTournament, options);

                clearTournamentDetails();
                $$('#btn-add-tournament').removeAttr("disabled");
                mainView.router.loadPage('tournament_list.html');
            }
            
        }
    });
});

function attachTournamentImage(imageURI) {
    imgfile = imageURI
    $$("#tournament-image").attr("src", imgfile);
} 

function winAddTournament(r) {
    var resp = JSON.parse(r.response);
    myApp.alert(resp.message);
}

function failAddTournament(error) {
    myApp.alert("An error has occurred with error code " + error.code + ", please try again.");
}

/* =====Tournament List Page ===== */
myApp.onPageInit('tournament-list', function (page) {
    if (checkInternetConnection() == true ) {
        var items = [];
        $.getJSON(ENVYP_API_URL + "get_tournament_list.php?team_id=" + localStorage.getItem('selectedTeamID'), function(result) {
            $.each(result, function(i, field) {
                if (field.status == 'empty') {
                     myApp.alert('No tournament yet :(');
                } else {
                    var tournament_image = (field.image_url == '' || field.image_url == null ? "img/icon-basketball.png" : field.image_url);
                    items.push({
                        tournament_id: field.tournament_id,
                        opponent: field.opponent,
                        tournament_date: field.tournament_date,
                        tournament_image: tournament_image
                    });
                }
            });

            var virtualList = myApp.virtualList($$(page.container).find('.virtual-list'), {
                items: items,
                searchAll: function (query, items) {
                    var found = [];
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].roster_name.indexOf(query) >= 0 || query.trim() === '') found.push(i);
                    }
                    return found; 
                },
                template: '<li>' +
                            '<a href="tournament_detail.html?tournament_id={{tournament_id}}" class="item-link item-content">' +
                            '<div class="item-media"><img src="{{tournament_image}}" style="width:44px; height:44px;"/></div>' +
                            '<div class="item-inner">' +
                              '<div class="item-title-row">' +
                                '<div class="item-title"><b>{{opponent}}</b></div>' +
                              '</div>' +
                              '<div class="item-subtitle">{{tournament_date}}</div>' +
                            '</div></a></li>',
                height: 73,
            });
        });
    } else {
        myApp.alert(NO_INTERNET_ALERT);
    }
});

/* =====Tournament Detail Page ===== */
myApp.onPageInit('tournament-detail', function (page) {
    localStorage.setItem('selectedTournamentId', page.query.tournament_id);
    $.getJSON(ENVYP_API_URL + "get_tournament_detail.php?tournament_id=" + localStorage.getItem('selectedTournamentId'), function(result) {
        $.each(result, function(i, field) {
            $('#tournament-name').prepend(field.opponent);
            $('#txt-opponent-name').prepend(field.opponent);
            $('#txt-tournament-location').prepend(field.location);
            $('#txt-tournament-date').prepend(field.tournament_date);
            $('#txt-tournament-description').prepend(field.description);
        });
    });

    $("#txt-tournament-location").height( $("#txt-tournament-location")[0].scrollHeight);
    $("#txt-tournament-date").height( $("#txt-tournament-location")[0].scrollHeight);
    $("#txt-tournament-description").height( $("#txt-tournament-description")[0].scrollHeight);

    $$('#roster').on('show', function () {
        $("#roster_list").empty();
        myApp.showIndicator();
        $.getJSON(ENVYP_API_URL + "get_roster_list.php?team_id=" + localStorage.getItem('selectedTeamID'), function(result) {
            $.each(result, function(i, field) {
                if (field.status == 'empty') {
                    $("#roster_list").append('<li><center><p>No roster</p><center></li>');
                } else {
                    if (field.image_url == '' || field.image_url == null) {
                        var image_url = "<img src='img/profile.jpg' class='img-circle' style='width:44px; height:44px;'>";
                    } else {
                        var image_url = "<img data-src='" + field.image_url + "' class='lazy lazy-fadein' style='width:44px; height:44px;'>";
                    }
                    $("#roster_list").append('<li>' +
                            '<a href="roster_tournament_stats.html?roster_id='+field.roster_id+'&roster_name='+field.name+'&roster_position='+field.position+'&roster_image='+field.image_url+'" class="item-link item-content">' +
                            '<div class="item-media">'+ image_url +'</div>' +
                            '<div class="item-inner">' +
                              '<div class="item-title-row">' +
                                '<div class="item-title"><b>'+ field.name +'</b></div>' +
                              '</div>' +
                              '<div class="item-subtitle">'+ field.position +'</div>' +
                            '</div></a></li>');
                }
            });    
            myApp.initImagesLazyLoad(page.container);
            myApp.hideIndicator();    
        });
    });

    $$('#stats').on('show', function () {
        myApp.showIndicator();

        var team_name = '';
        var team_points = 0;
        var team_assists = 0;
        var team_fouls = 0;
        var opponent_name = '';
        var opponent_points = 0;
        var opponent_assists = 0;
        var opponent_fouls = 0;

        $('#team-name').empty();
        $('#opponent-name').empty();
        $('#team-points').empty();
        $('#opponent-points').empty();
        $('#team-assists').empty();
        $('#opponent-assists').empty();
        $('#team-fouls').empty();
        $('#opponent-fouls').empty();

        $.getJSON(ENVYP_API_URL + "get_tournament_stats.php?tournament_id=" + localStorage.getItem('selectedTournamentId'), function(result) {
            $.each(result, function(i, field) {
                team_name = localStorage.getItem('selectedTeamName');
                team_points = field.team_points;
                team_assists = field.team_assists;
                team_fouls = field.team_fouls;
                opponent_name = field.opponent;
                opponent_points = field.opponent_points;
                opponent_assists = field.opponent_assists;
                opponent_fouls = field.opponent_fouls;
            }); 

            $$('#team-name').prepend(team_name);
            $$('#opponent-name').prepend(opponent_name);
            $$('#team-points').prepend(team_points);
            $$('#opponent-points').prepend(opponent_points);
            $$('#team-assists').prepend(team_assists);
            $$('#opponent-assists').prepend(opponent_assists);
            $$('#team-fouls').prepend(team_fouls);
            $$('#opponent-fouls').prepend(opponent_fouls);

            myApp.hideIndicator();    
        });

        $$('#btn-edit-team-stats').on('click', function() {
            mainView.router.loadPage('edit_tournament_stats.html?team_name='+team_name+'&opponent_name='+opponent_name+'&team_points='+team_points+'&opponent_points='+opponent_points+'&team_assists='+team_assists+'&opponent_assists='+opponent_assists+'&team_fouls='+team_fouls+'&opponent_fouls='+opponent_fouls);
        });
    });
}); 

/* =====Roster Tournament Stats Page ===== */
myApp.onPageInit('roster-tournament-stats', function (page) {
    var points = 0;
    var assists = 0;
    var fouls = 0;
    var votes = 0;

    $$("#roster-image").attr("data-src",(page.query.roster_image == '' || page.query.roster_image == null ? "img/profile.jpg" : page.query.roster_image));
    $$("#roster-image").addClass('lazy lazy-fadein');
    myApp.initImagesLazyLoad(page.container);

    $$('#roster-name').prepend(page.query.roster_name);
    $$('#roster-position').prepend(page.query.roster_position);

    myApp.showIndicator();
    $.getJSON(ENVYP_API_URL + "get_roster_tournament_stats.php?tournament_id=" + localStorage.getItem('selectedTournamentId') + '&roster_id=' + page.query.roster_id, function(result) {
        $.each(result, function(i, field) {
            points = field.points
            assists = field.assists
            fouls = field.fouls
            votes = field.votes
        }); 

        $$('#roster-points').prepend(points);
        $$('#roster-assists').prepend(assists);
        $$('#roster-fouls').prepend(fouls);
        $$('#roster-votes').prepend(votes);

        myApp.hideIndicator();    
    });

    $$('#btn-edit-roster-stats').on('click', function() {
        mainView.router.loadPage('edit_roster_tournament_stats.html?roster_image='+page.query.roster_image+'&roster_id='+page.query.roster_id+'&roster_name='+page.query.roster_name+'&roster_position='+page.query.roster_position+'&points='+points+'&assists='+assists+'&fouls='+fouls);
    });
});

/* =====Edit Roster Tournament Stats Page ===== */
myApp.onPageInit('edit-roster-tournament-stats', function (page) {
    $$("#edit-roster-image").attr("data-src",(page.query.roster_image == '' || page.query.roster_image == null ? "img/profile.jpg" : page.query.roster_image));
    $$("#edit-roster-image").addClass('lazy lazy-fadein');
    myApp.initImagesLazyLoad(page.container);

    $$('#edit-roster-name').prepend(page.query.roster_name);
    $$('#edit-roster-position').prepend(page.query.roster_position);

    $$("#edit-roster-points").attr("value",page.query.points);
    $$("#edit-roster-assists").attr("value",page.query.assists);
    $$("#edit-roster-fouls").attr("value",page.query.fouls);

    $$('#btn-update-roster-stats').on('click', function() {
        if (checkInternetConnection() == true ) {
            $$('#btn-update-roster-stats').attr('disabled', true);
            var roster_points = $$('#edit-roster-points').val();
            var roster_assists = $$('#edit-roster-assists').val();
            var roster_fouls = $$('#edit-roster-fouls').val();

            if (roster_points == '' || roster_points == null) {
                myApp.alert('Please enter points!');
                $$('#btn-update-roster-stats').removeAttr("disabled");
                return false;
            }

            if (roster_assists == '' || roster_assists == null) {
                myApp.alert('Please enter assists!');
                $$('#btn-update-roster-stats').removeAttr("disabled");
                return false;
            }

            if (roster_fouls == '' || roster_fouls == null) {
                myApp.alert('Please enter fouls!');
                $$('#btn-update-roster-stats').removeAttr("disabled");
                return false;
            }

            $$.ajax({
                type: "POST",
                url: ENVYP_API_URL + "update_roster_tournament_stats.php",
                data: "account_id=" + localStorage.getItem('account_id') + "&tournament_id=" + localStorage.getItem('selectedTournamentId') + "&roster_id=" + page.query.roster_id + "&points=" + roster_points + "&assists=" + roster_assists + "&fouls=" + roster_fouls,
                dataType: "json",
                success: function(msg, string, jqXHR) {
                    if (msg.status == '0') {
                        mainView.router.loadPage('tournament_detail.html?tournament_id=' + localStorage.getItem('selectedTournamentId'));
                    }
                    myApp.alert(msg.message);
                    $$('#btn-update-roster-stats').removeAttr("disabled");
                },
                error: function(msg, string, jqXHR) { 
                    myApp.alert(ERROR_ALERT);
                    $$('#btn-update-roster-stats').removeAttr("disabled");
                }
            });
        }    
    });
});

/* =====Edit Tournament Stats Page ===== */
myApp.onPageInit('edit-tournament-stats', function (page) {
    $$('#txt-edit-team-name').prepend("Team: <b>" + page.query.team_name + "</b>");
    $$('#txt-edit-opponent-name').prepend("Opponent: <b>" + page.query.opponent_name + "</b>");
    $$('#txt-edit-team-points').attr("value",page.query.team_points);
    $$('#txt-edit-team-assists').attr("value",page.query.team_assists);
    $$('#txt-edit-team-fouls').attr("value",page.query.team_fouls);
    $$('#txt-edit-opponent-points').attr("value",page.query.opponent_points);
    $$('#txt-edit-opponent-assists').attr("value",page.query.opponent_assists);
    $$('#txt-edit-opponent-fouls').attr("value",page.query.opponent_fouls);

    $$('#btn-update-tournament-stats').on('click', function() {
        if (checkInternetConnection() == true ) {
            $$('#btn-update-tournament-stats').attr('disabled', true);
            var team_points = $$('#txt-edit-team-points').val();
            var team_assists = $$('#txt-edit-team-assists').val();
            var team_fouls = $$('#txt-edit-team-fouls').val();
            var opponent_points = $$('#txt-edit-opponent-points').val();
            var opponent_assists = $$('#txt-edit-opponent-assists').val();
            var opponent_fouls = $$('#txt-edit-opponent-fouls').val();

            if (team_points == '' || team_points == null) {
                myApp.alert('Please enter team points!');
                $$('#btn-update-tournament-stats').removeAttr("disabled");
                return false;
            }

            if (team_assists == '' || team_assists == null) {
                myApp.alert('Please enter team assists!');
                $$('#btn-update-tournament-stats').removeAttr("disabled");
                return false;
            }

            if (team_fouls == '' || team_fouls == null) {
                myApp.alert('Please enter team fouls!');
                $$('#btn-update-tournament-stats').removeAttr("disabled");
                return false;
            }

            if (opponent_points == '' || opponent_points == null) {
                myApp.alert('Please enter opponent points!');
                $$('#btn-update-tournament-stats').removeAttr("disabled");
                return false;
            }

            if (opponent_assists == '' || opponent_assists == null) {
                myApp.alert('Please enter oponent assists!');
                $$('#btn-update-tournament-stats').removeAttr("disabled");
                return false;
            }

            if (opponent_fouls == '' || opponent_fouls == null) {
                myApp.alert('Please enter opponent fouls!');
                $$('#btn-update-tournament-stats').removeAttr("disabled");
                return false;
            }

            $$.ajax({
                type: "POST",
                url: ENVYP_API_URL + "update_tournament_stats.php",
                data: "account_id=" + localStorage.getItem('account_id') + 
                        "&tournament_id=" + localStorage.getItem('selectedTournamentId') + 
                        "&team_points=" + team_points + 
                        "&team_assists=" + team_assists + 
                        "&team_fouls=" + team_fouls + 
                        "&opponent_points=" + opponent_points + 
                        "&opponent_assists=" + opponent_assists + 
                        "&opponent_fouls=" + opponent_fouls,
                dataType: "json",
                success: function(msg, string, jqXHR) {
                    if (msg.status == '0') {
                        mainView.router.loadPage('tournament_detail.html?tournament_id=' + localStorage.getItem('selectedTournamentId'));
                    }
                    myApp.alert(msg.message);
                    $$('#btn-update-tournament-stats').removeAttr("disabled");
                },
                error: function(msg, string, jqXHR) { 
                    myApp.alert(ERROR_ALERT);
                    $$('#btn-update-tournament-stats').removeAttr("disabled");
                }
            });
        }    
    });
});

function getTournamentImage() {
    myApp.modal({
        title:  'Choose Tournament Image',
        verticalButtons: true,
        buttons: [
          {
            text: 'Take new picture',
            onClick: function() {
                try {
                    navigator.camera.getPicture(attachTournamentImage, function(message) {
                        myApp.alert('No image selected');
                    }, {
                        quality: 100,
                        destinationType: navigator.camera.DestinationType.FILE_URI,
                        sourceType: navigator.camera.PictureSourceType.CAMERA,
                        targetWidth: 400,
                        targetHeight: 400,
                        correctOrientation: true
                    });
                } catch(err) {
                    myApp.alert('camera error: ' + err.message);
                }
            }
          },
          {
            text: 'Select from gallery',
            onClick: function() {
                try {
                    navigator.camera.getPicture(attachTournamentImage, function(message) {
                        myApp.alert('No image selected');
                    }, {
                        quality: 100,
                        destinationType: navigator.camera.DestinationType.FILE_URI,
                        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                        targetWidth: 400,
                        targetHeight: 400,
                        correctOrientation: true
                    });
                } catch(err) {
                    myApp.alert('camera error: ' + err.message);
                }
            }
          },
          {
            text: 'Cancel',
            onClick: function() {
            }
          }
        ]
    });
}

function getTeamPassword(team_id, team_admin, team_name, team_password) {
    if (team_admin != localStorage.getItem('account_id')) {
        isAccountInvited(team_id, function(response) {
            if (response.status == true) {
                myApp.prompt('Please enter a password', function (data) {
                    if (data == team_password) {
                        localStorage.setItem('currentAccountIsTeamAdmin', response.is_admin);
                        mainView.router.loadPage('team_management.html?team_id='+team_id+'&team_name='+team_name+'&team_admin='+team_admin);
                    } else {
                        myApp.alert('Incorrect team password!');
                    }
                });
            } else {
                myApp.alert('You are not invited on this event');
            }
        }) 
    } else {
        mainView.router.loadPage('team_management.html?team_id='+team_id+'&team_name='+team_name+'&team_admin='+team_admin);
    }
}

function isAccountInvited(team_id, callback) {
    $$.ajax({
        type: "POST",
        url: ENVYP_API_URL + "check_if_account_invited.php",
        data: "account_id=" + localStorage.getItem('account_id') + "&team_id=" + team_id,
        dataType: "json",
        success: function(msg, string, jqXHR) {
            callback(msg);
        },
        error: function(msg, string, jqXHR) { 
        }
    }); 
} 

function getParticipantList() {
    $("#list-view-participants").empty();

    if ((localStorage.getItem('currentTeamAdmin') == localStorage.getItem('account_id')) || localStorage.getItem('currentAccountIsTeamAdmin') == 1) {
        $("#list-view-participants").prepend('<li>' +
                                            '<div class="item-content">' +
                                              '<div class="item-inner">' +
                                                '<div class="item-title"><a href="account_list.html" class="link"><font size="2">Add participant</font></a></div>' +
                                              '</div>' +
                                            '</div>' +
                                          '</li>');   
    }

    var items = [];
    $.getJSON(ENVYP_API_URL + "get_participant_list.php?team_id=" + localStorage.getItem('selectedTeamID'), function(result) {
        $.each(result, function(i, field) {
            if (field.status == 'empty') {
                 $("#list-view-participants").append('<li>' +
                                            '<div class="item-content">' +
                                              '<div class="item-inner">' +
                                                '<div class="item-title"><font size="2">No participants</font></div>' +
                                              '</div>' +
                                            '</div>' +
                                          '</li>');
            } else {
                var account_image = (field.image_url == '' || field.image_url == null ? "img/profile.jpg" : field.image_url);
                $("#list-view-participants").append('<li>' +
                                                      '<div class="item-content">' +
                                                        '<div class="item-media"><img src="'+account_image+'" style="width:44px; height:44px;"/></div>' +
                                                        '<div class="item-inner">' +
                                                          '<div class="item-title-row">' +
                                                            '<div class="item-title">' + field.first_name + ' ' + field.last_name + '</div>' +
                                                            '<div class="item-after"><a href="#" onClick="removeParticipant(' + field.account_id + ');" class="link icon-only link-remove-participant"><i class="fa fa-times" aria-hidden="true"></i></a></div>' +
                                                          '</div>' +
                                                          '<div class="item-subtitle">' + field.account_description + '</div>' +
                                                        '</div>' +
                                                      '</div>' +
                                                    '</li>');
            }

            if ((localStorage.getItem('currentTeamAdmin') != localStorage.getItem('account_id')) && localStorage.getItem('currentAccountIsTeamAdmin') == 0) {
                $('.link-remove-participant').hide();    
            } 
        });
    });
}

function getTeamAdministratorList() {
    $("#list-view-administrator").empty();

    if ((localStorage.getItem('currentTeamAdmin') == localStorage.getItem('account_id')) || localStorage.getItem('currentAccountIsTeamAdmin') == 1) {
        $("#list-view-administrator").prepend('<li>' +
                                                '<div class="item-content">' +
                                                  '<div class="item-inner">' +
                                                    '<div class="item-title"><a href="administrator_list.html" class="link"><font size="2">Add administrator</font></a></div>' +
                                                  '</div>' +
                                                '</div>' +
                                              '</li>');
    }

    var items = [];
    $.getJSON(ENVYP_API_URL + "get_team_administrator_list.php?team_id=" + localStorage.getItem('selectedTeamID'), function(result) {
        $.each(result, function(i, field) {
            if (field.status == 'empty') {
                 $("#list-view-administrator").append('<li>' +
                                            '<div class="item-content">' +
                                              '<div class="item-inner">' +
                                                '<div class="item-title"><font size="2">No administrator</font></div>' +
                                              '</div>' +
                                            '</div>' +
                                          '</li>');
            } else {
                var account_image = (field.image_url == '' || field.image_url == null ? "img/profile.jpg" : field.image_url);
                $("#list-view-administrator").append('<li>' +
                                                      '<div class="item-content">' +
                                                        '<div class="item-media"><img src="'+account_image+'" style="width:44px; height:44px;"/></div>' +
                                                        '<div class="item-inner">' +
                                                          '<div class="item-title-row">' +
                                                            '<div class="item-title">' + field.first_name + ' ' + field.last_name + '</div>' +
                                                            '<div class="item-after"><a href="#" onClick="removeAsAdministrator(' + field.account_id + ');" class="link icon-only link-remove-administrator"><i class="fa fa-times" aria-hidden="true"></i></a></div>' +
                                                          '</div>' +
                                                          '<div class="item-subtitle">' + field.account_description + '</div>' +
                                                        '</div>' +
                                                      '</div>' +
                                                    '</li>');
            }

            if ((localStorage.getItem('currentTeamAdmin') != localStorage.getItem('account_id')) && localStorage.getItem('currentAccountIsTeamAdmin') == 0) {
                $('.link-remove-administrator').hide();    
            } 
        });
    });
}

function removeParticipant(account_id) {
    $$.ajax({
        type: "POST",
        url: ENVYP_API_URL + "delete_participant.php",
        data: "account_id=" + account_id,
        dataType: "json",
        success: function(msg, string, jqXHR) {
            if (msg.status == 0) {
                getParticipantList();
                getTeamAdministratorList();
            } else {
                console.log(msg.message);
            }
        },
        error: function(msg, string, jqXHR) { 
            myApp.alert(ERROR_ALERT);
        }
    });
}

function removeAsAdministrator(account_id) {
    $$.ajax({
        type: "POST",
        url: ENVYP_API_URL + "delete_administrator.php",
        data: "account_id=" + account_id + "&team_id=" + localStorage.getItem('selectedTeamID'),
        dataType: "json",
        success: function(msg, string, jqXHR) {
            if (msg.status == 0) {
                getParticipantList();
                getTeamAdministratorList();
            } else {
                console.log(msg.message);
            }
        },
        error: function(msg, string, jqXHR) { 
            myApp.alert(ERROR_ALERT);
        }
    });
}

function clearLogInDetails() {
    $$('#txt-log-email-add').val('');
    $$('#txt-log-email-pass').val('');
    $$('#txt-email-add').val('');
    $$('#txt-password').val('');
    $$('#txt-repeat-password').val('');
    $$('#txt-firstname').val('');
    $$('#txt-lastname').val('');
    $$('#txt-age').val('');
    $$('#txt-description').val('');
    imgfile = '';
}

function clearTeamDetails() {
    $$('#txt-team-name').val('');
    $$('#txt-team-description').val('');
}

function clearRosterDetails() {
    $$('#txt-roster-name').val('');
    $$('#txt-roster-position').val('');
}

function clearTournamentDetails() {
    $("#txt-tournament-date").val(new Date().toJSON().slice(0,16));
    $$('#txt-opponent-name').val('');
    $$('#txt-tournament-description').val('');
    imgfile = '';
}

function validateEmail(sEmail) {
    var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
    if (filter.test(sEmail)) {
        return true;
    } else {
        return false;
    }
}

function checkInternetConnection() {
    // try {
    //     if (DEBUG == false) {
    //         var state = navigator.connection.type;
    //         if (state == 'none') {
    //             return false;
    //         } else {
    //             return true;
    //         }
    //     } else {
    //         return true;
    //     }
    // } catch (err) { 
    //     return true;
    // }
    return true;
}
