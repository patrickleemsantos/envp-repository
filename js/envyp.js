var myApp = new Framework7({
    modalTitle: 'Envp',
    material: true,
    preloadPreviousPage: false,
    fastClicks: true
});

var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: false
});

// const ENVYP_API_URL = 'http://patricks-macbook-air.local/envyp/api/';
const ENVYP_API_URL = 'http://envp.dk/api/';
const NO_INTERNET_ALERT = 'Please check your internet connection';
const AJAX_ERROR_ALERT = 'Network error, please try again.';
const ERROR_ALERT = 'An error occured, please try again.';

var imgfile = '';
var latitude = '';
var longitude = '';
var edit_latitude = '';
var edit_longitude = '';
localStorage.setItem('selectedLanguage', '2');

function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
}

function onBackKeyDown() {
    myApp.alert('Back is clicked!');
    var view=myApp.getCurrentView();
    if($$('.popup.popup-login').length){
        return false;
    } else if($$('.popover, .actions-modal, .picker-modal').length){
        myApp.closeModal('.popover, .actions-modal, .picker-modal'); 
    } else if($$('.searchbar.searchbar-active').length){
        $$('.searchbar.searchbar-active')[0].f7Searchbar.disable();
    } else if($$('.photo-browser').length){
        $$('.photo-browser .photo-browser-close-link, .photo-browser .close-popup')
        .trigger('click');
    } else if($$('.popup').length && $$('.popup .view')[0].f7View){
        if($$('.popup .view')[0].f7View.history.length>1){
          view.router.back();
        }else{
            myApp.closeModal('.popup');
        }
    } else if($$('.popup').length){
        myApp.closeModal('.popup'); 
    } else if(view.history.length){
        view.router.back();
    }
}

$(document).on({
    'DOMNodeInserted': function() {
        $('.pac-item, .pac-item span', this).addClass('no-fastclick');
    }
}, '.pac-container');

if (localStorage.getItem('account_id') != '' && localStorage.getItem('account_id') != null) {
    $$('#div-profile-name').prepend(localStorage.getItem('first_name') + ' ' + localStorage.getItem('last_name'));
    $$('#img-profile-image').attr('src', (localStorage.getItem('account_image') == '' || localStorage.getItem('account_image') == null ? "img/profile.jpg" : localStorage.getItem('account_image')));
    mainView.router.loadPage('choose_sports.html');
}

if (localStorage.getItem('selectedLanguage') == '1') {
    $('#lbl-profile').empty();
    $('#lbl-profile').prepend('Profile');
    $('#btn-edit-profile').empty();
    $('#btn-edit-profile').prepend('Edit Profile');
    $('#btn-choose-language').empty();
    $('#btn-choose-language').prepend('Language');
    $('#btn-logout').empty();
    $('#btn-logout').prepend('Logout');
    $('#lbl-team-settings').empty();
    $('#lbl-team-settings').prepend('Settings');
    $('#lbl-team-participants').empty();
    $('#lbl-team-participants').prepend('Participants');
    $('#lbl-team-administrators').empty();
    $('#lbl-team-administrators').prepend('Administrators');
} else {
    $('#lbl-profile').empty();
    $('#lbl-profile').prepend('Profil');
    $('#btn-edit-profile').empty();
    $('#btn-edit-profile').prepend('Rediger profil');
    $('#btn-choose-language').empty();
    $('#btn-choose-language').prepend('Sprog');
    $('#btn-logout').empty();
    $('#btn-logout').prepend('Log ud');
    $('#lbl-team-settings').empty();
    $('#lbl-team-settings').prepend('Indstillinger');
    $('#lbl-team-participants').empty();
    $('#lbl-team-participants').prepend('Deltagere');
    $('#lbl-team-administrators').empty();
    $('#lbl-team-administrators').prepend('Administratorer');
}

/* ===== Main Page ===== */
$$('#btn-email-login').on('click', function() {
    if (checkInternetConnection() == true) {
        $$('#btn-email-login').attr('disabled', true);
        $$('#btn-signup-page').attr('disabled', true);
        var txt_username = $$('#txt-log-email-add').val();
        var txt_password = $$("#txt-log-email-pass").val();

        if (txt_username == '' || txt_password == '') {
            myApp.alert('Username or Password cannot be empty');
            $$('#btn-email-login').removeAttr("disabled");
            $$('#btn-signup-page').removeAttr("disabled");
        } else {
            myApp.showIndicator();
            $$.ajax({
                type: "POST",
                url: ENVYP_API_URL + "login.php",
                data: "account=" + txt_username + "&password=" + txt_password,
                dataType: "json",
                success: function(msg, string, jqXHR) {
                    myApp.hideIndicator();
                    if (msg.status == '0') {
                        localStorage.setItem('account_id', msg.account_id);
                        localStorage.setItem('email', msg.email);
                        localStorage.setItem('first_name', msg.first_name);
                        localStorage.setItem('last_name', msg.last_name);
                        localStorage.setItem('age', msg.age);
                        localStorage.setItem('description', msg.description);
                        localStorage.setItem('account_image', msg.account_image);

                        $$('#div-profile-name').prepend(localStorage.getItem('first_name') + ' ' + localStorage.getItem('last_name'));
                        $$('#img-profile-image').attr('src', (localStorage.getItem('account_image') == '' || localStorage.getItem('account_image') == null ? "img/profile.jpg" : localStorage.getItem('account_image')));

                        mainView.router.loadPage('choose_sports.html');
                    } else {
                        myApp.alert(msg.message);
                    }
                    $$('#btn-email-login').removeAttr("disabled");
                    $$('#btn-signup-page').removeAttr("disabled");
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    myApp.hideIndicator();
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

$$('#btn-signup-page').on('click', function() {
    mainView.router.loadPage('signup.html');
});

$$('#btn-logout').on('click', function() {
    myApp.closePanel('left');
    localStorage.setItem('account_id', '');
    $('#div-profile-name').empty();
    $('#img-profile-image').empty();
    FBLogout();
    mainView.router.loadPage('main.html');
});

$$('#btn-edit-profile').on('click', function() {
    myApp.closePanel('left');
    mainView.router.loadPage('profile_add.html?account_id=' + localStorage.getItem('account_id') + '&first_name=' + localStorage.getItem('first_name') + '&last_name=' + localStorage.getItem('last_name') + '&age=' + localStorage.getItem('age') + '&description=' + localStorage.getItem('description') + '&image_url=' + localStorage.getItem('account_image'));
});

myApp.onPageInit('main', function(page) {
    $$('#btn-email-login').on('click', function() {
        if (checkInternetConnection() == true) {
            $$('#btn-email-login').attr('disabled', true);
            $$('#btn-signup-page').attr('disabled', true);
            var txt_username = $$('#txt-log-email-add').val();
            var txt_password = $$("#txt-log-email-pass").val();

            if (txt_username == '' || txt_password == '') {
                myApp.alert('Username or Password cannot be empty');
                $$('#btn-email-login').removeAttr("disabled");
                $$('#btn-signup-page').removeAttr("disabled");
            } else {
                myApp.showIndicator();
                $$.ajax({
                    type: "POST",
                    url: ENVYP_API_URL + "login.php",
                    data: "account=" + txt_username + "&password=" + txt_password,
                    dataType: "json",
                    success: function(msg, string, jqXHR) {
                        myApp.hideIndicator();
                        if (msg.status == '0') {
                            localStorage.setItem('account_id', msg.account_id);
                            localStorage.setItem('email', msg.email);
                            localStorage.setItem('first_name', msg.first_name);
                            localStorage.setItem('last_name', msg.last_name);
                            localStorage.setItem('age', msg.age);
                            localStorage.setItem('description', msg.description);
                            localStorage.setItem('account_image', msg.account_image);

                            $$('#div-profile-name').prepend(localStorage.getItem('first_name') + ' ' + localStorage.getItem('last_name'));
                            $$('#img-profile-image').attr('src', (localStorage.getItem('account_image') == '' || localStorage.getItem('account_image') == null ? "img/profile.jpg" : localStorage.getItem('account_image')));

                            mainView.router.loadPage('choose_sports.html');
                        } else {
                            myApp.alert(msg.message);
                        }
                        $$('#btn-email-login').removeAttr("disabled");
                        $$('#btn-signup-page').removeAttr("disabled");
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        myApp.hideIndicator();
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

    $$('#btn-signup-page').on('click', function() {
        mainView.router.loadPage('signup.html');
    });
});

/* ===== Signup Page ===== */
myApp.onPageInit('signup', function(page) {
    $$('#btn-signup').on('click', function() {
        if (checkInternetConnection() == true) {
            $$('#btn-signup').attr('disabled', true);
            var txt_email_add = $$('#txt-email-add').val();
            var txt_password = $$('#txt-password').val();
            var txt_repeat_password = $$('#txt-repeat-password').val();

            if (txt_email_add == '') {
                myApp.alert('Please enter email!');
                $$('#btn-signup').removeAttr("disabled");
                return false;
            }

            if (validateEmail(txt_email_add) == false) {
                myApp.alert('Please enter valid email!');
                $$('#btn-signup').removeAttr("disabled");
                return false;
            }

            if (txt_password == '') {
                myApp.alert('Please enter password!');
                $$('#btn-signup').removeAttr("disabled");
                return false;
            }

            if (txt_repeat_password == '') {
                myApp.alert('Please repeat the password!');
                $$('#btn-signup').removeAttr("disabled");
                return false;
            }

            if (txt_password != txt_repeat_password) {
                myApp.alert('Password is not the same!');
                $$('#btn-signup').removeAttr("disabled");
                return false;
            }

            if (txt_password.length < 6) {
                myApp.alert("min 6 characters, max 50 characters");
                $$('#btn-signup').removeAttr("disabled");
                return false;
            }

            if (txt_password.length > 50) {
                myApp.alert("min 6 characters, max 50 characters");
                $$('#btn-signup').removeAttr("disabled");
                return false;
            }

            if (txt_password.search(/\d/) == -1) {
                myApp.alert("must contain at least 1 number");
                $$('#btn-signup').removeAttr("disabled");
                return false;
            }

            if (txt_password.search(/[a-zA-Z]/) == -1) {
                myApp.alert("must contain at least 1 letter");
                $$('#btn-signup').removeAttr("disabled");
                return false;
            }

            if (txt_password.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\.\,\;\:]/) != -1) {
                myApp.alert("character ivalid");
                $$('#btn-signup').removeAttr("disabled");
                return false;
            } else {

            // if ($('#chkbox-terms').is(':checked') == false) {
            //     myApp.alert("Please agree with the terms and conditions");
            //     $$('#btn-signup').removeAttr("disabled");
            //     return false;
            // } else {
                myApp.showIndicator();
                $$.ajax({
                    type: "POST",
                    url: ENVYP_API_URL + "add_user.php",
                    data: "account=" + txt_email_add + "&password=" + txt_password + "&account_type=1",
                    dataType: "json",
                    success: function(msg, string, jqXHR) {
                        myApp.hideIndicator();
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
                        myApp.hideIndicator();
                        myApp.alert(ERROR_ALERT);
                        $$('#btn-signup').removeAttr("disabled");
                    }
                });
            }
        } else {
            myApp.alert(NO_INTERNET_ALERT);
        }
    });
});

/* ===== Add Profile Page ===== */
myApp.onPageInit('profile-add', function(page) {
    if (page.query.account_id != '' || page.query.account_id != null) {
        $$('#txt-firstname').val(page.query.first_name);
        $$('#txt-lastname').val(page.query.last_name);
        $$('#txt-age').val(page.query.age);
        $$('#txt-description').val(page.query.description);
        $$('#profile-image').attr('src', (page.query.image_url == '' || page.query.image_url == null ? "img/profile.jpg" : page.query.image_url));
        localStorage.setItem('account_id', page.query.account_id);
    }

    $$('#btn-continue').on('click', function() {
        if (checkInternetConnection() == true) {
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

            if (imgfile == '') {
                myApp.showIndicator();
                $$.ajax({
                    type: "POST",
                    url: ENVYP_API_URL + "update_user.php",
                    data: "account_id=" + localStorage.getItem('account_id') + "&first_name=" + first_name + "&last_name=" + last_name + "&age=" + age + "&description=" + description + "&image_url=" + page.query.image_url,
                    dataType: "json",
                    success: function(msg, string, jqXHR) {
                        myApp.hideIndicator();
                        if (msg.status == '0') {
                            myApp.alert('Success');
                            clearLogInDetails();
                            mainView.router.loadPage('choose_sports.html');
                        } else {
                            myApp.alert(msg.message);
                        }
                        $$('#btn-continue').removeAttr("disabled");
                        imgfile = '';
                    },
                    error: function(msg, string, jqXHR) {
                        myApp.hideIndicator();
                        myApp.alert(ERROR_ALERT);
                        $$('#btn-continue').removeAttr("disabled");
                    }
                });
            } else {
                myApp.showIndicator();
                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = imgfile.substr(imgfile.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                options.chunkedMode = false;

                var params = new Object();
                params.account_id = localStorage.getItem('account_id');
                params.first_name = first_name;
                params.last_name = last_name;
                params.age = age;
                params.description = description;

                options.params = params;

                var ft = new FileTransfer();
                ft.upload(imgfile, ENVYP_API_URL + "update_user.php", winUpdateUser, fail, options);

                clearLogInDetails();
                myApp.hideIndicator();

                // localStorage.setItem('account_image', imgfile);

                mainView.router.loadPage('choose_sports.html');
                $$('#btn-continue').removeAttr("disabled");
                imgfile = '';
            }

            localStorage.setItem('first_name', first_name);
            localStorage.setItem('last_name', last_name);
            localStorage.setItem('age', age);
            localStorage.setItem('description', description);

            $('#div-profile-name').empty();
            $('#img-profile-image').empty();
            $$('#div-profile-name').prepend(localStorage.getItem('first_name') + ' ' + localStorage.getItem('last_name'));
            $$('#img-profile-image').attr('src', (localStorage.getItem('account_image') == '' || localStorage.getItem('account_image') == null ? "img/profile.jpg" : localStorage.getItem('account_image')));
        } else {
            myApp.alert(NO_INTERNET_ALERT);
        }
    });
});

/* ===== Choose Sports Page ===== */
myApp.onPageInit('choose-sports', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-choose-sports').prepend('Choose Sports');
    } else {
        $('#lbl-choose-sports').prepend('Vælg Sport');
    }

    $$('#open-left-panel').on('click', function(e) {
        myApp.openPanel('left');
    });

    $$('#close-left-panel').on('click', function() {
        myApp.closePanel('left');
    });
});

/* ===== Home Page ===== */
myApp.onPageInit('home', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-home').prepend('Home');
        $('#btn-make-new-team').prepend('Make New Team');
        $('#btn-choose-existing').prepend('Choose Existing');
    } else {
        $('#lbl-home').prepend('Hjem');
        $('#btn-make-new-team').prepend('Foretag nye hold');
        $('#btn-choose-existing').prepend('Vælg eksisterende');
    }

    if (page.query.sport_id != null) {
        localStorage.setItem('selectedSportID', page.query.sport_id);
        localStorage.setItem('selectedSportImage', page.query.image_url);
    }

    $$("#img-sport-selected").attr("src", localStorage.getItem('selectedSportImage'));
});

/* ===== Team Add Page ===== */
myApp.onPageInit('team-add', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-create-team').prepend('Create Team');
        $('#lbl-team-add-upload-image').prepend('Upload Image');
        $('#lbl-team-add-details').prepend('Details');
        $('#lbl-team-name').prepend('Team name');
        $('#lbl-team-description').prepend('Description');
        $('#lbl-team-password').prepend('Password');
        $('#btn-add-team').prepend('Continue');
    } else {
        $('#lbl-create-team').prepend('Opret Team');
        $('#lbl-team-add-upload-image').prepend('Upload billede');
        $('#lbl-team-add-details').prepend('Detaljer');
        $('#lbl-team-name').prepend('Hold navn');
        $('#lbl-team-description').prepend('Beskrivelse');
        $('#lbl-team-password').prepend('Adgangskode');
        $('#btn-add-team').prepend('Blive ved');
    }

    $$('#btn-add-team').on('click', function() {
        if (checkInternetConnection() == true) {
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

            if (imgfile == '') {
                myApp.showIndicator();
                $$.ajax({
                    type: "POST",
                    url: ENVYP_API_URL + "add_team.php",
                    data: "account_id=" + localStorage.getItem('account_id') + "&sport_id=" + localStorage.getItem('selectedSportID') + "&team_name=" + team_name + "&team_description=" + team_description + "&team_password=" + team_password,
                    dataType: "json",
                    success: function(msg, string, jqXHR) {
                        myApp.hideIndicator();
                        if (msg.status == '0') {
                            clearTeamDetails();
                            mainView.router.loadPage('team_management.html?team_id=' + msg.team_id + '&team_name=' + team_name);
                        }
                        myApp.alert(msg.message);
                        $$('#btn-add-team').removeAttr("disabled");
                    },
                    error: function(msg, string, jqXHR) {
                        myApp.hideIndicator();
                        myApp.alert(ERROR_ALERT);
                        $$('#btn-add-team').removeAttr("disabled");
                    }
                });
            } else {
                myApp.showIndicator();
                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = imgfile.substr(imgfile.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                options.chunkedMode = false;

                var params = new Object();
                params.account_id = localStorage.getItem('account_id');
                params.sport_id = localStorage.getItem('selectedSportID');
                params.team_name = team_name;
                params.team_description = team_description;
                params.team_password = team_password;

                options.params = params;

                var ft = new FileTransfer();
                ft.upload(imgfile, ENVYP_API_URL + "add_team.php", winTeamAdd, fail, options);

                clearTeamDetails();
                myApp.hideIndicator();
                $$('#btn-add-team').removeAttr("disabled");
            }
        }
    });
});

/* ===== Team List Page ===== */
myApp.onPageInit('team-list', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-team-list').prepend('Team List');
    } else {
        $('#lbl-team-list').prepend('Team liste');
    }

    if (checkInternetConnection() == true) {
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
                        team_image: field.team_image,
                        created_by: field.first_name + ' ' + field.last_name
                    });
                }
            });

            var virtualList = myApp.virtualList($$(page.container).find('.virtual-list'), {
                items: items,
                searchAll: function(query, items) {
                    var found = [];
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].team_name.indexOf(query) >= 0 || query.trim() === '') found.push(i);
                    }
                    return found;
                },
                template: '<li>' +
                    '<a href="#" onclick="getTeamPassword({{team_id}},{{team_admin}},\'{{team_name}}\',\'{{team_password}}\',\'{{team_image}}\')" class="item-link item-content">' +
                    '<div class="item-media"><img data-src="{{team_image}}" class="lazy lazy-fadein img-circle" style="width:44px; height:44px;"/></div>' +
                    '<div class="item-inner">' +
                    '<div class="item-title-row">' +
                    '<div class="item-title">{{team_name}}</div>' +
                    '</div>' +
                    '<div class="item-subtitle">Administrator: {{created_by}}</div>' +
                    '</div>' +
                    '</a>' +
                    '</li>',
                height: 73,
            });
            myApp.initImagesLazyLoad(page.container);
            myApp.hideIndicator();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            myApp.hideIndicator(); 
            myApp.alert(AJAX_ERROR_ALERT); 
        });
    } else {
        myApp.alert(NO_INTERNET_ALERT);
    }
});

