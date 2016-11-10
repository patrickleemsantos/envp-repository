// Init App
var myApp = new Framework7({
    modalTitle: 'Envyp',
    // Enable Material theme
    material: true,
    preloadPreviousPage: false,
    fastClicks: true
});

// Expose Internal DOM library
var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: false
});

// const ENVYP_API_URL = 'http://patricks-macbook-air.local/envyp/api/';
const ENVYP_API_URL = 'http://115.85.17.61/envyp/';
const NO_INTERNET_ALERT = 'Please check your internet connection';
const ERROR_ALERT = 'An error occured, please try again.';

var imgfile = '';

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    console.log(FileTransfer);
}

// Show/hide preloader for remote ajax loaded pages
// Probably should be removed on a production/local app
$$(document).on('ajaxStart', function (e) {
    if (e.detail.xhr.requestUrl.indexOf('autocomplete-languages.json') >= 0) {
        // Don't show preloader for autocomplete demo requests
        return;
    }
    myApp.showIndicator();
});
$$(document).on('ajaxComplete', function (e) {
    if (e.detail.xhr.requestUrl.indexOf('autocomplete-languages.json') >= 0) {
        // Don't show preloader for autocomplete demo requests
        return;
    }
    myApp.hideIndicator();
});

if (localStorage.getItem('account_id') != null) {
    mainView.router.loadPage('choose_sports.html');
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
    $("#txt-tournament-date").val(new Date().toJSON().slice(0,16));

    $$('#btn-add-tournament').on('click', function() {
        if (checkInternetConnection() == true ) {
            $$('#btn-add-tournament').attr('disabled', true);
            var opponent_name = $$('#txt-opponent-name').val();
            var tournament_date = $$('#txt-tournament-date').val();
            var tournament_desc = $$('#txt-tournament-description').val();

            if (opponent_name == '' || opponent_name == null) {
                myApp.alert('Please enter opponent name!');
                $$('#btn-add-tournament').removeAttr("disabled");
                return false;
            }

            if (imgfile == '') {
                 $$.ajax({
                    type: "POST",
                    url: ENVYP_API_URL + "add_tournament.php",
                    data: "account_id=" + localStorage.getItem('account_id') + "&team_id=" + localStorage.getItem('selectedTeamID') + "&opponent=" + opponent_name + "&tournament_date=" + tournament_date + "&tournament_desc=" + tournament_desc,
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
    myApp.alert(r.response.message);
    console.log("tournament upload code = " + r.responseCode);
    console.log("tournament upload response = " + r.response);
    console.log("tournament upload sent = " + r.bytesSent);
}

function failAddTournament(error) {
    myApp.alert("An error has occurred with error code " + error.code + ", please try again.");
    console.log("tournament upload error code " + error.code);
    console.log("tournament upload error source " + error.source);
    console.log("tournament upload error target " + error.target);
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
                            '<a href="#" class="item-link item-content">' +
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