/* ===== Team Stats Page ===== */
myApp.onPageInit('team-stats', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-team-stats').prepend('Team Statistics');
    } else {
        $('#lbl-team-stats').prepend('Team statistik');
    }

    var ppg = 0;
    var apg = 0;
    var fpg = 0;

    $$("#img-team-image").attr("data-src", (localStorage.getItem('selectedTeamImage') == '' || localStorage.getItem('selectedTeamImage') == null ? "img/profile.jpg" : localStorage.getItem('selectedTeamImage')));
    $$("#img-team-image").addClass('lazy lazy-fadein');
    myApp.initImagesLazyLoad(page.container);

    $$('#p-team-name').prepend(localStorage.getItem('selectedTeamName'));

    myApp.showIndicator();
    $.getJSON(ENVYP_API_URL + "get_team_stats.php?team_id=" + localStorage.getItem('selectedTeamID'), function(result) {
        $.each(result, function(i, field) {
            ppg = field.ppg
            apg = field.apg
            fpg = field.fpg
        });

        $('#team-ppg').prepend(ppg);
        $('#team-apg').prepend(apg);
        $('#team-fpg').prepend(fpg);

        myApp.hideIndicator();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        myApp.hideIndicator(); 
        myApp.alert(AJAX_ERROR_ALERT); 
    });  
});

/* ===== Team Management Page ===== */
myApp.onPageInit('team-management', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#btn-roster').append('Roster');
        $('#btn-tournament').append('Tournament');
        $('#btn-statistics').append('Statistics');
    } else {
        $('#btn-roster').append('Roster');
        $('#btn-tournament').append('Turnering');
        $('#btn-statistics').append('Statistik');
    }

    if (page.query.team_id != null) {
        localStorage.setItem('selectedTeamName', page.query.team_name);
        localStorage.setItem('selectedTeamID', page.query.team_id);
        localStorage.setItem('selectedTeamName', page.query.team_name);
        localStorage.setItem('selectedTeamImage', page.query.team_image);
        localStorage.setItem('currentTeamAdmin', page.query.team_admin);
    }

    $('#header-team-name').append(localStorage.getItem('selectedTeamName'));

    $$('#btn-roster').on('click', function() {
        mainView.router.loadPage('roster_list.html');
    });

    $$('#btn-tournament').on('click', function() {
        mainView.router.loadPage('tournament_list.html');
    });

    $$('#open-right-panel').on('click', function(e) {
        getParticipantList();
        getTeamAdministratorList();
        myApp.openPanel('right');
    });

    $$('#close-right-panel').on('click', function() {
        myApp.closePanel('right');
    });
});

/* =====Roster List Page ===== */
myApp.onPageInit('roster-list', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-roster-list').append('Roster');
    } else {
        $('#lbl-roster-list').append('Roster liste');
    }

    if ((localStorage.getItem('currentTeamAdmin') != localStorage.getItem('account_id')) && localStorage.getItem('currentAccountIsTeamAdmin') == 0) {
        $('#btn-show-add-roster').hide();
    }

    if (checkInternetConnection() == true) {
        var items = [];
        myApp.showIndicator();
        $.getJSON(ENVYP_API_URL + "get_roster_list.php?team_id=" + localStorage.getItem('selectedTeamID'), function(result) {
            $.each(result, function(i, field) {
                if (field.status == 'empty') {
                    myApp.alert('No roster yet :(');
                } else {
                    var roster_image = (field.image_url == '' || field.image_url == null ? "img/profile.jpg" : field.image_url);
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
                searchAll: function(query, items) {
                    var found = [];
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].roster_name.indexOf(query) >= 0 || query.trim() === '') found.push(i);
                    }
                    return found;
                },
                template: '<li>' +
                    '<a href="roster_detail.html?roster_id={{roster_id}}&roster_name={{roster_name}}&roster_position={{roster_position}}&roster_image={{roster_image}}" class="item-link item-content">' +
                    '<div class="item-media"><img data-src="{{roster_image}}" class="lazy lazy-fadein img-circle" style="width:44px; height:44px;"/></div>' +
                    '<div class="item-inner">' +
                    '<div class="item-title-row">' +
                    '<div class="item-title">{{roster_name}}</div>' +
                    '</div>' +
                    '<div class="item-subtitle">{{roster_position}}</div>' +
                    '</div></a></li>',
                height: 62,
            });
            myApp.initImagesLazyLoad(page.container);
            myApp.hideIndicator();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            myApp.hideIndicator(); 
            myApp.alert(AJAX_ERROR_ALERT); 
        });
    } else {
        myApp.alert(NO_INTERNET_ALERT);
    }
});

/* ===== Roster Add Page ===== */
myApp.onPageInit('roster-add', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-add-roster').append('Add Roster');
        $('#lbl-roster-add-image').append('Image');
        $('#lbl-roster-add-name').append('Roster name');
        $('#lbl-roster-add-position').append('Position');
        $('#btn-add-roster').append('Continue');
    } else {
        $('#lbl-add-roster').append('Tilføj vagtplan');
        $('#lbl-roster-add-image').append('Billede');
        $('#lbl-roster-add-name').append('Roster navn');
        $('#lbl-roster-add-position').append('Position');
        $('#btn-add-roster').append('Blive ved');
    }

    $$('#btn-add-roster').on('click', function() {
        if (checkInternetConnection() == true) {
            $$('#btn-add-roster').attr('disabled', true);
            var roster_name = $$('#txt-roster-name').val();
            var roster_position = $$('#txt-roster-position').val();

            if (roster_name == '' || roster_name == null) {
                myApp.alert('Please enter roster name!');
                $$('#btn-add-roster').removeAttr("disabled");
                return false;
            }

            if (imgfile == '') {
                myApp.showIndicator();
                $$.ajax({
                    type: "POST",
                    url: ENVYP_API_URL + "add_roster.php",
                    data: "account_id=" + localStorage.getItem('account_id') +
                        "&team_id=" + localStorage.getItem('selectedTeamID') +
                        "&roster_name=" + roster_name +
                        "&roster_position=" + roster_position,
                    dataType: "json",
                    success: function(msg, string, jqXHR) {
                        myApp.hideIndicator();
                        if (msg.status == '0') {
                            clearRosterDetails();
                            mainView.router.loadPage('roster_list.html');
                        }
                        myApp.alert(msg.message);
                        $$('#btn-add-roster').removeAttr("disabled");
                    },
                    error: function(msg, string, jqXHR) {
                        myApp.hideIndicator();
                        myApp.alert(ERROR_ALERT);
                        $$('#btn-add-roster').removeAttr("disabled");
                    }
                });
            } else {
                myApp.showIndicator();
                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = imgfile.substr(imgfile.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                options.chunkedMode = false;

                var params = new Object();
                params.account_id = localStorage.getItem('account_id');
                params.team_id = localStorage.getItem('selectedTeamID');
                params.roster_name = roster_name;
                params.roster_position = roster_position;

                options.params = params;

                var ft = new FileTransfer();
                ft.upload(imgfile, ENVYP_API_URL + "add_roster.php", win, fail, options);

                clearRosterDetails();
                myApp.hideIndicator();
                $$('#btn-add-roster').removeAttr("disabled");
                mainView.router.loadPage('roster_list.html');
            }
        }
    });
});

/* ===== Roster Detail Page ===== */
myApp.onPageInit('roster-detail', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-roster-detail').append('Roster Detail');
    } else {
        $('#lbl-roster-detail').append('Roster detalje');
    }

    if ((localStorage.getItem('currentTeamAdmin') != localStorage.getItem('account_id')) && localStorage.getItem('currentAccountIsTeamAdmin') == 0) {
        $('#btn-edit-roster-detail').hide();
    }

    $$('#roster-detail-name').prepend(page.query.roster_name);
    $$('#roster-detail-position').prepend(page.query.roster_position);

    $$("#roster-detail-image").attr("data-src", (page.query.roster_image == '' || page.query.roster_image == null ? "img/profile.jpg" : page.query.roster_image));
    $$("#roster-detail-image").addClass('lazy lazy-fadein');
    myApp.initImagesLazyLoad(page.container);

    myApp.showIndicator();
    $.getJSON(ENVYP_API_URL + "get_roster_average_stats.php?roster_id=" + page.query.roster_id, function(result) {
        $.each(result, function(i, field) {
            $('#roster-ppg').prepend(field.ppg);
            $('#roster-apg').prepend(field.apg);
            $('#roster-fpg').prepend(field.fpg);
        });
        myApp.hideIndicator();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        myApp.hideIndicator(); 
        myApp.alert(AJAX_ERROR_ALERT); 
    });

    $$('#btn-edit-roster-detail').on('click', function() {
        mainView.router.loadPage('roster_edit.html?roster_id=' + page.query.roster_id + '&roster_name=' + page.query.roster_name + '&roster_position=' + page.query.roster_position + '&roster_image=' + page.query.roster_image);
    });
});

/* ===== Roster Edit Page ===== */
myApp.onPageInit('roster-edit', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-edit-roster').append('Edit Roster');
        $('#lbl-roster-edit-image').append('Image');
        $('#lbl-roster-edit-name').append('Roster name');
        $('#lbl-roster-edit-position').append('Position');
        $('#btn-update-roster').append('Continue');
    } else {
        $('#lbl-edit-roster').append('Rediger vagtplan');
        $('#lbl-roster-edit-image').append('Billede');
        $('#lbl-roster-edit-name').append('Roster navn');
        $('#lbl-roster-edit-position').append('Position');
        $('#btn-update-roster').append('Blive ved');
    }

    $$('#edit-txt-roster-name').attr('value', page.query.roster_name);
    $$('#edit-txt-roster-position').attr('value', page.query.roster_position);
    $$("#edit-roster-image").attr("data-src", (page.query.roster_image == '' || page.query.roster_image == null ? "img/profile.jpg" : page.query.roster_image));
    $$("#edit-roster-image").addClass('lazy lazy-fadein');
    myApp.initImagesLazyLoad(page.container);

    $$('#btn-update-roster').on('click', function() {
        if (checkInternetConnection() == true) {
            $$('#btn-update-roster').attr('disabled', true);
            var roster_name = $$('#edit-txt-roster-name').val();
            var roster_position = $$('#edit-txt-roster-position').val();

            if (roster_name == '' || roster_name == null) {
                myApp.alert('Please enter roster name!');
                $$('#btn-update-roster').removeAttr("disabled");
                return false;
            }

            if (imgfile == '') {
                myApp.showIndicator();
                $$.ajax({
                    type: "POST",
                    url: ENVYP_API_URL + "update_roster.php",
                    data: "account_id=" + localStorage.getItem('account_id') +
                        "&roster_id=" + page.query.roster_id +
                        "&roster_name=" + $$('#edit-txt-roster-name').val() +
                        "&roster_position=" + $$('#edit-txt-roster-position').val() +
                        "&roster_image=" + page.query.roster_image,
                    dataType: "json",
                    success: function(msg, string, jqXHR) {
                        myApp.hideIndicator();
                        if (msg.status == '0') {
                            clearEditRosterDetails();
                            mainView.router.loadPage('roster_list.html');
                        }
                        myApp.alert(msg.message);
                        $$('#btn-update-roster').removeAttr("disabled");
                    },
                    error: function(msg, string, jqXHR) {
                        myApp.hideIndicator();
                        myApp.alert(ERROR_ALERT);
                        $$('#btn-update-roster').removeAttr("disabled");
                    }
                });
            } else {
                myApp.showIndicator();
                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = imgfile.substr(imgfile.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                options.chunkedMode = false;

                var params = new Object();
                params.account_id = localStorage.getItem('account_id');
                params.roster_id = page.query.roster_id;
                params.roster_name = $$('#edit-txt-roster-name').val();
                params.roster_position = $$('#edit-txt-roster-position').val();

                options.params = params;

                var ft = new FileTransfer();
                ft.upload(imgfile, ENVYP_API_URL + "update_roster.php", win, fail, options);

                clearEditRosterDetails();
                myApp.hideIndicator();
                $$('#btn-update-roster').removeAttr("disabled");
                mainView.router.loadPage('roster_list.html');
            }
        }
    });
});

/* =====Participant List Page ===== */
myApp.onPageInit('account-list', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-account-list').append('Account List');
    } else {
        $('#lbl-account-list').append('liste konto');
    }

    myApp.closePanel();
    var selectedParticipants = new Array();

    if (checkInternetConnection() == true) {
        var items = [];
        myApp.showIndicator();
        $.getJSON(ENVYP_API_URL + "get_account_list.php?team_id=" + localStorage.getItem('selectedTeamID'), function(result) {
            $.each(result, function(i, field) {
                if (field.status == 'empty') {
                    // myApp.alert('No accounts available :(');
                } else {
                    var account_image = (field.image_url == '' || field.image_url == null ? "img/profile.jpg" : field.image_url);
                    items.push({
                        account_id: field.account_id,
                        account_name: field.first_name + " " + field.last_name,
                        account_image: account_image,
                        account_description: field.account_description
                    });
                }
            });

            var virtualList = myApp.virtualList($$(page.container).find('.virtual-list'), {
                items: items,
                searchAll: function(query, items) {
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
                    '<div class="item-title">{{account_name}}</div>' +
                    '<div class="item-after"><i class="icon icon-form-checkbox"></i></div>' +
                    '</div>' +
                    '<div class="item-subtitle">{{account_description}}</div>' +
                    '</div>' +
                    '</label>' +
                    '</li>',
                height: 73,
            });
            myApp.hideIndicator();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            myApp.hideIndicator(); 
            myApp.alert(AJAX_ERROR_ALERT); 
        });
    } else {
        myApp.alert(NO_INTERNET_ALERT);
    }

    $$('#btn-account-back-tm').on('click', function(e) {
        $("input:checkbox[id=checkbox-participants]:checked").each(function() {
            selectedParticipants.push($(this).val());
        });

        if (selectedParticipants.length != 0) {
            myApp.showIndicator();
            $$.ajax({
                type: "POST",
                url: ENVYP_API_URL + "add_participant.php",
                data: "account_ids=" + selectedParticipants + "&team_id=" + localStorage.getItem('selectedTeamID'),
                dataType: "json",
                success: function(msg, string, jqXHR) {
                    myApp.hideIndicator();
                    if (msg.status == 0) {
                        getParticipantList();
                    } else {
                        myApp.alert(msg.message);
                    }
                },
                error: function(msg, string, jqXHR) {
                    myApp.hideIndicator();
                    myApp.alert(ERROR_ALERT);
                }
            });
        }

        myApp.openPanel('right');
    });
});

/* =====Administrator List Page ===== */
myApp.onPageInit('administrator-list', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-administrator-list').append('Administrator List');
    } else {
        $('#lbl-administrator-list').append('administrator liste');
    }

    myApp.closePanel();
    var selectedAdministrator = new Array();

    if (checkInternetConnection() == true) {
        var items = [];
        myApp.showIndicator();
        $.getJSON(ENVYP_API_URL + "get_team_participant_list.php?team_id=" + localStorage.getItem('selectedTeamID'), function(result) {
            $.each(result, function(i, field) {
                if (field.status == 'empty') {
                    // myApp.alert('No accounts available :(');
                } else {
                    var account_image = (field.image_url == '' || field.image_url == null ? "img/profile.jpg" : field.image_url);
                    items.push({
                        account_id: field.account_id,
                        account_name: field.first_name + " " + field.last_name,
                        account_image: account_image,
                        account_description: field.account_description
                    });
                }
            });

            var virtualList = myApp.virtualList($$(page.container).find('.virtual-list'), {
                items: items,
                searchAll: function(query, items) {
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
                    '<div class="item-title">{{account_name}}</div>' +
                    '<div class="item-after"><i class="icon icon-form-checkbox"></i></div>' +
                    '</div>' +
                    '<div class="item-subtitle">{{account_description}}</div>' +
                    '</div>' +
                    '</label>' +
                    '</li>',
                height: 73,
            });
            myApp.hideIndicator();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            myApp.hideIndicator(); 
            myApp.alert(AJAX_ERROR_ALERT); 
        });
    } else {
        myApp.alert(NO_INTERNET_ALERT);
    }

    $$('#btn-admin-back-tm').on('click', function(e) {
        $("input:checkbox[id=checkbox-administrator]:checked").each(function() {
            selectedAdministrator.push($(this).val());
        });

        if (selectedAdministrator.length != 0) {
            myApp.showIndicator();
            $$.ajax({
                type: "POST",
                url: ENVYP_API_URL + "add_team_administrator.php",
                data: "account_ids=" + selectedAdministrator + "&team_id=" + localStorage.getItem('selectedTeamID'),
                dataType: "json",
                success: function(msg, string, jqXHR) {
                    myApp.hideIndicator();
                    if (msg.status == 0) {
                        getTeamAdministratorList();
                    } else {
                        myApp.alert(msg.message);
                    }
                },
                error: function(msg, string, jqXHR) {
                    myApp.hideIndicator();
                    myApp.alert(ERROR_ALERT);
                }
            });
        }

        myApp.openPanel('right');
    });
});

/* =====Tournament Add Page ===== */
myApp.onPageInit('tournament-add', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-add-tournament').append('Add Tournament');
        $('#lbl-add-tournament-image').append('Image');
        $('#lbl-add-tournament-details').append('Details');
        $('#lbl-add-tournament-opponent').append('Opponent');
        $('#lbl-add-tournament-location').append('Location');
        $('#lbl-add-tournament-date').append('Date');
        $('#lbl-add-tournament-description').append('Description');
        $('#btn-add-tournament').append('Continue');
    } else {
        $('#lbl-add-tournament').append('Tilføj turnering');
        $('#lbl-add-tournament-image').append('Billede');
        $('#lbl-add-tournament-details').append('Detaljer');
        $('#lbl-add-tournament-opponent').append('Modstander');
        $('#lbl-add-tournament-location').append('Beliggenhed');
        $('#lbl-add-tournament-date').append('Dato');
        $('#lbl-add-tournament-description').append('Beskrivelse');
        $('#btn-add-tournament').append('Blive ved');
    }

    var places = new google.maps.places.Autocomplete(document.getElementById('txt-tournament-location'));
    google.maps.event.addListener(places, 'place_changed', function() {
        place = places.getPlace();
        address = place.formatted_address;
        latitude = place.geometry.location.lat();
        longitude = place.geometry.location.lng();
    });

    $("#txt-tournament-date").val(new Date().toJSON().slice(0, 16));

    $$('#btn-add-tournament').on('click', function() {
        if (checkInternetConnection() == true) {
            $$('#btn-add-tournament').attr('disabled', true);
            var opponent_name = $$('#txt-opponent-name').val();
            var tournament_date = $$('#txt-tournament-date').val();
            var tournament_desc = $$('#txt-tournament-description').val();
            var tournament_location = $$('#txt-tournament-location').val();

            if (opponent_name == '' || opponent_name == null) {
                myApp.alert('Please enter opponent name!');
                $$('#btn-add-tournament').removeAttr("disabled");
                return false;
            }

            if (latitude == '' || longitude == '') {
                myApp.alert('Please enter a valid location!');
                $$('#btn-add-tournament').removeAttr("disabled");
                return false;
            }

            if (imgfile == '') {
                myApp.showIndicator();
                $$.ajax({
                    type: "POST",
                    url: ENVYP_API_URL + "add_tournament.php",
                    data: "account_id=" + localStorage.getItem('account_id') + "&team_id=" + localStorage.getItem('selectedTeamID') + "&opponent=" + opponent_name + "&tournament_date=" + tournament_date + "&tournament_desc=" + tournament_desc + "&tournament_location=" + tournament_location + "&longitude=" + longitude + "&latitude=" + latitude,
                    dataType: "json",
                    success: function(msg, string, jqXHR) {
                        myApp.hideIndicator();
                        if (msg.status == '0') {
                            clearTournamentDetails();
                            mainView.router.loadPage('tournament_list.html');
                        }
                        myApp.alert(msg.message);
                        $$('#btn-add-tournament').removeAttr("disabled");
                    },
                    error: function(msg, string, jqXHR) {
                        myApp.hideIndicator();
                        myApp.alert(ERROR_ALERT);
                        $$('#btn-add-tournament').removeAttr("disabled");
                    }
                });
            } else {
                myApp.showIndicator();
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
                ft.upload(imgfile, ENVYP_API_URL + "add_tournament.php", win, fail, options);

                clearTournamentDetails();
                myApp.hideIndicator();
                $$('#btn-add-tournament').removeAttr("disabled");
                mainView.router.loadPage('tournament_list.html');
            }

        }
    });
});

/* =====Tournament List Page ===== */
myApp.onPageInit('tournament-list', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-tournament-list').append('Tournament List');
    } else {
        $('#lbl-tournament-list').append('Tournament liste');
    }

    if ((localStorage.getItem('currentTeamAdmin') != localStorage.getItem('account_id')) && localStorage.getItem('currentAccountIsTeamAdmin') == 0) {
        $('#btn-show-add-tournament').hide();
    }
    if (checkInternetConnection() == true) {
        var items = [];
        myApp.showIndicator();
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
                searchAll: function(query, items) {
                    var found = [];
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].roster_name.indexOf(query) >= 0 || query.trim() === '') found.push(i);
                    }
                    return found;
                },
                template: '<li>' +
                    '<a href="tournament_detail.html?tournament_id={{tournament_id}}" class="item-link item-content">' +
                    '<div class="item-media"><img data-src="{{tournament_image}}" style="width:44px; height:44px;" class="img-circle lazy lazy-fadein"/></div>' +
                    '<div class="item-inner">' +
                    '<div class="item-title-row">' +
                    '<div class="item-title">{{opponent}}</div>' +
                    '</div>' +
                    '<div class="item-subtitle">{{tournament_date}}</div>' +
                    '</div></a></li>',
                height: 73,
            });
            myApp.initImagesLazyLoad(page.container);
            myApp.hideIndicator();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            myApp.hideIndicator(); 
            myApp.alert(AJAX_ERROR_ALERT); 
        });
    } else {
        myApp.alert(NO_INTERNET_ALERT);
    }
});

/* =====Tournament Detail Page ===== */
myApp.onPageInit('tournament-detail', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-tournament-detail').append('Detail');
        $('#lbl-tournament-detail-roster').append('Roster');
        $('#lbl-tournament-detail-stats').append('Stats');
        $('#lbl-tournament-detail-fine-box').append('Fine Box');
        $('#lbl-tournament-detail-mvp').append('MVP');

        $('#lbl-tournament-detail-opponent').append('Opponent');
        $('#lbl-tournament-detail-location').append('Location');
        $('#lbl-tournament-detail-date').append('Date');
        $('#lbl-tournament-detail-description').append('Description');
        $('#btn-edit-tournament-details').append('Edit');

        $('#lbl-tournament-detail-versus').append('Versus');
        $('#lbl-tournament-detail-score').append('Score');
        $('#lbl-tournament-detail-assist').append('Assist');
        $('#lbl-tournament-detail-foul').append('Foul');

        $('#lbl-tournament-detail-enter-vote').append('Enter your vote');
        $('#lbl-tournament-detail-roster-vote').append('Roster');
        $('#btn-submit-vote').append('Vote');
    } else {
        $('#lbl-tournament-detail').append('detaljer');
        $('#lbl-tournament-detail-roster').append('Kampprogram');
        $('#lbl-tournament-detail-stats').append('Statistik');
        $('#lbl-tournament-detail-fine-box').append('fint kasse');
        $('#lbl-tournament-detail-mvp').append('MVP');

        $('#lbl-tournament-detail-opponent').append('Modstander');
        $('#lbl-tournament-detail-location').append('Beliggenhed');
        $('#lbl-tournament-detail-date').append('Dato');
        $('#lbl-tournament-detail-description').append('Beskrivelse');
        $('#btn-edit-tournament-details').append('edit');

        $('#lbl-tournament-detail-versus').append('Imod');
        $('#lbl-tournament-detail-score').append('score');
        $('#lbl-tournament-detail-assist').append('Hjælpe');
        $('#lbl-tournament-detail-foul').append('foul');

        $('#lbl-tournament-detail-enter-vote').append('Indtast din stemme');
        $('#lbl-tournament-detail-roster-vote').append('Kampprogram');
        $('#btn-submit-vote').append('Stemme');
    }

    if ((localStorage.getItem('currentTeamAdmin') != localStorage.getItem('account_id')) && localStorage.getItem('currentAccountIsTeamAdmin') == 0) {
        $('#btn-edit-tournament-details').hide();
        $('#btn-edit-team-stats').hide();
        $('#btn-submit-vote').hide();
        $('#div-add-tournament-roster').hide();
        $('#div-add-tournament-fine').hide();
    }

    var tournament_id = 0;
    var tournament_opponent = '';
    var tournament_location = '';
    var tournament_date = '';
    var tournament_description = '';
    var tournament_image_url = '';
    var tournament_longitude = '';
    var tournament_latitude = '';
    var tournament_formatted_date = '';
    $$('#div-add-tournament-roster').hide();
    $$('#div-add-tournament-fine').hide();

    localStorage.setItem('selectedTournamentId', page.query.tournament_id);

    myApp.showIndicator();
    $.getJSON(ENVYP_API_URL + "get_tournament_detail.php?tournament_id=" + localStorage.getItem('selectedTournamentId'), function(result) {
        $.each(result, function(i, field) {
            tournament_opponent = field.opponent;
            tournament_location = field.location;
            tournament_date = field.tournament_date;
            tournament_description = field.description;
            tournament_image_url = field.image_url;
            tournament_longitude = field.longitude;
            tournament_latitude = field.latitude;
            tournament_formatted_date = field.formatted_date;
        });

        $$("#tournament-background-image").css("background-image", "url(" + (tournament_image_url == '' || tournament_image_url == null ? "img/envyp_logo.png" : tournament_image_url) + ")");

        $$('#txt-opponent-name').prepend(tournament_opponent);
        $$('#txt-tournament-location').prepend(tournament_location);
        $$('#txt-tournament-date').prepend(tournament_date);
        $$('#txt-tournament-description').prepend((tournament_description == '' || tournament_description == null ? "No description" : tournament_description));

        myApp.hideIndicator();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        myApp.hideIndicator(); 
        myApp.alert(AJAX_ERROR_ALERT); 
    });

    // $("#txt-tournament-location").height( $("#txt-tournament-location")[0].scrollHeight);
    // $("#txt-tournament-date").height( $("#txt-tournament-location")[0].scrollHeight);
    // $("#txt-tournament-description").height( $("#txt-tournament-description")[0].scrollHeight);

    $$('#btn-edit-tournament-details').on('click', function() {
        mainView.router.loadPage('tournament_edit.html?tournament_id=' + page.query.tournament_id + '&opponent=' + tournament_opponent + '&location=' + tournament_location + '&date=' + tournament_date + '&description=' + tournament_description + '&image_url=' + tournament_image_url + '&longitude=' + tournament_longitude + '&latitude=' + tournament_latitude + '&formatted_date=' + tournament_formatted_date);
    });

    // Preload roster list
    $("#roster_list").empty();
    myApp.showIndicator();
    $.getJSON(ENVYP_API_URL + "get_tournament_roster.php?tournament_id=" + localStorage.getItem('selectedTournamentId'), function(result) {
        $.each(result, function(i, field) {
            if (field.status == 'empty') {
                $("#roster_list").append('<li><center><p>No roster</p><center></li>');
            } else {
                if (field.image_url == '' || field.image_url == null) {
                    var image_url = "<img src='img/profile.jpg' class='img-circle' style='width:44px; height:44px;'>";
                } else {
                    var image_url = "<img src='" + field.image_url + "' class='img-circle' style='width:44px; height:44px;'>";
                }
                $("#roster_list").append('<li>' +
                    '<a href="roster_tournament_stats.html?roster_id=' + field.roster_id + '&roster_name=' + field.name + '&roster_position=' + field.position + '&roster_image=' + field.image_url + '" class="item-link item-content">' +
                    '<div class="item-media">' + image_url + '</div>' +
                    '<div class="item-inner">' +
                    '<div class="item-title-row">' +
                    '<div class="item-title">' + field.name + '</div>' +
                    '</div>' +
                    '<div class="item-subtitle">' + field.position + '</div>' +
                    '</div></a></li>');
            }
            // myApp.initImagesLazyLoad(page.container);
        });
        myApp.hideIndicator();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        myApp.hideIndicator(); 
        myApp.alert(AJAX_ERROR_ALERT); 
    });
    // End Preload roster list

    // Preload fine list
    $("#fine_list").empty();
    myApp.showIndicator();
    $.getJSON(ENVYP_API_URL + "get_roster_fine.php?tournament_id=" + localStorage.getItem('selectedTournamentId'), function(result) {
        $.each(result, function(i, field) {
            if (field.status == 'empty') {
                $("#fine_list").append('<li><center><p>No fine</p><center></li>');
            } else {
                if (field.image_url == '' || field.image_url == null) {
                    var image_url = "<img src='img/profile.jpg' class='img-circle' style='width:44px; height:44px;'>";
                } else {
                    var image_url = "<img src='" + field.image_url + "' class='img-circle' style='width:44px; height:44px;'>";
                }
                $("#fine_list").append('<li><a href="fine_detail.html?name=' + field.name + '&image_url=' + field.image_url + '&price=' + field.price + '&description=' + field.fine + '" class="item-link item-content">' +
                    '<div class="item-media">' + image_url + '</div>' +
                    '<div class="item-inner">' +
                    '<div class="item-title-row">' +
                    '<div class="item-title">' + field.name + '</div>' +
                    '<div class="item-after">$' + field.price + '</div>' +
                    '</div>' +
                    '<div class="item-subtitle"></div>' +
                    '<div class="item-text">' + field.fine + '</div>' +
                    '</div></a></li>');
            }
            // myApp.initImagesLazyLoad(page.container);
        });
        myApp.hideIndicator();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        myApp.hideIndicator(); 
        myApp.alert(AJAX_ERROR_ALERT); 
    });
    // End Preload roster list

    // Preload game stats
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

    myApp.showIndicator();
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
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        myApp.hideIndicator(); 
        myApp.alert(AJAX_ERROR_ALERT); 
    });

    $$('#btn-edit-team-stats').on('click', function() {
        mainView.router.loadPage('edit_tournament_stats.html?team_name=' + team_name + '&opponent_name=' + opponent_name + '&team_points=' + team_points + '&opponent_points=' + opponent_points + '&team_assists=' + team_assists + '&opponent_assists=' + opponent_assists + '&team_fouls=' + team_fouls + '&opponent_fouls=' + opponent_fouls);
    });
    // End Preload game stats

    // Preload vote stats
    $.getJSON(ENVYP_API_URL + "check_if_already_voted.php?tournament_id=" + localStorage.getItem('selectedTournamentId') + "&account_id=" + localStorage.getItem('account_id'), function(result) {
        $.each(result, function(i, field) {
            if (field.status == true) {
                $$('#div-vote-add').hide();
                $$('#div-vote-result').show();
            } else {
                $$('#div-vote-add').show();
                $$('#div-vote-result').hide();
            }
        });
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        myApp.hideIndicator(); 
        myApp.alert(AJAX_ERROR_ALERT); 
    });

    $("#vote_list").empty();
    myApp.showIndicator();
    $.getJSON(ENVYP_API_URL + "get_roster_vote_list.php?tournament_id=" + localStorage.getItem('selectedTournamentId'), function(result) {
        $.each(result, function(i, field) {
            if (field.status == 'empty') {
                $("#vote_list").append('<li><center><p>No votes</p><center></li>');
            } else {
                if (field.image_url == '' || field.image_url == null) {
                    var image_url = "<img src='img/profile.jpg' class='img-circle' style='width:44px; height:44px;'>";
                } else {
                    var image_url = "<img src='" + field.image_url + "' class='img-circle' style='width:44px; height:44px;'>";
                }
                $("#vote_list").append('<li>' +
                    '<div class="item-content">' +
                    '<div class="item-media">' + image_url + '</div>' +
                    '<div class="item-inner">' +
                    '<div class="item-title">' + field.name + '</div>' +
                    '<div class="item-after">Votes: ' + field.votes + '</div>' +
                    '</div>' +
                    '</div>' +
                    '</li>');
            }
            // myApp.initImagesLazyLoad(page.container);
        });
        myApp.hideIndicator();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        myApp.hideIndicator(); 
        myApp.alert(AJAX_ERROR_ALERT); 
    });

    $("#select-vote-list").empty();
    myApp.showIndicator();
    $.getJSON(ENVYP_API_URL + "get_tournament_roster.php?tournament_id=" + localStorage.getItem('selectedTournamentId'), function(result) {
        $("#select-vote-list").prepend('<option value="" selected="selected">Select a roster</option>');
        $.each(result, function(i, field) {
            if (field.status == 'empty') {
                // myApp.alert('No roster yet :(');
            } else {
                $("#select-vote-list").append('<option value="' + field.roster_id + '">' + field.name + '</option>');
            }
        });
        myApp.hideIndicator();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        myApp.hideIndicator(); 
        myApp.alert(AJAX_ERROR_ALERT); 
    });
    // End Preload vote

    $$('#detail').on('show', function() {
        $$('#div-add-tournament-roster').hide();
        $$('#div-add-tournament-fine').hide();
    });

    $$('#roster').on('show', function() {
        if ((localStorage.getItem('currentTeamAdmin') != localStorage.getItem('account_id')) && localStorage.getItem('currentAccountIsTeamAdmin') == 0) {} else {
            $$('#div-add-tournament-roster').show();
        }
        $$('#div-add-tournament-fine').hide();
    });

    $$('#stats').on('show', function() {
        $$('#div-add-tournament-roster').hide();
        $$('#div-add-tournament-fine').hide();
    });

    $$('#fine').on('show', function() {
        $$('#div-add-tournament-roster').hide();
        if ((localStorage.getItem('currentTeamAdmin') != localStorage.getItem('account_id')) && localStorage.getItem('currentAccountIsTeamAdmin') == 0) {} else {
            $$('#div-add-tournament-fine').show();
        }
    });

    $$('#mvp').on('show', function() {
        $$('#div-add-tournament-roster').hide();
        $$('#div-add-tournament-fine').hide();

        $$('#btn-submit-vote').on('click', function() {
            $$('#btn-submit-vote').attr('disabled', true);
            myApp.showIndicator();
            $$.ajax({
                type: "POST",
                url: ENVYP_API_URL + "add_vote.php",
                data: "account_id=" + localStorage.getItem('account_id') + "&tournament_id=" + localStorage.getItem('selectedTournamentId') + "&roster_id=" + $$('#select-vote-list').val(),
                dataType: "json",
                success: function(msg, string, jqXHR) {
                    myApp.hideIndicator();
                    if (msg.status == 0) {
                        myApp.alert(msg.message);
                        $$('#div-vote-add').hide();
                        $$('#div-vote-result').show();

                        $("#vote_list").empty();
                        myApp.showIndicator();
                        $.getJSON(ENVYP_API_URL + "get_roster_vote_list.php?tournament_id=" + localStorage.getItem('selectedTournamentId'), function(result) {
                            $.each(result, function(i, field) {
                                if (field.status == 'empty') {
                                    $("#vote_list").append('<li><center><p>No votes</p><center></li>');
                                } else {
                                    if (field.image_url == '' || field.image_url == null) {
                                        var image_url = "<img src='img/profile.jpg' class='img-circle' style='width:44px; height:44px;'>";
                                    } else {
                                        var image_url = "<img src='" + field.image_url + "' class='img-circle' style='width:44px; height:44px;'>";
                                    }
                                    $("#vote_list").append('<li>' +
                                        '<div class="item-content">' +
                                        '<div class="item-media">' + image_url + '</div>' +
                                        '<div class="item-inner">' +
                                        '<div class="item-title">' + field.name + '</div>' +
                                        '<div class="item-after">Votes: ' + field.votes + '</div>' +
                                        '</div>' +
                                        '</div>' +
                                        '</li>');
                                }
                                // myApp.initImagesLazyLoad(page.container);
                            });
                            myApp.hideIndicator();
                        })
                        .fail(function(jqXHR, textStatus, errorThrown) {
                            myApp.hideIndicator(); 
                            myApp.alert(AJAX_ERROR_ALERT); 
                        });
                    } else {
                        myApp.alert(msg.message);
                    }
                    $$('#btn-submit-vote').removeAttr("disabled");
                },
                error: function(msg, string, jqXHR) {
                    myApp.hideIndicator();
                    myApp.alert(ERROR_ALERT);
                    $$('#btn-submit-vote').removeAttr("disabled");
                }
            });
        });
    });
});

/* =====Tournament Detail Page ===== */
myApp.onPageInit('fine-detail', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-fine-detail').append('Fine Detail');
        $('#lbl-fine-detail-description').append('Description');
        $('#lbl-fine-detail-price').append('Price');
    } else {
        $('#lbl-fine-detail').append('Fin detalje');
        $('#lbl-fine-detail-description').append('Beskrivelse');
        $('#lbl-fine-detail-price').append('Kampprogram');
    }

    $$('#fine-detail-name').prepend(page.query.name);
    $$('#fine-detail-description').prepend(page.query.description);
    $$('#fine-detail-price').prepend(page.query.price);
    $$("#fine-detail-image").attr("data-src", (page.query.image_url == '' || page.query.image_url == null ? "img/profile.jpg" : page.query.image_url));
    $$("#fine-detail-image").addClass('lazy lazy-fadein');
    myApp.initImagesLazyLoad(page.container);
});

/* =====Tournament Edit Page ===== */
myApp.onPageInit('tournament-edit', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-edit-tournament').append('Edit Tournament');
        $('#lbl-edit-tournament-image').append('Image');
        $('#lbl-edit-tournament-details').append('Details');
        $('#lbl-edit-tournament-opponent').append('Opponent');
        $('#lbl-edit-tournament-location').append('Location');
        $('#lbl-edit-tournament-date').append('Date');
        $('#lbl-edit-tournament-description').append('Description');
        $('#btn-update-tournament').append('Continue');
    } else {
        $('#lbl-edit-tournament').append('Rediger turnering');
        $('#lbl-edit-tournament-image').append('Billede');
        $('#lbl-edit-tournament-details').append('Detaljer');
        $('#lbl-edit-tournament-opponent').append('Modstander');
        $('#lbl-edit-tournament-location').append('Beliggenhed');
        $('#lbl-edit-tournament-date').append('Dato');
        $('#lbl-edit-tournament-description').append('Beskrivelse');
        $('#btn-update-tournament').append('Blive ved');
    }

    var places = new google.maps.places.Autocomplete(document.getElementById('edit-txt-tournament-location'));
    google.maps.event.addListener(places, 'place_changed', function() {
        place = places.getPlace();
        address = place.formatted_address;
        edit_latitude = place.geometry.location.lat();
        edit_longitude = place.geometry.location.lng();
    });

    $$('#edit-txt-opponent-name').prepend(page.query.opponent);
    $$('#edit-txt-tournament-location').prepend(page.query.location);
    $$('#edit-txt-tournament-date').val(page.query.formatted_date);
    $$('#edit-txt-tournament-description').prepend(page.query.description);
    edit_longitude = page.query.longitude;
    edit_latitude = page.query.latitude;

    $$("#edit-tournament-image").attr("data-src", (page.query.image_url == '' || page.query.image_url == null ? "img/camera-flat.png" : page.query.image_url));
    $$("#edit-tournament-image").addClass('lazy lazy-fadein');
    myApp.initImagesLazyLoad(page.container);

    $("#edit-txt-tournament-location").change(function() {
        edit_longitude = '';
        edit_latitude = '';
    });

    $$('#btn-update-tournament').on('click', function() {
        if (checkInternetConnection() == true) {
            $$('#btn-update-tournament').attr('disabled', true);
            var opponent_name = $$('#edit-txt-opponent-name').val();
            var tournament_date = $$('#edit-txt-tournament-date').val();
            var tournament_desc = $$('#edit-txt-tournament-description').val();
            var tournament_location = $$('#edit-txt-tournament-location').val();

            if (opponent_name == '' || opponent_name == null) {
                myApp.alert('Please enter opponent name!');
                $$('#btn-update-tournament').removeAttr("disabled");
                return false;
            }

            if (edit_latitude == '' || edit_longitude == '') {
                myApp.alert('Please enter a valid location!');
                $$('#btn-update-tournament').removeAttr("disabled");
                return false;
            }

            if (imgfile == '') {
                myApp.showIndicator();
                $$.ajax({
                    type: "POST",
                    url: ENVYP_API_URL + "update_tournament.php",
                    data: "account_id=" + localStorage.getItem('account_id') +
                        "&tournament_id=" + localStorage.getItem('selectedTournamentId') +
                        "&opponent=" + opponent_name +
                        "&tournament_date=" + tournament_date +
                        "&tournament_desc=" + tournament_desc +
                        "&tournament_location=" + tournament_location +
                        "&longitude=" + edit_longitude +
                        "&latitude=" + edit_latitude +
                        "&tournament_image=" + page.query.image_url,
                    dataType: "json",
                    success: function(msg, string, jqXHR) {
                        myApp.hideIndicator();
                        if (msg.status == '0') {
                            clearEditTournamentDetails();
                            mainView.router.loadPage('tournament_detail.html?tournament_id=' + localStorage.getItem('selectedTournamentId'));
                        }
                        myApp.alert(msg.message);
                        $$('#btn-update-tournament').removeAttr("disabled");
                    },
                    error: function(msg, string, jqXHR) {
                        myApp.hideIndicator();
                        myApp.alert(ERROR_ALERT);
                        $$('#btn-update-tournament').removeAttr("disabled");
                    }
                });
            } else {
                myApp.showIndicator();
                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = imgfile.substr(imgfile.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                options.chunkedMode = false;

                var params = new Object();
                params.account_id = localStorage.getItem('account_id');
                params.tournament_id = localStorage.getItem('selectedTournamentId');
                params.opponent = opponent_name;
                params.tournament_date = tournament_date;
                params.tournament_desc = tournament_desc;
                params.tournament_location = tournament_location;
                params.longitude = longitude;
                params.latitude = latitude;

                options.params = params;

                var ft = new FileTransfer();
                ft.upload(imgfile, ENVYP_API_URL + "update_tournament.php", win, fail, options);

                clearTournamentDetails();
                myApp.hideIndicator();
                $$('#btn-update_tournament-tournament').removeAttr("disabled");
                mainView.router.loadPage('tournament_detail.html?tournament_id=' + localStorage.getItem('selectedTournamentId'));
            }

        }
    });
});

/* =====Administrator List Page ===== */
myApp.onPageInit('tournament-fine-add', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-create-fine').append('Create Fine');
        $('#lbl-fine-add-details').append('Details');
        $('#lbl-fine-add-roster').append('Roster');
        $('#lbl-fine-add-fine').append('Fine');
        $('#lbl-fine-add-price').append('Price');
    } else {
        $('#lbl-create-fine').append('Opret fint');
        $('#lbl-fine-add-details').append('Detaljer');
        $('#lbl-fine-add-roster').append('Kampprogram');
        $('#lbl-fine-add-fine').append('Bøde');
        $('#lbl-fine-add-price').append('Pris');
    }

    $("#select-roster-list").empty();
    myApp.showIndicator();
    $.getJSON(ENVYP_API_URL + "get_tournament_roster.php?tournament_id=" + localStorage.getItem('selectedTournamentId'), function(result) {
        $("#select-roster-list").prepend('<option value="" selected="selected">Select a roster</option>');
        $.each(result, function(i, field) {
            if (field.status == 'empty') {
                myApp.alert('No roster yet :(');
            } else {
                $("#select-roster-list").append('<option value="' + field.roster_id + '">' + field.name + '</option>');
            }
        });
        myApp.hideIndicator();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        myApp.hideIndicator(); 
        myApp.alert(AJAX_ERROR_ALERT); 
    });

    $$('#btn-add-fine').on('click', function() {
        if (checkInternetConnection() == true) {
            $$('#btn-add-fine').attr('disabled', true);
            var roster_id = $$('#select-roster-list').val();
            var fine_description = $$('#txt-fine-description').val();
            var fine_price = $$('#txt-fine-price').val();

            if (roster_id == '' || roster_id == null) {
                myApp.alert('Please select a roster!');
                $$('#btn-add-fine').removeAttr("disabled");
                return false;
            }

            if (fine_description == '' || fine_description == null) {
                myApp.alert('Please enter fine description!');
                $$('#btn-add-fine').removeAttr("disabled");
                return false;
            }

            if (fine_price == '' || fine_price == '') {
                myApp.alert('Please enter a price!');
                $$('#btn-add-fine').removeAttr("disabled");
                return false;
            }

            myApp.showIndicator();
            $$.ajax({
                type: "POST",
                url: ENVYP_API_URL + "add_tournament_fine.php",
                data: "tournament_id=" + localStorage.getItem('selectedTournamentId') + "&account_id=" + localStorage.getItem('account_id') + "&roster_id=" + roster_id + "&fine=" + fine_description + "&price=" + fine_price,
                dataType: "json",
                success: function(msg, string, jqXHR) {
                    myApp.hideIndicator();
                    if (msg.status == 0) {
                        myApp.alert(msg.message);

                        $("#fine_list").empty();
                        myApp.showIndicator();
                        $.getJSON(ENVYP_API_URL + "get_roster_fine.php?tournament_id=" + localStorage.getItem('selectedTournamentId'), function(result) {
                            $.each(result, function(i, field) {
                                if (field.status == 'empty') {
                                    $("#fine_list").append('<li><center><p>No fine</p><center></li>');
                                } else {
                                    if (field.image_url == '' || field.image_url == null) {
                                        var image_url = "<img src='img/profile.jpg' class='img-circle' style='width:44px; height:44px;'>";
                                    } else {
                                        var image_url = "<img src='" + field.image_url + "' class='img-circle' style='width:44px; height:44px;'>";
                                    }
                                    $("#fine_list").append('<li><a href="fine_detail.html?name=' + field.name + '&image_url=' + field.image_url + '&price=' + field.price + '&description=' + field.fine + '" class="item-link item-content">' +
                                        '<div class="item-media">' + image_url + '</div>' +
                                        '<div class="item-inner">' +
                                        '<div class="item-title-row">' +
                                        '<div class="item-title">' + field.name + '</div>' +
                                        '<div class="item-after">$' + field.price + '</div>' +
                                        '</div>' +
                                        '<div class="item-subtitle"></div>' +
                                        '<div class="item-text">' + field.fine + '</div>' +
                                        '</div></a></li>');
                                }
                                // myApp.initImagesLazyLoad(page.container);
                            });
                            myApp.hideIndicator();
                        })
                        .fail(function(jqXHR, textStatus, errorThrown) {
                            myApp.hideIndicator(); 
                            myApp.alert(AJAX_ERROR_ALERT); 
                        });
                    } else {
                        myApp.alert(msg.message);
                    }
                    $$('#btn-add-fine').removeAttr("disabled");
                },
                error: function(msg, string, jqXHR) {
                    myApp.hideIndicator();
                    myApp.alert(ERROR_ALERT);
                    $$('#btn-add-fine').removeAttr("disabled");
                }
            });
        }
    });
});

/* =====Roster Tournament Stats Page ===== */
myApp.onPageInit('roster-tournament-stats', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-roster-statistics').append('Roster Statistics');
        $('#lbl-roster-tournament-points').append('Points');
        $('#lbl-roster-tournament-assists').append('Assists');
        $('#lbl-roster-tournament-fouls').append('Fouls');
        $('#lbl-roster-tournament-votes').append('Votes');
    } else {
        $('#lbl-roster-statistics').append('Kampprogram statistik');
        $('#lbl-roster-tournament-points').append('Points');
        $('#lbl-roster-tournament-assists').append('Hjælpe');
        $('#lbl-roster-tournament-fouls').append('foul');
        $('#lbl-roster-tournament-votes').append('Stemme');
    }

     if ((localStorage.getItem('currentTeamAdmin') != localStorage.getItem('account_id')) && localStorage.getItem('currentAccountIsTeamAdmin') == 0) {
        $('#btn-edit-roster-stats').hide();
    }

    var points = 0;
    var assists = 0;
    var fouls = 0;
    var votes = 0;

    $$("#roster-image").attr("data-src", (page.query.roster_image == '' || page.query.roster_image == null ? "img/profile.jpg" : page.query.roster_image));
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
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        myApp.hideIndicator(); 
        myApp.alert(AJAX_ERROR_ALERT); 
    });

    $$('#btn-edit-roster-stats').on('click', function() {
        mainView.router.loadPage('edit_roster_tournament_stats.html?roster_image=' + page.query.roster_image + '&roster_id=' + page.query.roster_id + '&roster_name=' + page.query.roster_name + '&roster_position=' + page.query.roster_position + '&points=' + points + '&assists=' + assists + '&fouls=' + fouls);
    });
});

/* =====Edit Roster Tournament Stats Page ===== */
myApp.onPageInit('edit-roster-tournament-stats', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-edit-statistics').append('Roster Statistics');
        $('#lbl-edit-roster-statistics-points').append('Points');
        $('#lbl-edit-roster-statistics-assists').append('Assists');
        $('#lbl-edit-roster-statistics-fouls').append('Fouls');
    } else {
        $('#lbl-roster-statistics').append('Kampprogram statistik');
        $('#lbl-edit-roster-statistics-points').append('Points');
        $('#lbl-edit-roster-statistics-assists').append('Hjælpe');
        $('#lbl-edit-roster-statistics-fouls').append('foul');
    }

    $$("#edit-roster-image").attr("data-src", (page.query.roster_image == '' || page.query.roster_image == null ? "img/profile.jpg" : page.query.roster_image));
    $$("#edit-roster-image").addClass('lazy lazy-fadein');
    myApp.initImagesLazyLoad(page.container);

    $$('#edit-roster-name').prepend(page.query.roster_name);
    $$('#edit-roster-position').prepend(page.query.roster_position);

    $$("#edit-roster-points").attr("value", page.query.points);
    $$("#edit-roster-assists").attr("value", page.query.assists);
    $$("#edit-roster-fouls").attr("value", page.query.fouls);

    $$('#btn-update-roster-stats').on('click', function() {
        if (checkInternetConnection() == true) {
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

            myApp.showIndicator();
            $$.ajax({
                type: "POST",
                url: ENVYP_API_URL + "update_roster_tournament_stats.php",
                data: "account_id=" + localStorage.getItem('account_id') + "&tournament_id=" + localStorage.getItem('selectedTournamentId') + "&roster_id=" + page.query.roster_id + "&points=" + roster_points + "&assists=" + roster_assists + "&fouls=" + roster_fouls,
                dataType: "json",
                success: function(msg, string, jqXHR) {
                    myApp.hideIndicator();
                    if (msg.status == '0') {
                        mainView.router.loadPage('tournament_detail.html?tournament_id=' + localStorage.getItem('selectedTournamentId'));
                    }
                    myApp.alert(msg.message);
                    $$('#btn-update-roster-stats').removeAttr("disabled");
                },
                error: function(msg, string, jqXHR) {
                    myApp.hideIndicator();
                    myApp.alert(ERROR_ALERT);
                    $$('#btn-update-roster-stats').removeAttr("disabled");
                }
            });
        }
    });
});

/* =====Edit Tournament Stats Page ===== */
myApp.onPageInit('edit-tournament-stats', function(page) {
    $$('#txt-edit-team-name').prepend("Team: <b>" + page.query.team_name + "</b>");
    $$('#txt-edit-opponent-name').prepend("Opponent: <b>" + page.query.opponent_name + "</b>");
    $$('#txt-edit-team-points').attr("value", page.query.team_points);
    $$('#txt-edit-team-assists').attr("value", page.query.team_assists);
    $$('#txt-edit-team-fouls').attr("value", page.query.team_fouls);
    $$('#txt-edit-opponent-points').attr("value", page.query.opponent_points);
    $$('#txt-edit-opponent-assists').attr("value", page.query.opponent_assists);
    $$('#txt-edit-opponent-fouls').attr("value", page.query.opponent_fouls);

    $$('#btn-update-tournament-stats').on('click', function() {
        if (checkInternetConnection() == true) {
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

            myApp.showIndicator();
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
                    myApp.hideIndicator();
                    if (msg.status == '0') {
                        mainView.router.loadPage('tournament_detail.html?tournament_id=' + localStorage.getItem('selectedTournamentId'));
                    }
                    myApp.alert(msg.message);
                    $$('#btn-update-tournament-stats').removeAttr("disabled");
                },
                error: function(msg, string, jqXHR) {
                    myApp.hideIndicator();
                    myApp.alert(ERROR_ALERT);
                    $$('#btn-update-tournament-stats').removeAttr("disabled");
                }
            });
        }
    });
});

/* =====Administrator List Page ===== */
myApp.onPageInit('tournament-roster-list', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-tournament-roster-list').append('Roster List');
    } else {
        $('#lbl-tournament-roster-list').append('Kampprogram liste');
    }

    var selectedRosters = new Array();

    if (checkInternetConnection() == true) {
        var items = [];
        myApp.showIndicator();
        $.getJSON(ENVYP_API_URL + "get_tournament_roster_list.php?tournament_id=" + localStorage.getItem('selectedTournamentId') + "&team_id=" + localStorage.getItem('selectedTeamID'), function(result) {
            $.each(result, function(i, field) {
                if (field.status == 'empty') {
                    myApp.alert('No roster available :(');
                } else {
                    var roster_image = (field.image_url == '' || field.image_url == null ? "img/profile.jpg" : field.image_url);
                    items.push({
                        roster_id: field.roster_id,
                        roster_name: field.roster_name,
                        roster_position: field.roster_position,
                        roster_image: roster_image
                    });
                }
            });

            var virtualList = myApp.virtualList($$(page.container).find('.virtual-list'), {
                items: items,
                searchAll: function(query, items) {
                    var found = [];
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].roster_name.indexOf(query) >= 0 || query.trim() === '') found.push(i);
                    }
                    return found;
                },
                template: '<li>' +
                    '<label class="label-checkbox item-content">' +
                    '<input id="checkbox-roster" type="checkbox" name="ks-media-checkbox" value="{{roster_id}}"/>' +
                    '<div class="item-media"><img src="{{roster_image}}" class="img-circle" style="width:44px; height:44px;"/></div>' +
                    '<div class="item-inner">' +
                    '<div class="item-title-row">' +
                    '<div class="item-title">{{roster_name}}</div>' +
                    '<div class="item-after"><i class="icon icon-form-checkbox"></i></div>' +
                    '</div>' +
                    '<div class="item-subtitle">{{roster_position}}</div>' +
                    '</div>' +
                    '</label>' +
                    '</li>',
                height: 73,
            });
            myApp.hideIndicator();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            myApp.hideIndicator(); 
            myApp.alert(AJAX_ERROR_ALERT); 
        });
    } else {
        myApp.alert(NO_INTERNET_ALERT);
    }

    $$('#btn-tournament-detail-back').on('click', function(e) {
        $("input:checkbox[id=checkbox-roster]:checked").each(function() {
            selectedRosters.push($(this).val());
        });

        if (selectedRosters.length != 0) {
            myApp.showIndicator();
            $$.ajax({
                type: "POST",
                url: ENVYP_API_URL + "add_roster_tournament.php",
                data: "roster_ids=" + selectedRosters + "&tournament_id=" + localStorage.getItem('selectedTournamentId') + "&account_id=" + localStorage.getItem('account_id'),
                dataType: "json",
                success: function(msg, string, jqXHR) {
                    myApp.hideIndicator();
                    if (msg.status == 0) {
                        myApp.alert(msg.message);

                        $("#roster_list").empty();
                        myApp.showIndicator();
                        $.getJSON(ENVYP_API_URL + "get_tournament_roster.php?tournament_id=" + localStorage.getItem('selectedTournamentId'), function(result) {
                            $.each(result, function(i, field) {
                                if (field.status == 'empty') {
                                    $("#roster_list").append('<li><center><p>No roster</p><center></li>');
                                } else {
                                    if (field.image_url == '' || field.image_url == null) {
                                        var image_url = "<img src='img/profile.jpg' class='img-circle' style='width:44px; height:44px;'>";
                                    } else {
                                        var image_url = "<img src='" + field.image_url + "' class='img-circle' style='width:44px; height:44px;'>";
                                    }
                                    $("#roster_list").append('<li>' +
                                        '<a href="roster_tournament_stats.html?roster_id=' + field.roster_id + '&roster_name=' + field.name + '&roster_position=' + field.position + '&roster_image=' + field.image_url + '" class="item-link item-content">' +
                                        '<div class="item-media">' + image_url + '</div>' +
                                        '<div class="item-inner">' +
                                        '<div class="item-title-row">' +
                                        '<div class="item-title">' + field.name + '</div>' +
                                        '</div>' +
                                        '<div class="item-subtitle">' + field.position + '</div>' +
                                        '</div></a></li>');
                                }
                                // myApp.initImagesLazyLoad(page.container);
                            });
                            myApp.hideIndicator();
                        })
                        .fail(function(jqXHR, textStatus, errorThrown) {
                            myApp.hideIndicator(); 
                            myApp.alert(AJAX_ERROR_ALERT); 
                        });

                        $("#select-vote-list").empty();
                            myApp.showIndicator();
                            $.getJSON(ENVYP_API_URL + "get_tournament_roster.php?tournament_id=" + localStorage.getItem('selectedTournamentId'), function(result) {
                                $("#select-vote-list").prepend('<option value="" selected="selected">Select a roster</option>');
                                $.each(result, function(i, field) {
                                    if (field.status == 'empty') {
                                        myApp.alert('No roster yet :(');
                                    } else {
                                        $("#select-vote-list").append('<option value="' + field.roster_id + '">' + field.name + '</option>');
                                    }
                                });
                                myApp.hideIndicator();
                            })
                            .fail(function(jqXHR, textStatus, errorThrown) {
                                myApp.hideIndicator(); 
                                myApp.alert(AJAX_ERROR_ALERT); 
                            });
                    } else {
                        myApp.alert(msg.message);
                    }
                },
                error: function(msg, string, jqXHR) {
                    myApp.hideIndicator();
                    myApp.alert(ERROR_ALERT);
                }
            });
        }
    });
});

function getTournamentImage() {
    myApp.modal({
        title: 'Choose Tournament Image',
        verticalButtons: true,
        buttons: [{
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
                } catch (err) {
                    myApp.alert('camera error: ' + err.message);
                }
            }
        }, {
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
                } catch (err) {
                    myApp.alert('camera error: ' + err.message);
                }
            }
        }, {
            text: 'Cancel',
            onClick: function() {}
        }]
    });
}

function editTournamentImage() {
    myApp.modal({
        title: 'Choose Tournament Image',
        verticalButtons: true,
        buttons: [{
            text: 'Take new picture',
            onClick: function() {
                try {
                    navigator.camera.getPicture(attachEditTournamentImage, function(message) {
                        myApp.alert('No image selected');
                    }, {
                        quality: 100,
                        destinationType: navigator.camera.DestinationType.FILE_URI,
                        sourceType: navigator.camera.PictureSourceType.CAMERA,
                        targetWidth: 400,
                        targetHeight: 400,
                        correctOrientation: true
                    });
                } catch (err) {
                    myApp.alert('camera error: ' + err.message);
                }
            }
        }, {
            text: 'Select from gallery',
            onClick: function() {
                try {
                    navigator.camera.getPicture(attachEditTournamentImage, function(message) {
                        myApp.alert('No image selected');
                    }, {
                        quality: 100,
                        destinationType: navigator.camera.DestinationType.FILE_URI,
                        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                        targetWidth: 400,
                        targetHeight: 400,
                        correctOrientation: true
                    });
                } catch (err) {
                    myApp.alert('camera error: ' + err.message);
                }
            }
        }, {
            text: 'Cancel',
            onClick: function() {}
        }]
    });
}

function getRosterImage() {
    myApp.modal({
        title: 'Choose Roster Image',
        verticalButtons: true,
        buttons: [{
            text: 'Take new picture',
            onClick: function() {
                try {
                    navigator.camera.getPicture(attachRosterImage, function(message) {
                        myApp.alert('No image selected');
                    }, {
                        quality: 100,
                        destinationType: navigator.camera.DestinationType.FILE_URI,
                        sourceType: navigator.camera.PictureSourceType.CAMERA,
                        targetWidth: 400,
                        targetHeight: 400,
                        correctOrientation: true
                    });
                } catch (err) {
                    myApp.alert('camera error: ' + err.message);
                }
            }
        }, {
            text: 'Select from gallery',
            onClick: function() {
                try {
                    navigator.camera.getPicture(attachRosterImage, function(message) {
                        myApp.alert('No image selected');
                    }, {
                        quality: 100,
                        destinationType: navigator.camera.DestinationType.FILE_URI,
                        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                        targetWidth: 400,
                        targetHeight: 400,
                        correctOrientation: true
                    });
                } catch (err) {
                    myApp.alert('camera error: ' + err.message);
                }
            }
        }, {
            text: 'Cancel',
            onClick: function() {}
        }]
    });
}

function editRosterImage() {
    myApp.modal({
        title: 'Choose Roster Image',
        verticalButtons: true,
        buttons: [{
            text: 'Take new picture',
            onClick: function() {
                try {
                    navigator.camera.getPicture(attachEditRosterImage, function(message) {
                        myApp.alert('No image selected');
                    }, {
                        quality: 100,
                        destinationType: navigator.camera.DestinationType.FILE_URI,
                        sourceType: navigator.camera.PictureSourceType.CAMERA,
                        targetWidth: 400,
                        targetHeight: 400,
                        correctOrientation: true
                    });
                } catch (err) {
                    myApp.alert('camera error: ' + err.message);
                }
            }
        }, {
            text: 'Select from gallery',
            onClick: function() {
                try {
                    navigator.camera.getPicture(attachEditRosterImage, function(message) {
                        myApp.alert('No image selected');
                    }, {
                        quality: 100,
                        destinationType: navigator.camera.DestinationType.FILE_URI,
                        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                        targetWidth: 400,
                        targetHeight: 400,
                        correctOrientation: true
                    });
                } catch (err) {
                    myApp.alert('camera error: ' + err.message);
                }
            }
        }, {
            text: 'Cancel',
            onClick: function() {}
        }]
    });
}

function getTeamImage() {
    myApp.modal({
        title: 'Choose Team Image',
        verticalButtons: true,
        buttons: [{
            text: 'Take new picture',
            onClick: function() {
                try {
                    navigator.camera.getPicture(attachTeamImage, function(message) {
                        myApp.alert('No image selected');
                    }, {
                        quality: 100,
                        destinationType: navigator.camera.DestinationType.FILE_URI,
                        sourceType: navigator.camera.PictureSourceType.CAMERA,
                        targetWidth: 400,
                        targetHeight: 400,
                        correctOrientation: true
                    });
                } catch (err) {
                    myApp.alert('camera error: ' + err.message);
                }
            }
        }, {
            text: 'Select from gallery',
            onClick: function() {
                try {
                    navigator.camera.getPicture(attachTeamImage, function(message) {
                        myApp.alert('No image selected');
                    }, {
                        quality: 100,
                        destinationType: navigator.camera.DestinationType.FILE_URI,
                        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                        targetWidth: 400,
                        targetHeight: 400,
                        correctOrientation: true
                    });
                } catch (err) {
                    myApp.alert('camera error: ' + err.message);
                }
            }
        }, {
            text: 'Cancel',
            onClick: function() {}
        }]
    });
}

function editTeamImage() {
    myApp.modal({
        title: 'Choose Team Image',
        verticalButtons: true,
        buttons: [{
            text: 'Take new picture',
            onClick: function() {
                try {
                    navigator.camera.getPicture(attachEditTeamImage, function(message) {
                        myApp.alert('No image selected');
                    }, {
                        quality: 100,
                        destinationType: navigator.camera.DestinationType.FILE_URI,
                        sourceType: navigator.camera.PictureSourceType.CAMERA,
                        targetWidth: 400,
                        targetHeight: 400,
                        correctOrientation: true
                    });
                } catch (err) {
                    myApp.alert('camera error: ' + err.message);
                }
            }
        }, {
            text: 'Select from gallery',
            onClick: function() {
                try {
                    navigator.camera.getPicture(attachEditTeamImage, function(message) {
                        myApp.alert('No image selected');
                    }, {
                        quality: 100,
                        destinationType: navigator.camera.DestinationType.FILE_URI,
                        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                        targetWidth: 400,
                        targetHeight: 400,
                        correctOrientation: true
                    });
                } catch (err) {
                    myApp.alert('camera error: ' + err.message);
                }
            }
        }, {
            text: 'Cancel',
            onClick: function() {}
        }]
    });
}

function getProfileImage() {
    myApp.modal({
        title: 'Choose Profile Image',
        verticalButtons: true,
        buttons: [{
            text: 'Take new picture',
            onClick: function() {
                try {
                    navigator.camera.getPicture(attachProfileImage, function(message) {
                        myApp.alert('No image selected');
                    }, {
                        quality: 100,
                        destinationType: navigator.camera.DestinationType.FILE_URI,
                        sourceType: navigator.camera.PictureSourceType.CAMERA,
                        targetWidth: 400,
                        targetHeight: 400,
                        correctOrientation: true
                    });
                } catch (err) {
                    myApp.alert('camera error: ' + err.message);
                }
            }
        }, {
            text: 'Select from gallery',
            onClick: function() {
                try {
                    navigator.camera.getPicture(attachProfileImage, function(message) {
                        myApp.alert('No image selected');
                    }, {
                        quality: 100,
                        destinationType: navigator.camera.DestinationType.FILE_URI,
                        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                        targetWidth: 400,
                        targetHeight: 400,
                        correctOrientation: true
                    });
                } catch (err) {
                    myApp.alert('camera error: ' + err.message);
                }
            }
        }, {
            text: 'Cancel',
            onClick: function() {}
        }]
    });
}

function chooseLanguage() {
    myApp.modal({
        title: 'Choose Language',
        horizontalButtons: true,
        buttons: [{
            text: 'English',
            onClick: function() {
                localStorage.setItem('selectedLanguage', '1');
                $('#lbl-choose-sports').empty();
                $('#lbl-choose-sports').prepend('Choose Sports');
                $('#lbl-profile').empty();
                $('#lbl-profile').prepend('Profile');
                $('#btn-edit-profile').empty();
                $('#btn-edit-profile').prepend('Edit Profile');
                $('#btn-choose-language').empty();
                $('#btn-choose-language').prepend('Language');
                $('#btn-logout').empty();
                $('#btn-logout').prepend('Logout');
                $('#lbl-team-settings').empty();
                $('#lbl-team-settings').prepend('Settings');
                $('#lbl-team-participants').empty();
                $('#lbl-team-participants').prepend('Participants');
                $('#lbl-team-administrators').empty();
                $('#lbl-team-administrators').prepend('Administrators');
            }
        }, {
            text: 'Danish',
            onClick: function() {
                localStorage.setItem('selectedLanguage', '2');
                $('#lbl-choose-sports').empty();
                $('#lbl-choose-sports').prepend('Vælg Sport');
                $('#lbl-profile').empty();
                $('#lbl-profile').prepend('Profil');
                $('#btn-edit-profile').empty();
                $('#btn-edit-profile').prepend('Rediger profil');
                $('#btn-choose-language').empty();
                $('#btn-choose-language').prepend('Sprog');
                $('#btn-logout').empty();
                $('#btn-logout').prepend('Log ud');
                $('#lbl-team-settings').empty();
                $('#lbl-team-settings').prepend('Indstillinger');
                $('#lbl-team-participants').empty();
                $('#lbl-team-participants').prepend('Deltagere');
                $('#lbl-team-administrators').empty();
                $('#lbl-team-administrators').prepend('Administratorer');
            }   
        }]
    });
}

function attachTournamentImage(imageURI) {
    imgfile = imageURI
    $$("#tournament-image").attr("src", imgfile);
}

function attachEditTournamentImage(imageURI) {
    imgfile = imageURI
    $$("#edit-tournament-image").attr("src", imgfile);
}

function attachRosterImage(imageURI) {
    imgfile = imageURI
    $$("#roster-image").attr("src", imgfile);
}

function attachEditRosterImage(imageURI) {
    imgfile = imageURI
    $$("#edit-roster-image").attr("src", imgfile);
}

function attachTeamImage(imageURI) {
    imgfile = imageURI
    $$("#team-image").attr("src", imgfile);
}

function attachEditTeamImage(imageURI) {
    imgfile = imageURI
    $$("#edit-team-image").attr("src", imgfile);
}

function attachProfileImage(imageURI) {
    imgfile = imageURI
    $$("#profile-image").attr("src", imgfile);
}

function win(r) {
    var resp = JSON.parse(r.response);
    myApp.alert(resp.message);
}

function winUpdateUser(r) {
    var resp = JSON.parse(r.response);
    myApp.alert(resp.message);
    if (resp.status == '0') {
        localStorage.setItem('account_image', resp.account_image);
        $$('#img-profile-image').attr('src', resp.account_image);
    }
}

function winTeamAdd(r) {
    var resp = JSON.parse(r.response);
    myApp.alert(resp.message);
    if (resp.status == '0') {
        mainView.router.loadPage('team_management.html?team_id=' + resp.team_id + '&team_name=' + resp.team_name);
    }
}

function fail(error) {
    myApp.alert("An error has occurred with error code " + error.code + ", please try again.");
}

function getTeamPassword(team_id, team_admin, team_name, team_password, team_image) {
    if (team_admin != localStorage.getItem('account_id')) {
        isAccountInvited(team_id, function(response) {
            if (response.status == true) {
                myApp.prompt('Please enter a password', function(data) {
                    if (data == team_password) {
                        localStorage.setItem('currentAccountIsTeamAdmin', response.is_admin);
                        mainView.router.loadPage('team_management.html?team_id=' + team_id + '&team_name=' + team_name + '&team_admin=' + team_admin + '&team_image=' + team_image);
                    } else {
                        myApp.alert('Incorrect team password!');
                    }
                });
            } else {
                myApp.alert('You are not invited on this event');
            }
        })
    } else {
        mainView.router.loadPage('team_management.html?team_id=' + team_id + '&team_name=' + team_name + '&team_admin=' + team_admin + '&team_image=' + team_image);
    }
}

function isAccountInvited(team_id, callback) {
    myApp.showIndicator();
    $$.ajax({
        type: "POST",
        url: ENVYP_API_URL + "check_if_account_invited.php",
        data: "account_id=" + localStorage.getItem('account_id') + "&team_id=" + team_id,
        dataType: "json",
        success: function(msg, string, jqXHR) {
            myApp.hideIndicator();
            callback(msg);
        },
        error: function(msg, string, jqXHR) {
            myApp.hideIndicator();
        }
    });
}

function getParticipantList() {
    $("#list-view-participants").empty();

    if (localStorage.getItem('selectedLanguage') == '1') {
        var lbl_add_participant = 'Add participants';
    } else {
        var lbl_add_participant = 'Tilføj deltagere';
    }

    if ((localStorage.getItem('currentTeamAdmin') == localStorage.getItem('account_id')) || localStorage.getItem('currentAccountIsTeamAdmin') == 1) {
        $("#list-view-participants").prepend('<li>' +
            '<div class="item-content">' +
            '<div class="item-inner">' +
            '<div class="item-title"><a href="account_list.html" class="link"><font size="2">'+lbl_add_participant+'</font></a></div>' +
            '</div>' +
            '</div>' +
            '</li>');
    }

    var items = [];
    myApp.showIndicator();
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
                    '<div class="item-media"><img src="' + account_image + '" class="img-circle" style="width:44px; height:44px;"/></div>' +
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
        myApp.hideIndicator();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        myApp.hideIndicator(); 
        myApp.alert(AJAX_ERROR_ALERT); 
    });
}

function getTeamAdministratorList() {
    $("#list-view-administrator").empty();

    if (localStorage.getItem('selectedLanguage') == '1') {
        var lbl_add_administrator = 'Add administrator';
    } else {
        var lbl_add_administrator = 'Tilføj administrator';
    }

    if ((localStorage.getItem('currentTeamAdmin') == localStorage.getItem('account_id')) || localStorage.getItem('currentAccountIsTeamAdmin') == 1) {
        $("#list-view-administrator").prepend('<li>' +
            '<div class="item-content">' +
            '<div class="item-inner">' +
            '<div class="item-title"><a href="administrator_list.html" class="link"><font size="2">'+lbl_add_administrator+'</font></a></div>' +
            '</div>' +
            '</div>' +
            '</li>');
    }

    var items = [];
    myApp.showIndicator();
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
                    '<div class="item-media"><img src="' + account_image + '" class="img-circle" style="width:44px; height:44px;"/></div>' +
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
        myApp.hideIndicator();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        myApp.hideIndicator(); 
        myApp.alert(AJAX_ERROR_ALERT); 
    });
}

function removeParticipant(account_id) {
    myApp.showIndicator();
    $$.ajax({
        type: "POST",
        url: ENVYP_API_URL + "delete_participant.php",
        data: "account_id=" + account_id,
        dataType: "json",
        success: function(msg, string, jqXHR) {
            myApp.hideIndicator();
            if (msg.status == 0) {
                getParticipantList();
                getTeamAdministratorList();
            } else {
                console.log(msg.message);
            }
        },
        error: function(msg, string, jqXHR) {
            myApp.hideIndicator();
            myApp.alert(ERROR_ALERT);
        }
    });
}

function removeAsAdministrator(account_id) {
    myApp.showIndicator();
    $$.ajax({
        type: "POST",
        url: ENVYP_API_URL + "delete_administrator.php",
        data: "account_id=" + account_id + "&team_id=" + localStorage.getItem('selectedTeamID'),
        dataType: "json",
        success: function(msg, string, jqXHR) {
            myApp.hideIndicator();
            if (msg.status == 0) {
                getParticipantList();
                getTeamAdministratorList();
            } else {
                console.log(msg.message);
            }
        },
        error: function(msg, string, jqXHR) {
            myApp.hideIndicator();
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
    imgfile = '';
}

function clearEditTeamDetails() {
    $$('#edit-txt-team-name').val('');
    $$('#edit-txt-team-description').val('');
    imgfile = '';
}

function clearRosterDetails() {
    $$('#txt-roster-name').val('');
    $$('#txt-roster-position').val('');
    imgfile = '';
}

function clearEditRosterDetails() {
    $$('#edit-txt-roster-name').val('');
    $$('#edit-txt-roster-position').val('');
    imgfile = '';
}

function clearTournamentDetails() {
    $("#txt-tournament-date").val(new Date().toJSON().slice(0, 16));
    $$('#txt-opponent-name').val('');
    $$('#txt-tournament-description').val('');
    imgfile = '';
}

function clearEditTournamentDetails() {
    $("#edit-txt-tournament-date").val(new Date().toJSON().slice(0, 16));
    $$('#edit-txt-opponent-name').val('');
    $$('#edit-txt-tournament-description').val('');
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

var fbLoginSuccess = function (userData) {   
    if (userData.status === 'connected') {
        getFBDetails();
    } else if (userData.status === 'not_authorized') {

    } else {

    }   
}

function FBLogin() {
    if (checkInternetConnection() == true ) {
        try {
            facebookConnectPlugin.login(["public_profile"],
                fbLoginSuccess,
                function (error) { 
                    myApp.alert("[ERROR] " + error);
                }
            );
        } catch(err) {
            myApp.alert('[ERROR] ' + err.message);
        } 
    } else {
        myApp.alert(NO_INTERNET_ALERT);
    }
}

function FBLogout() {
    facebookConnectPlugin.logout(function(response) {
    });
}

function getFBDetails() {
    // facebookConnectPlugin.api("me/?fields=id,last_name,first_name,email,birthday",["public_profile","email"],
    facebookConnectPlugin.api("me/?fields=id,last_name,first_name,email,birthday",["public_profile"],
        function (result) {

        $$('#btn-email-login').attr('disabled', true);
        $$('#btn-signup-page').attr('disabled', true);
        myApp.alert(result.id + ' ' + result.first_name + ' ' + result.last_name);
        $$.ajax({
            type: "POST",
            url: ENVYP_API_URL + "add_facebook_user.php",
            data: "facebook_id=" + result.id,
            dataType: "json",
            success: function(msg, string, jqXHR) {
                myApp.alert('status: ' + msg.status);
                if (msg.status == 1) {
                    localStorage.setItem('account_id', msg.account_id);
                    localStorage.setItem('email', msg.email);
                    localStorage.setItem('first_name', msg.first_name);
                    localStorage.setItem('last_name', msg.last_name);
                    localStorage.setItem('age', msg.age);
                    localStorage.setItem('description', msg.description);
                    localStorage.setItem('account_image', msg.account_image);

                    $$('#div-profile-name').prepend(localStorage.getItem('first_name') + ' ' + localStorage.getItem('last_name'));
                    $$('#img-profile-image').attr('src', (localStorage.getItem('account_image') == '' || localStorage.getItem('account_image') == null ? "img/profile.jpg" : localStorage.getItem('account_image')));

                    mainView.router.loadPage('choose_sports.html');
                } else if (msg.status == 0) {
                    var age = calcAge(result.birthday);
                    var fb_image = 'https://graph.facebook.com/' + result.id + '/picture?type=large';
                    $$('#img-profile-image').attr('src', fb_image);
                    mainView.router.loadPage('profile_add.html?account_id=' + msg.account_id + '&first_name=' + result.first_name + '&last_name=' + result.last_name + '&age=' + age + '&description=&image_url=' + fb_image);
                }
                $$('#btn-email-login').removeAttr("disabled");
                $$('#btn-signup-page').removeAttr("disabled");
            },
            error: function(xhr, ajaxOptions, thrownError) {
                myApp.alert("[ERROR] " + xhr.thrownError);
                $$('#btn-email-login').removeAttr("disabled");
                $$('#btn-signup-page').removeAttr("disabled");
            }
        });
    }, function (error) {
        myApp.alert("[ERROR] " + error);
    });
}

function calcAge(dateString) {
    var birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (31557600000));
}

