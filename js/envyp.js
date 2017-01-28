var myApp = new Framework7({
    modalTitle: 'Envp',
    material: true,
    preloadPreviousPage: false,
    fastClicks: true,
    pushState: true,
    swipePanelOnlyClose: 'left'
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
const PUSHBOT_APP_ID = "583d247f4a9efa72608b4567";
const PUSHBOT_SENDER_ID = "280176703234";

var imgfile = '';
var latitude = '';
var longitude = '';
var edit_latitude = '';
var edit_longitude = '';

document.addEventListener('deviceready', function() {
    var notificationOpenedCallback = function(jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };
    window.plugins.OneSignal
        .startInit("536dcb4f-f5f0-4327-adb5-2f70746e20bf", "280176703234")
        .handleNotificationReceived(function(jsonData) {
            console.log('Did I receive a notification: ' + JSON.stringify(jsonData));
            // alert("Notification received:\n" + JSON.stringify(jsonData));
        })
        .handleNotificationOpened(function(jsonData) {
            // alert("Notification opened:\n" + JSON.stringify(jsonData));
            console.log('didOpenRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
        })
        .endInit();

    window.plugins.OneSignal.getIds(function(ids) {
        localStorage.setItem('oneSignalUserId', ids.userId);
        localStorage.setItem('oneSignalPushToken', ids.pushToken);
        console.log('getIds: ' + JSON.stringify(ids));
    });
}, false);

document.addEventListener('backbutton', onBackKeyDown, false);

if (localStorage.getItem('selectedLanguage') == '' || localStorage.getItem('selectedLanguage') == null) {
    localStorage.setItem('selectedLanguage', '1');
}

if (localStorage.getItem('currency_id') == '' || localStorage.getItem('currency_id') == null) {
    localStorage.setItem('currency_id', '1');
}

if (localStorage.getItem('time_id') == '' || localStorage.getItem('time_id') == null) {
    localStorage.setItem('time_id', '1');
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
    $('#btn-my-teams').empty();
    $('#btn-my-teams').prepend('My Teams');
    $('#btn-edit-profile').empty();
    $('#btn-edit-profile').prepend('Edit Profile');
    $('#btn-inbox').empty();
    $('#btn-inbox').prepend('Inbox');
    $('#btn-choose-language').empty();
    $('#btn-choose-language').prepend('Language');
    $('#btn-settings').empty();
    $('#btn-settings').prepend('Settings');
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
    $('#btn-my-teams').empty();
    $('#btn-my-teams').prepend('Mine Teams');
    $('#btn-edit-profile').empty();
    $('#btn-edit-profile').prepend('Rediger profil');
    $('#btn-inbox').empty();
    $('#btn-inbox').prepend('Indbakke');
    $('#btn-choose-language').empty();
    $('#btn-choose-language').prepend('Sprog');
    $('#btn-settings').empty();
    $('#btn-settings').prepend('Settings');
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
                        localStorage.setItem('isFbLogin', 0);
                        localStorage.setItem('account_id', msg.account_id);
                        localStorage.setItem('email', msg.email);
                        localStorage.setItem('first_name', msg.first_name);
                        localStorage.setItem('last_name', msg.last_name);
                        localStorage.setItem('age', msg.age);
                        localStorage.setItem('description', msg.description);
                        localStorage.setItem('account_image', msg.account_image);
                        localStorage.setItem('currency_id', msg.account_image);
                        localStorage.setItem('currency_id', msg.currency_id);
                        localStorage.setItem('time_id', msg.time_id);

                        $$('#div-profile-name').prepend(localStorage.getItem('first_name') + ' ' + localStorage.getItem('last_name'));
                        $$('#img-profile-image').attr('src', (localStorage.getItem('account_image') == '' || localStorage.getItem('account_image') == null ? "img/profile.jpg" : localStorage.getItem('account_image')));

                        addPushNotificationID();

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
    if (localStorage.getItem('isFbLogin') == 1) {
        FBLogout();
    }
    mainView.router.loadPage('main.html');
});

$$('#btn-edit-profile').on('click', function() {
    myApp.closePanel('left');
    mainView.router.loadPage('profile_add.html?account_id=' + localStorage.getItem('account_id') + '&first_name=' + localStorage.getItem('first_name') + '&last_name=' + localStorage.getItem('last_name') + '&age=' + localStorage.getItem('age') + '&description=' + localStorage.getItem('description') + '&image_url=' + localStorage.getItem('account_image'));
});

$$('#btn-forgot-pass').on('click', function() {
    myApp.prompt('Please enter your email', function(value) {
        if (validateEmail(value) == false) {
            myApp.alert('Invalid email format');
            return false;
        }
        $$.ajax({
            type: "POST",
            url: ENVYP_API_URL + "send_password.php",
            data: "email=" + value,
            dataType: "json",
            success: function(msg, string, jqXHR) {
                myApp.alert(msg.status);
            },
            error: function(xhr, ajaxOptions, thrownError) {
                myApp.alert("An error occured, please try again.");
            }
        });
    });
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
                            localStorage.setItem('isFbLogin', 0);
                            localStorage.setItem('account_id', msg.account_id);
                            localStorage.setItem('email', msg.email);
                            localStorage.setItem('first_name', msg.first_name);
                            localStorage.setItem('last_name', msg.last_name);
                            localStorage.setItem('age', msg.age);
                            localStorage.setItem('description', msg.description);
                            localStorage.setItem('account_image', msg.account_image);
                            localStorage.setItem('currency_id', msg.currency_id);
                            localStorage.setItem('time_id', msg.time_id);

                            $$('#div-profile-name').prepend(localStorage.getItem('first_name') + ' ' + localStorage.getItem('last_name'));
                            $$('#img-profile-image').attr('src', (localStorage.getItem('account_image') == '' || localStorage.getItem('account_image') == null ? "img/profile.jpg" : localStorage.getItem('account_image')));

                            addPushNotificationID();

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

    $$('#btn-forgot-pass').on('click', function() {
        myApp.prompt('Please enter your email', function(value) {
            if (validateEmail(value) == false) {
                myApp.alert('Invalid email format');
                return false;
            }
            $$.ajax({
                type: "POST",
                url: ENVYP_API_URL + "send_password.php",
                data: "email=" + value,
                dataType: "json",
                success: function(msg, string, jqXHR) {
                    myApp.alert(msg.status);
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    myApp.alert("An error occured, please try again.");
                }
            });
        });
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
            }

            if ($('#chkbox-terms').is(':checked') == false) {
                myApp.alert("Please agree with the terms and conditions");
                $$('#btn-signup').removeAttr("disabled");
                return false;
            } else {
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
                            localStorage.setItem('isFbLogin', 0);
                            addPushNotificationID();
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

    $$('#btn-terms').on('click', function() {
        myApp.popup('.popup-terms');
    });

    $$('#btn-close-terms').on('click', function() {
        myApp.closeModal('.popup-terms');
    });
});

/* =====Inbox List Page ===== */
myApp.onPageInit('inbox-list', function(page) {
    myApp.closePanel('left');

    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-inbox-list').prepend('Inbox');
    } else {
        $('#lbl-inbox-list').prepend('Indbakke');
    }

    if (checkInternetConnection() == true) {
        myApp.showIndicator();
        var items = [];
        $.getJSON(ENVYP_API_URL + "get_inbox_list.php?account_id=" + localStorage.getItem('account_id'), function(result) {
                $.each(result, function(i, field) {
                    if (field.status == 'empty') {
                        myApp.alert('No message yet :(');
                    } else {
                        $title = (field.status == 0 ? "<b>" + field.title + "</b>" : field.title);
                        $message = (field.status == 0 ? "<b>" + field.message + "</b>" : field.message);
                        items.push({
                            inbox_id: field.inbox_id,
                            account_image: field.account_image,
                            title: $title,
                            message: $message,
                            status: field.status,
                        });
                    }
                });

                var virtualList = myApp.virtualList($$(page.container).find('.virtual-list'), {
                    items: items,
                    searchAll: function(query, items) {
                        var found = [];
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].title.indexOf(query) >= 0 || query.trim() === '') found.push(i);
                        }
                        return found;
                    },
                    template: '<li>' +
                        '<a href="inbox_detail.html?inbox_id={{inbox_id}}&status={{status}}" class="item-link item-content">' +
                        '<div class="item-media"><img data-src="{{account_image}}" class="lazy lazy-fadein img-circle" style="width:44px; height:44px;"/></div>' +
                        '<div class="item-inner">' +
                        '<div class="item-title-row">' +
                        '<div class="item-title">{{title}}</div>' +
                        '</div>' +
                        '<div class="item-subtitle">{{message}}</div>' +
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

    $$('#btn-inbox-refresh').on('click', function() {
        mainView.router.reloadPage("inbox.html")
    });
});

/* =====Inbox Detail Page ===== */
myApp.onPageInit('inbox-detail', function(page) {
    myApp.showIndicator();
    $.getJSON(ENVYP_API_URL + "get_inbox_detail.php?inbox_id=" + page.query.inbox_id + "&status=" + page.query.status, function(result) {
            $.each(result, function(i, field) {
                $$('#img-inbox-image').attr('src', (field.account_image == '' || field.account_image == null ? "img/profile.jpg" : field.account_image));
                $('#div-inbox-title').prepend(field.title);
                $('#div-inbox-creator').prepend('From: ' + field.account_name);
                $('#p-inbox-message').prepend(field.message);
            });

            myApp.hideIndicator();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            myApp.hideIndicator();
            myApp.alert(AJAX_ERROR_ALERT);
        });
});

/* ===== Settings Page ===== */
myApp.onPageInit('settings', function(page) {
    myApp.closePanel('left');
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-settings').prepend('Settings');
        $('#btn-update-settings').prepend('Update');
    } else {
        $('#lbl-settings').prepend('Indstillinger');
        $('#btn-update-settings').prepend('Opdatering');
    }

    if (localStorage.getItem('currency_id') == 1) {
        myApp.smartSelectAddOption('#select-currency-list', '<option value="1" selected>USD</option>');
        myApp.smartSelectAddOption('#select-currency-list', '<option value="2">DKK</option>');
        myApp.smartSelectAddOption('#select-currency-list', '<option value="3">GBP</option>');
        myApp.smartSelectAddOption('#select-currency-list', '<option value="4">EUR</option>');
        $$('#select-currency-list').val(1);
    } else if (localStorage.getItem('currency_id') == 2) {
        myApp.smartSelectAddOption('#select-currency-list', '<option value="1">USD</option>');
       myApp.smartSelectAddOption('#select-currency-list', '<option value="2" selected>DKK</option>');
        myApp.smartSelectAddOption('#select-currency-list', '<option value="3">GBP</option>');
        myApp.smartSelectAddOption('#select-currency-list', '<option value="4">EUR</option>');
        $$('#select-currency-list').val(2);
    } else if (localStorage.getItem('currency_id') == 3) {
        myApp.smartSelectAddOption('#select-currency-list', '<option value="1">USD</option>');
        myApp.smartSelectAddOption('#select-currency-list', '<option value="2">DKK</option>');
        myApp.smartSelectAddOption('#select-currency-list', '<option value="3" selected>GBP</option>');
        myApp.smartSelectAddOption('#select-currency-list', '<option value="4">EUR</option>');
        $$('#select-currency-list').val(3);
    } else if (localStorage.getItem('currency_id') == 4) {
        myApp.smartSelectAddOption('#select-currency-list', '<option value="1">USD</option>');
        myApp.smartSelectAddOption('#select-currency-list', '<option value="2">DKK</option>');
        myApp.smartSelectAddOption('#select-currency-list', '<option value="3">GBP</option>');
        myApp.smartSelectAddOption('#select-currency-list', '<option value="4" selected>EUR</option>');
        $$('#select-currency-list').val(4);
    }

    if (localStorage.getItem('time_id') == 1) {
        myApp.smartSelectAddOption('#select-time-list', '<option value="1" selected>24-Hour Clock</option>');
        myApp.smartSelectAddOption('#select-time-list', '<option value="2">12-Hour Clock</option>');
        $$('#select-time-list').val("1");
    } else if (localStorage.getItem('time_id') == 2) {
        myApp.smartSelectAddOption('#select-time-list', '<option value="1">24-Hour Clock</option>');
        myApp.smartSelectAddOption('#select-time-list', '<option value="2" selected>12-Hour Clock</option>');
        $$('#select-time-list').val("2");
    }    

    $$('#btn-update-settings').on('click', function() {
        if (checkInternetConnection() == true) {
            var currency_id = $$('#select-currency-list').val();
            var time_id = $$('#select-time-list').val();  

            $$('#btn-update-settings').attr('disabled', true);
            myApp.showIndicator();
            $$.ajax({
                type: "POST",
                url: ENVYP_API_URL + "update_settings.php",
                data: "account_id=" + localStorage.getItem('account_id') + "&currency_id=" + currency_id + "&time_id=" + time_id,
                dataType: "json",
                success: function(msg, string, jqXHR) {
                    myApp.hideIndicator();
                    if (msg.status == '0') {
                        myApp.alert('Success');
                        localStorage.setItem('currency_id', currency_id);
                        localStorage.setItem('time_id', time_id);
                    } else {
                        myApp.alert(msg.message);
                    }
                    $$('#btn-update-settings').removeAttr("disabled");
                },
                error: function(msg, string, jqXHR) {
                    myApp.hideIndicator();
                    myApp.alert(ERROR_ALERT);
                    $$('#btn-update-settings').removeAttr("disabled");
                }
            });
        } else {
            myApp.alert(NO_INTERNET_ALERT);
        }
    });
});   

/* ===== Add Profile Page ===== */
myApp.onPageInit('profile-add', function(page) {
    // alert('localstorate: '+localStorage.getItem('account_id')+'; page.query: '+page.query.account_id);
    var account_image = '';
    // alert('is fb login: ' + localStorage.getItem('isFbLogin'));
    if (page.query.account_id != undefined) {
        $$('#txt-firstname').val(page.query.first_name);
        $$('#txt-lastname').val(page.query.last_name);
        $$('#txt-age').val(page.query.age);
        $$('#txt-description').val(page.query.description);
        if (localStorage.getItem('isFbLogin') == 1) {
            // alert('fb login');
            account_image = localStorage.getItem('fb_image');
            $$('#profile-image').attr('src', account_image);
            // localStorage.setItem('account_image', localStorage.getItem('fb_image'));
        } else {
            // alert('not fb login');
            account_image = page.query.image_url;
            $$('#profile-image').attr('src', (account_image == '' || account_image == null ? "img/profile.jpg" : account_image));
        }

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
                    data: "account_id=" + localStorage.getItem('account_id') + "&first_name=" + first_name + "&last_name=" + last_name + "&age=" + age + "&description=" + description + "&image_url=" + (account_image == undefined ? '' : account_image),
                    dataType: "json",
                    success: function(msg, string, jqXHR) {
                        myApp.hideIndicator();
                        if (msg.status == '0') {
                            myApp.alert('Success');
                            clearLogInDetails();
                            localStorage.setItem('account_image', msg.account_image);
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
            // alert('account image: ' + localStorage.getItem('account_image'));
            $$('#img-profile-image').attr('src', (localStorage.getItem('account_image') == '' || localStorage.getItem('account_image') == null ? "img/profile.jpg" : localStorage.getItem('account_image')));
        } else {
            myApp.alert(NO_INTERNET_ALERT);
        }
    });
});

/* ===== Choose Sports Page ===== */
myApp.onPageInit('choose-sports', function(page) {
    $("#div-inbox-badge").empty();

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

    //Check if have notification
    $$.ajax({
        type: "POST",
        url: ENVYP_API_URL + "get_inbox_count.php",
        data: "account_id=" + localStorage.getItem('account_id'),
        dataType: "json",
        success: function(msg, string, jqXHR) {
            if (msg.inbox_count > 0) {
                $("#div-inbox-badge").prepend('<span class="badge bg-red">' + msg.inbox_count + '</span>');
            }
        },
        error: function(msg, string, jqXHR) {}
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
        $('#btn-make-new-team').prepend('opret nyt nye hold');
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
        $('#btn-add-team').prepend('tilføj');
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
                            localStorage.setItem('currentAccountIsTeamAdmin', 1);
                            mainView.router.loadPage('team_management.html?team_id=' + msg.team_id + '&team_name=' + team_name + '&team_password=' + team_password);
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

/* ===== Team edit Page ===== */
myApp.onPageInit('team-edit', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-edit-team').prepend('Edit Team');
        $('#lbl-team-edit-upload-image').prepend('Upload Image');
        $('#lbl-team-edit-details').prepend('Details');
        $('#lbl-team-edit-name').prepend('Team name');
        $('#lbl-team-edit-description').prepend('Description');
        $('#lbl-team-edit-password').prepend('Password');
        $('#btn-edit-team').prepend('Continue');
    } else {
        $('#lbl-edit-team').prepend('Edit Team');
        $('#lbl-team-edit-upload-image').prepend('Upload billede');
        $('#lbl-team-edit-details').prepend('Detaljer');
        $('#lbl-team-edit-name').prepend('Hold navn');
        $('#lbl-team-edit-description').prepend('Beskrivelse');
        $('#lbl-team-edit-password').prepend('Adgangskode');
        $('#btn-edit-team').prepend('tilføj');
    }

    myApp.showIndicator();
    var image_url = '';
    $.getJSON(ENVYP_API_URL + "get_team_detail.php?team_id=" + localStorage.getItem('selectedTeamID'), function(result) {
            $.each(result, function(i, field) {
                image_url = field.image_url;
                if (image_url != '') $('#team-edit-image').attr('src',image_url);
                $('#txt-team-edit-name').attr('value',field.name);
                $('#txt-team-edit-password').attr('value',field.password);
                $('#txt-team-edit-description').prepend(field.description);
            });
            myApp.hideIndicator();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            myApp.hideIndicator();
            myApp.alert(AJAX_ERROR_ALERT);
        });  

    $$('#btn-edit-team').on('click', function() {
        if (checkInternetConnection() == true) {
            $$('#btn-edit-team').attr('disabled', true);
            var team_name = $$('#txt-team-edit-name').val();
            var team_description = $$('#txt-team-edit-description').val();
            var team_password = $$('#txt-team-edit-password').val();

            if (team_name == '' || team_name == null) {
                myApp.alert('Please enter team name!');
                $$('#btn-edit-team').removeAttr("disabled");
                return false;
            }

            if (team_password == '' || team_password == null) {
                myApp.alert('Please enter team password!');
                $$('#btn-edit-team').removeAttr("disabled");
                return false;
            }

            if (imgfile == '') {
                myApp.showIndicator();
                $$.ajax({
                    type: "POST",
                    url: ENVYP_API_URL + "update_team.php",
                    data: "account_id=" + localStorage.getItem('account_id') + "&team_id=" + localStorage.getItem('selectedTeamID') + "&team_name=" + team_name + "&team_description=" + team_description + "&team_password=" + team_password + "&team_image=" + image_url,
                    dataType: "json",
                    success: function(msg, string, jqXHR) {
                        myApp.hideIndicator();
                        if (msg.status == '0') {
                            clearEditTeamDetails();
                            mainView.router.loadPage('team_management.html?team_id=' + localStorage.getItem('selectedTeamID') + '&team_name=' + team_name + '&team_password=' + team_password);
                        }
                        myApp.alert(msg.message);
                        $$('#btn-edit-team').removeAttr("disabled");
                    },
                    error: function(msg, string, jqXHR) {
                        myApp.hideIndicator();
                        myApp.alert(ERROR_ALERT);
                        $$('#btn-edit-team').removeAttr("disabled");
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
                params.team_name = team_name;
                params.team_description = team_description;
                params.team_password = team_password;
                params.team_image = image_url;

                options.params = params;

                var ft = new FileTransfer();
                ft.upload(imgfile, ENVYP_API_URL + "update_team.php", winTeamAdd, fail, options);

                clearEditTeamDetails();
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
                            team_image: (field.team_image == '' || field.team_image == null ? "img/envp-icon-e.png" : field.team_image),
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
                    template: '<li class="swipeout">' +
                        '<a href="#" onclick="getTeamPassword({{team_id}},{{team_admin}},\'{{team_name}}\',\'{{team_password}}\',\'{{team_image}}\',2)" class="item-link item-content swipeout-content">' +
                        '<div class="item-media"><img data-src="{{team_image}}" class="lazy lazy-fadein img-circle" style="width:44px; height:44px;"/></div>' +
                        '<div class="item-inner">' +
                        '<div class="item-title-row">' +
                        '<div class="item-title">{{team_name}}</div>' +
                        '</div>' +
                        '<div class="item-subtitle">Administrator: {{created_by}}</div>' +
                        '</div>' +
                        '</a><div class="swipeout-actions-left">' +
                            '<a href="#" class="demo-actions" onClick="reportTeamAbusiveContent({{team_id}})">Report</a>' +
                        '</div></li>',
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

    $$('#btn-team-list-refresh').on('click', function() {
        mainView.router.reloadPage("team_list.html")
    });
});

/* ===== Team List Page ===== */
myApp.onPageInit('my-team-list', function(page) {
    myApp.closePanel('left');
    
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-my-team-list').prepend('My Team List');
    } else {
        $('#lbl-my-team-list').prepend('Mine Team liste');
    }

    if (checkInternetConnection() == true) {
        myApp.showIndicator();
        var items = [];
        $.getJSON(ENVYP_API_URL + "get_my_team_list.php?account_id=" + localStorage.getItem('account_id'), function(result) {
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
                    template: '<li class="swipeout">' +
                        '<a href="#" onclick="getTeamPassword({{team_id}},{{team_admin}},\'{{team_name}}\',\'{{team_password}}\',\'{{team_image}}\',1)" class="item-link item-content swipeout-content">' +
                        '<div class="item-media"><img data-src="{{team_image}}" class="lazy lazy-fadein img-circle" style="width:44px; height:44px;"/></div>' +
                        '<div class="item-inner">' +
                        '<div class="item-title-row">' +
                        '<div class="item-title">{{team_name}}</div>' +
                        '</div>' +
                        '<div class="item-subtitle">Administrator: {{created_by}}</div>' +
                        '</div>' +
                        '</a><div class="swipeout-actions-left">' +
                            '<a href="#" class="demo-actions" onClick="reportTeamAbusiveContent({{team_id}})">Report</a>' +
                        '</div></li>',
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

    $$('#btn-my-team-list-refresh').on('click', function() {
        mainView.router.reloadPage("my_team_list.html")
    });
});

/* ===== Team Stats Page ===== */
myApp.onPageInit('team-stats', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-team-stats').prepend('Team Statistics');
    } else {
        $('#lbl-team-stats').prepend('Team statistik');
    }

    if (localStorage.getItem('selectedSportID') == 3 || localStorage.getItem('selectedSportID') == 4) {
        $('#li-team-stats-fouls').hide();
        $('#lbl-team-games').append('games');
        $('#lbl-team-stats-opp-points').append('opponent goals/mål');
        $('#lbl-team-stats-points').append('goals/mål');
        $('#lbl-team-stats-assists').append('assists');
        $('#lbl-team-stats-yellowcard').append('yellow card');
        $('#lbl-team-stats-redcard').append('red card');
    } else if (localStorage.getItem('selectedSportID') == 2 || localStorage.getItem('selectedSportID') == 5) {
        $('#li-team-stats-yellowcard').hide();
        $('#li-team-stats-redcard').hide();
        $('#lbl-team-games').append('games');
        $('#lbl-team-stats-opp-points').append('opponent goals/mål');
        $('#lbl-team-stats-points').append('goals/mål');
        $('#lbl-team-stats-assists').append('assists');
        $('#lbl-team-stats-fouls').append('fouls/minutes');
    } else if (localStorage.getItem('selectedSportID') == 1 || localStorage.getItem('selectedSportID') == 6) {
        $('#li-team-stats-yellowcard').hide();
        $('#li-team-stats-redcard').hide();
        $('#lbl-team-games').append('games');
        $('#lbl-team-stats-opp-points').append('opponent points');
        $('#lbl-team-stats-points').append('points');
        $('#lbl-team-stats-assists').append('assists');
        $('#lbl-team-stats-fouls').append('fouls');
    }

    $('#li-team-stats-assists').hide();

    var ppg = 0;
    var oppg = 0;
    var apg = 0;
    var fpg = 0;
    var yellowcard = 0;
    var redcard = 0;

    $$("#img-team-image").attr("data-src", (localStorage.getItem('selectedTeamImage') == '' || localStorage.getItem('selectedTeamImage') == null ? "img/profile.jpg" : localStorage.getItem('selectedTeamImage')));
    $$("#img-team-image").addClass('lazy lazy-fadein');
    myApp.initImagesLazyLoad(page.container);

    $$('#p-team-name').prepend(localStorage.getItem('selectedTeamName'));

    myApp.showIndicator();
    $.getJSON(ENVYP_API_URL + "get_team_stats.php?team_id=" + localStorage.getItem('selectedTeamID'), function(result) {
            $.each(result, function(i, field) {
                total_games = field.total_games;
                ppg = field.ppg
                oppg = field.oppg
                apg = field.apg
                fpg = field.fpg
                yellowcard = field.yellowcard
                redcard = field.redcard
                win = field.win;
                lose = field.lose;
                draw = field.draw;
            });

            $('#team-games').prepend(total_games);
            $('#team-ppg').prepend(ppg);
            $('#team-oppg').prepend(oppg);
            $('#team-apg').prepend(apg);
            $('#team-fpg').prepend(fpg);
            $('#team-yellowcard').prepend(yellowcard);
            $('#team-redcard').prepend(redcard);
            $('#team-win-lose').prepend('W ' + win + ' - L ' + lose + ' - D ' + draw);

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
        $('#btn-fines').append('Fines');
    } else {
        $('#btn-roster').append('mandskab');
        $('#btn-tournament').append('Turnering');
        $('#btn-statistics').append('Statistik');
        $('#btn-fines').append('Bøder');
    }

    if (page.query.team_id != null) {
        localStorage.setItem('selectedTeamName', page.query.team_name);
        localStorage.setItem('selectedTeamID', page.query.team_id);
        localStorage.setItem('selectedTeamName', page.query.team_name);
        localStorage.setItem('selectedTeamImage', page.query.team_image);
        localStorage.setItem('selectedTeamPassword', page.query.team_password);
        localStorage.setItem('currentTeamAdmin', page.query.team_admin);
    }

    if ((localStorage.getItem('currentTeamAdmin') != localStorage.getItem('account_id')) && localStorage.getItem('currentAccountIsTeamAdmin') == 0) {
        $('#btn-edit-team-detail').hide();
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

    $$('#btn-team-manage-back').on('click', function() {
        if (localStorage.getItem('backTournament') == 1) {
            mainView.router.loadPage('my_team_list.html');
        } else if (localStorage.getItem('backTournament') == 2) {
            mainView.router.loadPage('team_list.html');
        }
    });
});

/* =====Fines List Page ===== */
myApp.onPageInit('fines-list', function(page) { 
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-fines-list').append('Fines List');
    } else {
        $('#lbl-fines-list').append('fines liste');
    }

    if (checkInternetConnection() == true) {
        var items = [];
        myApp.showIndicator();
        $.getJSON(ENVYP_API_URL + "get_roster_fines.php?team_id=" + localStorage.getItem('selectedTeamID') + "&currency_id=" + localStorage.getItem('currency_id'), function(result) {
                $.each(result, function(i, field) {
                    if (field.status == 'empty') {
                        myApp.alert('No roster fines yet :(');
                    } else {
                        var roster_image = (field.image_url == '' || field.image_url == null ? "img/profile.jpg" : field.image_url);
                        items.push({
                            roster_id: field.roster_id,
                            roster_name: field.name,
                            roster_image: roster_image,
                            roster_position: field.position,
                            total_price: field.total_price
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
                    template: '<li><a href="fine_detail_list.html?roster_id={{roster_id}}" class="item-link item-content">' +
                        '<div class="item-media"><img data-src="{{roster_image}}" class="lazy lazy-fadein img-circle" style="width:44px; height:44px;"/></div>' +
                        '<div class="item-inner">' +
                        '<div class="item-title-row">' +
                        '<div class="item-title">{{roster_name}}</div>' +
                        '<div class="item-after">{{total_price}}</div>' +
                        '</div>' +
                        '<div class="item-subtitle">{{roster_position}}</div>' +
                        '<div class="item-text"></div>' +
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

    $$('#btn-fines-list-refresh').on('click', function() {
        mainView.router.reloadPage("fines_list.html")
    });
});

/* =====Fines Detail List Page ===== */
myApp.onPageInit('fine-detail-list', function(page) { 
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-fine-details-list').append('Fines Detail List');
    } else {
        $('#lbl-fines-details-list').append('fines Detalje liste');
    }

    if (checkInternetConnection() == true) {
        var items = [];
        myApp.showIndicator();
        $.getJSON(ENVYP_API_URL + "get_roster_fine_details_list.php?roster_id=" + page.query.roster_id + "&time_id=" + localStorage.getItem('time_id') + "&currency_id=" + localStorage.getItem('currency_id'), function(result) {
                $.each(result, function(i, field) {
                    if (field.status == 'empty') {
                        myApp.alert('No roster fines yet :(');
                    } else {
                        var tournament_image = (field.image_url == '' || field.image_url == null ? "img/profile.jpg" : field.image_url);
                        items.push({
                            tournament_image: tournament_image,
                            opponent: field.opponent,
                            fine: field.fine,
                            date: field.date,
                            price: field.price
                        });
                    }
                });

                // var virtualList = myApp.virtualList($$(page.container).find('.virtual-list'), {
                //     items: items,
                //     searchAll: function(query, items) {
                //         var found = [];
                //         for (var i = 0; i < items.length; i++) {
                //             if (items[i].opponent.indexOf(query) >= 0 || query.trim() === '') found.push(i);
                //         }
                //         return found;
                //     },
                //     template: '<li class="item-content">' +
                //         '<div class="item-media"><img data-src="{{tournament_image}}" class="lazy lazy-fadein img-circle" style="width:44px; height:44px;"/></div>' +
                //         '<div class="item-inner">' +
                //         '<div class="item-title-row">' +
                //         '<div class="item-title">{{opponent}}</div>' +
                //         '<div class="item-after">${{price}}</div>' +
                //         '</div>' +
                //         '<div class="item-subtitle">{{date}}</div>' +
                //         '<div class="item-text">{{fine}}</div>' +
                //         '</div></li>',
                //     height: 93,
                // });

                var virtualList = myApp.virtualList($$(page.container).find('.virtual-list'), {
                    items: items,
                    searchAll: function(query, items) {
                        var found = [];
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].opponent.indexOf(query) >= 0 || query.trim() === '') found.push(i);
                        }
                        return found;
                    },
                    template: '<li class="item-content">' +
                        '<div class="item-media"><img data-src="{{tournament_image}}" class="lazy lazy-fadein img-circle" style="width:44px; height:44px;"/></div>' +
                        '<div class="item-inner">' +
                        '<div class="item-title-row">' +
                        '<div class="item-title">{{opponent}}</div>' +
                        '<div class="item-after">{{price}}</div>' +
                        '</div>' +
                        '<div class="item-subtitle">{{date}}</div>' +
                        '<div class="item-text">{{fine}}</div>' +
                        '</div></li>',
                    height: function (item) {
                        if (item.fine) return 93; //item with picture is 100px height
                        else return 93; //item without picture is 44px height
                    }
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

    $$('#btn-fines-detail-list-refresh').on('click', function() {
        mainView.router.reloadPage("fine_detail_list.html?roster_id="+page.query.roster_id)
    });
});

/* =====Roster List Page ===== */
myApp.onPageInit('roster-list', function(page) { 
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-roster-list').empty();
        $('#lbl-roster-list').append('Roster List');
    } else {
        $('#lbl-roster-list').empty();
        $('#lbl-roster-list').append('mandskab liste');
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
                    template: '<li class="swipeout demo-remove-callback"><a href="roster_detail.html?roster_id={{roster_id}}&roster_name={{roster_name}}&roster_position={{roster_position}}&roster_image={{roster_image}}" class="item-link item-content swipeout-content">' +
                        '<div class="item-media"><img data-src="{{roster_image}}" class="lazy lazy-fadein img-circle" style="width:44px; height:44px;"/></div>' +
                        '<div class="item-inner">' +
                        '<div class="item-title-row">' +
                        '<div class="item-title">{{roster_name}}</div>' +
                        '<div class="item-after"></div>' +
                        '</div>' +
                        '<div class="item-subtitle">{{roster_position}}</div>' +
                        '<div class="item-text"></div>' +
                        '</div></a><div class="swipeout-actions-left">' +
                            '<a href="#" class="demo-actions" onClick="reportRosterAbusiveContent({{roster_id}})">Report</a>' +
                            '<a href="#" id="btn-swipe-delete" onClick="deleteRoster({{roster_id}})" data-confirm="Are you sure you want to delete? All votes and fines will be lost once you remove this roster." class="swipeout-delete">Delete</a>' +
                        '</div></li>',
                    height: 73,
                });
                myApp.initImagesLazyLoad(page.container);
                myApp.hideIndicator();

                if ((localStorage.getItem('currentTeamAdmin') != localStorage.getItem('account_id')) && localStorage.getItem('currentAccountIsTeamAdmin') == 0) {
                    // $( "li" ).removeClass( "swipeout" );
                    $('#btn-swipe-delete').hide(); 
                }

                $$('.demo-remove-callback').on('deleted', function () {
                    $$.ajax({
                        type: "POST",
                        url: ENVYP_API_URL + "delete_roster.php",
                        data: "roster_id=" + localStorage.getItem('selectedRosterID'),
                        dataType: "json",
                        success: function(msg, string, jqXHR) {
                        },
                        error: function(msg, string, jqXHR) {
                            // myApp.alert(ERROR_ALERT);
                        }
                    });
                });
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                myApp.hideIndicator();
                myApp.alert(AJAX_ERROR_ALERT);
            });
    } else {
        myApp.alert(NO_INTERNET_ALERT);
    }

    $$('#btn-roster-list-refresh').on('click', function() {
        mainView.router.reloadPage("roster_list.html")
    });
});

function deleteRoster(roster_id) {
    localStorage.setItem('selectedRosterID', roster_id);
}

function reportRosterAbusiveContent(content) {
    myApp.prompt('Please enter a reason', function (value) {
        if (value != '') {
            callAbusiveContent('roster id: ' + content, value);
        } else {
            myApp.alert('Reason cannot be blank');
        }
    });
}

function reportTeamAbusiveContent(content) {
    myApp.prompt('Please enter a reason', function (value) {
        if (value != '') {
            callAbusiveContent('team id: ' + content, value);
        } else {
            myApp.alert('Reason cannot be blank');
        }
    });
}

function reportTournamentAbusiveContent(content) {
    myApp.prompt('Please enter a reason', function (value) {
        if (value != '') {
            callAbusiveContent('tournament id: ' + content, value);
        } else {
            myApp.alert('Reason cannot be blank');
        }
    });
}

function callAbusiveContent(content, value) {
    myApp.showIndicator();
            $$.ajax({
                type: "POST",
                url: ENVYP_API_URL + "add_abusive_content.php",
                data: "account_id=" + localStorage.getItem('account_id') +
                    "&content=" + content +
                    "&reason=" + value,
                dataType: "json",
                success: function(msg, string, jqXHR) {
                    myApp.hideIndicator();
                    myApp.alert(msg.message);
                },
                error: function(msg, string, jqXHR) {
                    myApp.hideIndicator();
                    myApp.alert(ERROR_ALERT);
                }
            });
}

/* ===== Roster Add Page ===== */
myApp.onPageInit('roster-add', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-add-roster').append('Add Roster');
        $('#lbl-roster-add-image').append('Image');
        $('#lbl-roster-add-name').append('Roster name');
        $('#lbl-roster-add-position').append('Position');
        $('#btn-add-roster').append('Continue');
    } else {
        $('#lbl-add-roster').append('tilføj spiller');
        $('#lbl-roster-add-image').append('Billede');
        $('#lbl-roster-add-name').append('mandskab navn');
        $('#lbl-roster-add-position').append('Position');
        $('#btn-add-roster').append('tilføj');
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
                            mainView.router.loadPage('roster_add.html');
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
                ft.upload(imgfile, ENVYP_API_URL + "add_roster.php", winRoster, fail, options);

                clearRosterDetails();
                $$('#btn-add-roster').removeAttr("disabled");
            }
        }
    });
});

/* ===== Roster Detail Page ===== */
myApp.onPageInit('roster-detail', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-roster-detail').append('Roster Detail');
    } else {
        $('#lbl-roster-detail').append('mandskab detalje');
    }

    if (localStorage.getItem('selectedSportID') == 3 || localStorage.getItem('selectedSportID') == 4) {
        $('#li-roster-det-fouls').hide();
        $('#lbl-roster-det-score').append('goals/mål');
        $('#lbl-roster-det-assists').append('assists');
        $('#lbl-roster-det-yellowcard').append('yellow card');
        $('#lbl-roster-det-redcard').append('red card');
        $('#lbl-roster-det-votes').append('votes');
        $('#lbl-roster-det-mvp').append('mvp');
        $('#lbl-roster-games-played').append('games');
    } else if (localStorage.getItem('selectedSportID') == 2 || localStorage.getItem('selectedSportID') == 5) {
        $('#li-roster-det-yellowcard').hide();
        $('#li-roster-det-redcard').hide();
        $('#lbl-roster-det-score').append('goals/mål');
        $('#lbl-roster-det-assists').append('assists');
        $('#lbl-roster-det-fouls').append('fouls/minutes');
        $('#lbl-roster-det-votes').append('votes');
        $('#lbl-roster-det-mvp').append('mvp');
        $('#lbl-roster-games-played').append('games');
    } else if (localStorage.getItem('selectedSportID') == 1 || localStorage.getItem('selectedSportID') == 6) {
        $('#li-roster-det-yellowcard').hide();
        $('#li-roster-det-redcard').hide();
        $('#lbl-roster-det-score').append('points');
        $('#lbl-roster-det-assists').append('assists');
        $('#lbl-roster-det-fouls').append('fouls');
        $('#lbl-roster-det-votes').append('votes');
        $('#lbl-roster-det-mvp').append('mvp');
        $('#lbl-roster-games-played').append('games');
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
                $('#roster-yellowcard').prepend(field.yellowcard);
                $('#roster-redcard').prepend(field.redcard);
                $('#roster-votes').prepend(field.votes);
                $('#roster-mvp').prepend(field.mvp_count);
                $('#roster-games-played').prepend(field.played);
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
        $('#lbl-roster-edit-name').append('mandskab navn');
        $('#lbl-roster-edit-position').append('Position');
        $('#btn-update-roster').append('tilføj');
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
                data: "account_ids=" + selectedParticipants + "&team_id=" + localStorage.getItem('selectedTeamID') + "&team_name=" + localStorage.getItem('selectedTeamName') + "&team_password=" + localStorage.getItem('selectedTeamPassword') + "&created_by=" + localStorage.getItem('account_id'),
                dataType: "json",
                success: function(msg, string, jqXHR) {
                    myApp.hideIndicator();
                    if (msg.status == 0) {
                        if (msg.push_ids != '') {
                            var notificationObj = {
                                contents: {
                                    en: "You are invited to join " + localStorage.getItem('selectedTeamName') + " team"
                                },
                                include_player_ids: msg.push_ids
                            };
                            window.plugins.OneSignal.postNotification(notificationObj,
                                function(successResponse) {
                                    console.log("Notification Post Success:", successResponse);
                                    // alert("Notification Post Success:\n" + JSON.stringify(successResponse));
                                },
                                function(failedResponse) {
                                    console.log("Notification Post Failed: ", failedResponse);
                                    // alert("Notification Post Failed:\n" + JSON.stringify(failedResponse));
                                }
                            );
                        }
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
        $('#btn-add-tournament').append('tilføj');
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

            // if (latitude == '' || longitude == '') {
            //     myApp.alert('Please enter a valid location!');
            //     $$('#btn-add-tournament').removeAttr("disabled");
            //     return false;
            // }

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
                            // mainView.router.loadPage('tournament_list.html');
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
                // mainView.router.loadPage('tournament_list.html');
            }

        }
    });
});

/* =====Tournament List Page ===== */
myApp.onPageInit('tournament-list', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-tournament-list').append('Tournament Plan');
    } else {
        $('#lbl-tournament-list').append('Turnerings plan');
    }

    if ((localStorage.getItem('currentTeamAdmin') != localStorage.getItem('account_id')) && localStorage.getItem('currentAccountIsTeamAdmin') == 0) {
        $('#btn-show-add-tournament').hide();
    }
    if (checkInternetConnection() == true) {
        var items = [];
        myApp.showIndicator();
        $.getJSON(ENVYP_API_URL + "get_tournament_list.php?team_id=" + localStorage.getItem('selectedTeamID') + "&time_id=" + localStorage.getItem('time_id'), function(result) {
                $.each(result, function(i, field) {
                    if (field.status == 'empty') {
                        myApp.alert('No tournament yet :(');
                    } else {
                        var tournament_image = (field.image_url == '' || field.image_url == null ? "img/envp-icon-e.png" : field.image_url);
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
                    template: '<li class="swipeout">' +
                        '<a href="tournament_detail.html?tournament_id={{tournament_id}}" class="item-link item-content swipeout-content">' +
                        '<div class="item-media"><img data-src="{{tournament_image}}" style="width:44px; height:44px;" class="img-circle lazy lazy-fadein"/></div>' +
                        '<div class="item-inner">' +
                        '<div class="item-title-row">' +
                        '<div class="item-title">{{opponent}}</div>' +
                        '</div>' +
                        '<div class="item-subtitle">{{tournament_date}}</div>' +
                        '</div>' +
                        '</a><div class="swipeout-actions-left">' +
                            '<a href="#" class="demo-actions" onClick="reportTournamentAbusiveContent({{tournament_id}})">Report</a>' +
                        '</div></li>',
                    height: 76,
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

    $$('#btn-tournament-list-refresh').on('click', function() {
        mainView.router.reloadPage("tournament_list.html")
    });
});

/* =====Tournament Detail Page ===== */
myApp.onPageInit('tournament-detail', function(page) {
    imgfile = '';
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-tournament-detail').append('Detail');
        $('#lbl-tournament-detail-roster').append('Roster');
        $('#lbl-tournament-detail-stats').empty();
        $('#lbl-tournament-detail-stats').append('Statistics');
        $('#lbl-tournament-detail-fine-box').append('Fine Box');
        $('#lbl-tournament-detail-mvp').append('MVP');

        $('#lbl-tournament-detail-opponent').append('<b>Opponent</b>');
        $('#lbl-tournament-detail-location').append('<b>Location</b>');
        $('#lbl-tournament-detail-date').append('<b>Date</b>');
        $('#lbl-tournament-detail-description').append('<b>Description</b>');
        $('#btn-edit-tournament-details').append('Edit');

        $('#lbl-tournament-detail-versus').append('Versus');

        $('#lbl-tournament-detail-enter-vote').append('Enter your vote');
        $('#lbl-tournament-detail-roster-vote').append('Roster');
        $('#btn-submit-vote').append('Vote');
    } else {
        $('#lbl-tournament-detail').append('detaljer');
        $('#lbl-tournament-detail-roster').append('mandskab');
        $('#lbl-tournament-detail-stats').empty();
        $('#lbl-tournament-detail-stats').append('Statistik');
        $('#lbl-tournament-detail-fine-box').append('bødekasse');
        $('#lbl-tournament-detail-mvp').append('MVP');

        $('#lbl-tournament-detail-opponent').append('<b>Modstander</b>');
        $('#lbl-tournament-detail-location').append('<b>Beliggenhed</b>');
        $('#lbl-tournament-detail-date').append('<b>Dato</b>');
        $('#lbl-tournament-detail-description').append('<b>Beskrivelse</b>');
        $('#btn-edit-tournament-details').append('edit');

        $('#lbl-tournament-detail-versus').append('Imod');

        $('#lbl-tournament-detail-enter-vote').append('Indtast din stem');
        $('#lbl-tournament-detail-roster-vote').append('mandskab');
        $('#btn-submit-vote').append('Stem');
    }

    if (localStorage.getItem('selectedSportID') == 3 || localStorage.getItem('selectedSportID') == 4) {
        $('.col-team-fouls').hide();
        $('#lbl-tournament-detail-score').append('goals/mål');
        $('#lbl-tournament-detail-assist').append('assists');
        $('#lbl-tournament-detail-yellowcard').append('yellow card');
        $('#lbl-tournament-detail-redcard').append('red card');
    } else if (localStorage.getItem('selectedSportID') == 2 || localStorage.getItem('selectedSportID') == 5) {
        $('.col-yellowcard').hide();
        $('.col-redcard').hide();
        $('#lbl-tournament-detail-score').append('goals/mål');
        $('#lbl-tournament-detail-assist').append('assists');
        $('#lbl-tournament-detail-foul').append('fouls/minutes');
    } else if (localStorage.getItem('selectedSportID') == 1 || localStorage.getItem('selectedSportID') == 6) {
        $('.col-yellowcard').hide();
        $('.col-redcard').hide();
        $('#lbl-tournament-detail-score').append('score');
        $('#lbl-tournament-detail-assist').append('assists');
        $('#lbl-tournament-detail-foul').append('foul');
    }

    if ((localStorage.getItem('currentTeamAdmin') != localStorage.getItem('account_id')) && localStorage.getItem('currentAccountIsTeamAdmin') == 0) {
        $('#btn-edit-tournament-details').hide();
        $('#btn-edit-team-stats').hide();
        $('#btn-submit-vote').hide();
        $('#div-add-tournament-roster').hide();
        $('#div-add-tournament-fine').hide();
    }

    $('#opponent-assists').hide();
    $('#opponent-fouls').hide();
    $('#opponent-yellowcard').hide();
    $('#opponent-redcard').hide();

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

    // Preload game stats
    var team_name = '';
    var team_points = 0;
    var team_assists = 0;
    var team_fouls = 0;
    var team_yellowcard = 0;
    var team_redcard = 0;
    var opponent_name = '';
    var opponent_points = 0;
    var opponent_assists = 0;
    var opponent_fouls = 0;
    var opponent_yellowcard = 0;
    var opponent_redcard = 0;
    var win = 0;
    var lose = 0;
    var status = 0;
    var voting_status = 0;
    var team_image = '';
    var opponent_image = '';

    $('#team-name').empty();
    $('#opponent-name').empty();
    $('#team-points').empty();
    $('#opponent-points').empty();
    $('#team-assists').empty();
    $('#opponent-assists').empty();
    $('#team-fouls').empty();
    $('#opponent-fouls').empty();
    $('#team-yellowcard').empty();
    $('#opponent-yellowcard').empty();
    $('#team-redcard').empty();
    $('#opponent-redcard').empty();

    myApp.showIndicator();
    $.getJSON(ENVYP_API_URL + "get_tournament_stats.php?tournament_id=" + localStorage.getItem('selectedTournamentId'), function(result) {
            $.each(result, function(i, field) {
                team_name = localStorage.getItem('selectedTeamName');
                team_points = field.team_points;
                team_assists = field.team_assists;
                team_fouls = field.team_fouls;
                team_yellowcard = field.team_yellowcard;
                team_redcard = field.team_redcard;
                opponent_name = field.opponent;
                opponent_points = field.opponent_points;
                opponent_assists = field.opponent_assists;
                opponent_fouls = field.opponent_fouls;
                opponent_yellowcard = field.opponent_yellowcard;
                opponent_redcard = field.opponent_redcard;
                win = field.win;
                lose = field.lose;
                draw = field.draw;
                status = field.tournament_status;
                voting_status = field.voting_status;
                team_image = field.team_image;
                opponent_image = field.opponent_image;
            });

            var lbl_game = (status == 0 ? "End game" : "Game ended");
            var lbl_voting = (voting_status == 0 ? "End vote" : "Vote result");

            $$('.popop-tournament-options').on('click', function() {
                var clickedLink = this;
                var popoverHTML = '<div id="popover-tournament" class="popover">' +
                    '<div class="popover-inner">' +
                    '<div class="list-block">' +
                    '<ul>' +
                    '<li><a id="btn-end-tournament" href="#" onClick="endTournamentConfirmation(' + status + ');" class="item-link list-button">' + lbl_game + '</li>' +
                    '<li><a id="btn-end-vote" href="#" onClick="endVoteConfirmation(' + voting_status + ');" class="item-link list-button">' + lbl_voting + '</li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                myApp.popover(popoverHTML, clickedLink);
            });

            $$('#team-name').prepend(team_name);
            $$('#opponent-name').prepend(opponent_name);
            $$('#team-points').prepend(team_points);
            $$('#opponent-points').prepend(opponent_points);
            $$('#team-assists').prepend(team_assists);
            $$('#opponent-assists').prepend(opponent_assists);
            $$('#team-fouls').prepend(team_fouls);
            $$('#opponent-fouls').prepend(opponent_fouls);
            $$('#team-yellowcard').prepend(team_yellowcard);
            $$('#opponent-yellowcard').prepend(opponent_yellowcard);
            $$('#team-redcard').prepend(team_redcard);
            $$('#opponent-redcard').prepend(opponent_redcard);
            $$('#tournament-win-lose').prepend('W ' + win + ' - L ' + lose + ' - D ' + draw);
            $$('#tournament-score').prepend(team_points + ' - ' + opponent_points);

            if (team_image != '' && team_image != undefined) {
                $$("#img-tournament-det-team-image").attr("src", team_image);
            }

            if (opponent_image != '' && opponent_image != undefined) {
                $$("#img-tournament-det-opp-image").attr("src", opponent_image);
            }

            myApp.initImagesLazyLoad(page.container);

            if (status == '0') {
                $$('#tournament-status').prepend('Ongoing');
            } else {
                $$('#tournament-status').prepend('Final');
            }

            myApp.hideIndicator();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            myApp.hideIndicator();
            myApp.alert(AJAX_ERROR_ALERT);
        });

    $$('#btn-edit-team-stats').on('click', function() {
        mainView.router.loadPage('edit_tournament_stats.html?team_name=' + team_name + '&opponent_name=' + opponent_name + '&team_points=' + team_points + '&opponent_points=' + opponent_points + '&team_assists=' + team_assists + '&opponent_assists=' + opponent_assists + '&team_fouls=' + team_fouls + '&opponent_fouls=' + opponent_fouls + '&team_yellowcard=' + team_yellowcard + '&team_redcard=' + team_redcard + '&opponent_yellowcard=' + opponent_yellowcard + '&opponent_redcard=' + opponent_redcard);
    });
    // End Preload game stats

    // Preload game details
    myApp.showIndicator();
    $.getJSON(ENVYP_API_URL + "get_tournament_detail.php?tournament_id=" + localStorage.getItem('selectedTournamentId') + "&time_id=" + localStorage.getItem('time_id'), function(result) {
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

    $$('#btn-edit-tournament-details').on('click', function() {
        mainView.router.loadPage('tournament_edit.html?tournament_id=' + page.query.tournament_id + '&opponent=' + tournament_opponent + '&location=' + tournament_location + '&date=' + tournament_date + '&description=' + tournament_description + '&image_url=' + tournament_image_url + '&longitude=' + tournament_longitude + '&latitude=' + tournament_latitude + '&formatted_date=' + tournament_formatted_date);
    });

    $$('#btn-tournament-refresh').on('click', function() {
        mainView.router.reloadPage('tournament_detail.html?tournament_id=' + localStorage.getItem('selectedTournamentId'));
    });
    // End preload game details

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
    $.getJSON(ENVYP_API_URL + "get_roster_fine.php?tournament_id=" + localStorage.getItem('selectedTournamentId') + "&currency_id=" + localStorage.getItem('currency_id'), function(result) {
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
                        '<div class="item-after">' + field.price + '</div>' +
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

            if (voting_status == 1) {
                $$('#div-vote-add').hide();
                $$('#div-vote-result').show();
            }
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
    $.getJSON(ENVYP_API_URL + "get_tournament_roster_vote_list.php?tournament_id=" + localStorage.getItem('selectedTournamentId'), function(result) {
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

            var roster_id = $$('#select-vote-list').val();

            if (roster_id == '' || roster_id == null) {
                myApp.alert('Please select a roster!');
                $$('#btn-submit-vote').removeAttr("disabled");
                return false;
            }

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

function endTournamentConfirmation(status) {
    myApp.closeModal('#popover-tournament');

    if ((localStorage.getItem('currentTeamAdmin') != localStorage.getItem('account_id')) && localStorage.getItem('currentAccountIsTeamAdmin') == 0) {
        myApp.alert('You are not allowed to end the game');
    } else {
        if (status == 0) {
            if (checkInternetConnection() == true) {
                myApp.showIndicator();
                $$.ajax({
                    type: "POST",
                    url: ENVYP_API_URL + "end_tournament.php",
                    data: "tournament_id=" + localStorage.getItem('selectedTournamentId'),
                    dataType: "json",
                    success: function(msg, string, jqXHR) {
                        myApp.hideIndicator();
                        myApp.alert(msg.message);
                        if (msg.status == 0) {
                            // $('#tournament-win-lose').empty();
                            // $$('#tournament-win-lose').prepend('W ' + msg.win + ' - L ' + msg.lose + ' - D ' + msg.draw);
                            // $('#tournament-status').empty();
                            // $$('#tournament-status').prepend('Final');
                            mainView.router.reloadPage('tournament_detail.html?tournament_id=' + localStorage.getItem('selectedTournamentId'));
                        }
                    },
                    error: function(msg, string, jqXHR) {
                        myApp.hideIndicator();
                        myApp.alert(ERROR_ALERT);
                    }
                });
            } else {
                myApp.alert(NO_INTERNET_ALERT);
            }
        }
    }


    // else {
    //     myApp.alert('Tournament is already ended!');
    // }
}

function endVoteConfirmation(status) {
    myApp.closeModal('#popover-tournament');
    if (((localStorage.getItem('currentTeamAdmin') != localStorage.getItem('account_id')) && localStorage.getItem('currentAccountIsTeamAdmin') == 0) && status == 0) {
        myApp.alert('You are not allowed to end the vote');
    } else {
        if (status == 0) {
            myApp.confirm('Are you sure you want to end the vote?', function () {
                if (checkInternetConnection() == true) {
                    myApp.showIndicator();
                    $$.ajax({
                        type: "POST",
                        url: ENVYP_API_URL + "check_voting_result.php",
                        data: "tournament_id=" + localStorage.getItem('selectedTournamentId'),
                        dataType: "json",
                        success: function(msg, string, jqXHR) {
                            myApp.hideIndicator();
                            if (msg.status == 0) {
                                if (msg.vote_count == 1) {
                                    var roster_id = msg.roster_id;
                                    myApp.showIndicator();
                                    $$.ajax({
                                        type: "POST",
                                        url: ENVYP_API_URL + "update_vote_count.php",
                                        data: "roster_id=" + roster_id,
                                        dataType: "json",
                                        success: function(msg, string, jqXHR) {
                                            myApp.hideIndicator();
                                            if (msg.status == 0) {
                                                mainView.router.loadPage('voting_result.html');
                                                myApp.alert('Vote ended successfully!');
                                            }
                                        },
                                        error: function(msg, string, jqXHR) {
                                            myApp.hideIndicator();
                                            myApp.alert(ERROR_ALERT);
                                        }
                                    });
                                } else {
                                    myApp.confirm('Oops! There was a tie, would you like to reset the voting for the top rosters?', function () {
                                          myApp.showIndicator();
                                          $$.ajax({
                                            type: "POST",
                                            url: ENVYP_API_URL + "reset_voting.php",
                                            data: "tournament_id=" + localStorage.getItem('selectedTournamentId') + "&top_vote=" + msg.top_vote,
                                            dataType: "json",
                                            success: function(msg, string, jqXHR) {
                                                myApp.hideIndicator();
                                                myApp.alert(msg.message);
                                                mainView.router.reloadPage('tournament_detail.html?tournament_id=' + localStorage.getItem('selectedTournamentId'));
                                            },
                                            error: function(msg, string, jqXHR) {
                                                myApp.hideIndicator();
                                                myApp.alert(ERROR_ALERT);
                                            }
                                        });  
                                    });
                                }
                            } else {
                                myApp.alert(msg.msg);
                            }
                        },
                        error: function(msg, string, jqXHR) {
                            myApp.hideIndicator();
                            myApp.alert(ERROR_ALERT);
                        }
                    });
                } else {
                    myApp.alert(NO_INTERNET_ALERT);
                }
            });
        } else {
            mainView.router.loadPage('voting_result.html');
        }
    }
}

/* ===== Voting Result ===== */
myApp.onPageInit('voting-result', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-mvp-result').append('MVP Result');
    } else {
        $('#lbl-mvp-result').append('MVP Resultat');
    }

    if (localStorage.getItem('selectedSportID') == 3 || localStorage.getItem('selectedSportID') == 4) {
        $('#li-mvp-fouls').hide();
        $('#lbl-mvp-points').append('goals/mål');
        $('#lbl-mvp-assists').append('assists');
        $('#lbl-mvp-yellowcard').append('yellow card');
        $('#lbl-mvp-redcard').append('red card');
        $('#lbl-mvp-votes').append('votes');
    } else if (localStorage.getItem('selectedSportID') == 2 || localStorage.getItem('selectedSportID') == 5) {
        $('#li-mvp-yellowcard').hide();
        $('#li-mvp-redcard').hide();
        $('#lbl-mvp-points').append('goals/mål');
        $('#lbl-mvp-assists').append('assists');
        $('#lbl-mvp-fouls').append('fouls');
        $('#lbl-mvp-votes').append('votes');
    } else if (localStorage.getItem('selectedSportID') == 1 || localStorage.getItem('selectedSportID') == 6) {
        $('#li-mvp-yellowcard').hide();
        $('#li-mvp-redcard').hide();
        $('#lbl-mvp-points').append('points');
        $('#lbl-mvp-assists').append('assists');
        $('#lbl-mvp-fouls').append('fouls');
        $('#lbl-mvp-votes').append('votes');
    }

    var team_name = '';
    var opponent_name = '';
    var roster_name = '';
    var roster_image = '';
    var points = 0;
    var assists = 0;
    var fouls = 0;
    var yellowcard = 0;
    var redcard = 0;
    var votes = 0;

    myApp.showIndicator();
    $.getJSON(ENVYP_API_URL + "get_mvp.php?tournament_id=" + localStorage.getItem('selectedTournamentId'), function(result) {
            $.each(result, function(i, field) {
                team_name = field.team_name
                opponent_name = field.opponent_name
                roster_name = field.roster_name
                points = field.points
                assists = field.assists
                fouls = field.fouls
                yellowcard = field.yellowcard
                redcard = field.redcard
                votes = field.votes
                roster_image = field.roster_image
            });

            $$("#img-mvp-image").attr("data-src", (roster_image == '' || roster_image == null ? "img/profile.jpg" : roster_image));
            $$("#img-mvp-image").addClass('lazy lazy-fadein');
            myApp.initImagesLazyLoad(page.container);

            $$('#mvp-name').prepend(roster_name);
            $$('#mvp-opponent').prepend('vs ' + opponent_name);

            $$('#mvp-points').prepend(points);
            $$('#mvp-assists').prepend(assists);
            $$('#mvp-fouls').prepend(fouls);
            $$('#mvp-yellowcard').prepend(yellowcard);
            $$('#mvp-redcard').prepend(redcard);
            $$('#mvp-votes').prepend(votes);

            localStorage.setItem('mvp_team_name', team_name);
            localStorage.setItem('mvp_opponent_name', opponent_name);
            localStorage.setItem('mvp_roster_name', roster_name);
            localStorage.setItem('mvp_roster_image', roster_image);

            myApp.hideIndicator();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            myApp.hideIndicator();
            myApp.alert(AJAX_ERROR_ALERT);
        });

    $$('.popop-voting-result').on('click', function() {
        var clickedLink = this;
        var popoverHTML = '<div id="popover-tournament" class="popover">' +
            '<div class="popover-inner">' +
            '<div class="list-block">' +
            '<ul>' +
            '<li><a id="btn-fb-share href="#" onClick="shareMVPOn ok(' + points + ',' + assists + ',' + fouls + ',' + yellowcard + ',' + redcard + ',' + votes + ');" class="item-link list-button"><img src="img/icon-fb-share.png" style="width:20px; height:20px" /> Facebook</li>' +
            '<li><a id="btn-instagram-share" href="#" onClick="shareMVPOnInstagram(' + points + ',' + assists + ',' + fouls + ',' + yellowcard + ',' + redcard + ',' + votes + ');" class="item-link list-button"><img src="img/icon-instagram-share.png" style="width:20px; height:20px" /> Instagram</li>'+
            '<li><a id="btn-twitter-share" href="#" onclick="shareMVPOnTwitter(' + points + ',' + assists + ',' + fouls + ',' + yellowcard + ',' + redcard + ',' + votes + ');" class="item-link list-button"><img src="img/icon-twitter-share.png" style="width:20px; height:20px" /> Twitter</li>'+
            '</ul>' +
            '</div>' +
            '</div>' +
            '</div>'
        myApp.popover(popoverHTML, clickedLink);
    });

    $$('#btn-back-tour-det').on('click', function() {
        mainView.router.loadPage('tournament_detail.html?tournament_id=' + localStorage.getItem('selectedTournamentId'));
    });
});

if (localStorage.getItem('selectedSportID') == 3 || localStorage.getItem('selectedSportID') == 4) {
    $('#li-mvp-fouls').hide();
    $('#lbl-mvp-points').append('goals/mål');
    $('#lbl-mvp-assists').append('assists');
    $('#lbl-mvp-yellowcard').append('yellow card');
    $('#lbl-mvp-redcard').append('red card');
    $('#lbl-mvp-votes').append('votes');
} else if (localStorage.getItem('selectedSportID') == 2 || localStorage.getItem('selectedSportID') == 5) {
    $('#li-mvp-yellowcard').hide();
    $('#li-mvp-redcard').hide();
    $('#lbl-mvp-points').append('goals/mål');
    $('#lbl-mvp-assists').append('assists');
    $('#lbl-mvp-fouls').append('fouls');
    $('#lbl-mvp-votes').append('votes');
} else if (localStorage.getItem('selectedSportID') == 1 || localStorage.getItem('selectedSportID') == 6) {
    $('#li-mvp-yellowcard').hide();
    $('#li-mvp-redcard').hide();
    $('#lbl-mvp-points').append('points');
    $('#lbl-mvp-assists').append('assists');
    $('#lbl-mvp-fouls').append('fouls');
    $('#lbl-mvp-votes').append('votes');
}

function shareMVPOnTwitter(points, assists, fouls, yellowcard, redcard, votes) {
    if (imgfile == '') {
        myApp.alert('Please take a picture of the MVP!');
        myApp.closeModal('.popover');
    } else {
        var roster_image = '';
        var description = '';
        var team_name = localStorage.getItem('mvp_team_name');
        var opponent_name = localStorage.getItem('mvp_opponent_name');
        var roster_name = localStorage.getItem('mvp_roster_name');
        var roster_image = localStorage.getItem('mvp_roster_image');

        if (localStorage.getItem('selectedSportID') == 3 || localStorage.getItem('selectedSportID') == 4) {
            description = "Congratualtions! You are MVP! Tillykke! Du er kampens spiller! \n" + team_name + " vs " + opponent_name + "\n" + roster_name + "\nvotes: " + votes + "\ngoals/mål: " + points + "\nassists: " + assists + "\nyellow card: " + yellowcard + "\nred card: " + redcard + "\n";
        } else if (localStorage.getItem('selectedSportID') == 2 || localStorage.getItem('selectedSportID') == 5) {
            description = "Congratualtions! You are MVP! Tillykke! Du er kampens spiller! \n" + team_name + " vs " + opponent_name + "\n" + roster_name + "\nvotes: " + votes + "\ngoals/mål: " + points + "\nassists: " + assists + "\nfouls: " + fouls + "\n";
        } else if (localStorage.getItem('selectedSportID') == 1 || localStorage.getItem('selectedSportID') == 6) {
            description = "Congratualtions! You are MVP! Tillykke! Du er kampens spiller! \n" + team_name + " vs " + opponent_name + "\n" + roster_name + "\nvotes: " + votes + "\npoints: " + points + "\nassists: " + assists + "\nfouls: " + fouls + "\n";
        }

        window.plugins.socialsharing.shareViaTwitter(description,
                                                     imgfile /* img */, 
                                                     'http://envp.dk/', 
                                                     null, 
                                                     function(errormsg){
                                                        alert("Twitter Error: " + JSON.stringify(errormsg));
                                                        myApp.closeModal('.popover');
                                                     }
                                                     );
    }
}

function shareMVPOnFacebook(points, assists, fouls, yellowcard, redcard, votes) {
    var roster_image = '';
    var description = '';
    var team_name = localStorage.getItem('mvp_team_name');
    var opponent_name = localStorage.getItem('mvp_opponent_name');
    var roster_name = localStorage.getItem('mvp_roster_name');
    var roster_image = localStorage.getItem('mvp_roster_image');

    if (localStorage.getItem('selectedSportID') == 3 || localStorage.getItem('selectedSportID') == 4) {
        description = roster_name + ":\nvotes: " + votes + "\ngoals/mål: " + points + "\nassists: " + assists + "\nyellow card: " + yellowcard + "red card: " + redcard;
    } else if (localStorage.getItem('selectedSportID') == 2 || localStorage.getItem('selectedSportID') == 5) {
        description = roster_name + ":\nvotes: " + votes + "\ngoals/mål: " + points + "\nassists: " + assists + "\nfouls: " + fouls;
    } else if (localStorage.getItem('selectedSportID') == 1 || localStorage.getItem('selectedSportID') == 6) {
        description = roster_name + ":\nvotes: " + votes + "\npoints: " + points + "\nassists: " + assists + "\nfouls: " + fouls;
    }

    var image_url = roster_image;

    if (imgfile != '') {
        myApp.showIndicator();
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = imgfile.substr(imgfile.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        options.chunkedMode = false;

        var ft = new FileTransfer();
        ft.upload(imgfile, ENVYP_API_URL + "upload_mvp_image.php", winMVP, fail, options);
        image_url = localStorage.getItem('mvp_image_url');
    }

    // if (image_url != '') {
        facebookConnectPlugin.showDialog({
            method: "feed",
            href: "http://envp.dk",
            caption: "Congratualtions! You are MVP! Tillykke! Du er kampens spiller! \n" + team_name + " vs " + opponent_name,
            description: description,
            picture: image_url,
            share_feedWeb: true
        }, function(response) {
            console.log(response);
            myApp.closeModal('.popover');
        }, function(response) {
            console.log(response);
            myApp.closeModal('.popover');
        });
    // } else {
    //     myApp.alert('Please take a picture of the MVP!');
    //     myApp.closeModal('.popover');
    // }
}

function shareMVPOnInstagram(points, assists, fouls, yellowcard, redcard, votes, roster_image) {
    try {
        Instagram.isInstalled(function (err, installed) {
            if (installed) {
                if (imgfile == '') {
                    myApp.alert('Please take a picture of the MVP!');
                    myApp.closeModal('.popover');
                } else {
                    var canvasIdOrDataUrl = imgfile;
                    var caption = '';

                    getDataUri(canvasIdOrDataUrl, function(dataUri) {
                        Instagram.share(dataUri, caption, function (err) {
                            if (err) {
                                // alert("not shared");
                            } else {
                                myApp.alert("Success!");
                            }
                        });
                    });
                    // imgfile = ''; 
                }

            } else {
                myApp.alert("Instagram is not installed");
                myApp.closeModal('.popover');
            }
        });    
    } catch (err) {
        myApp.alert('Instagram Error: ' + err.message);
        myApp.closeModal('.popover');
    }   
}

function getDataUri(url, callback) {
    var image = new Image();

    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

        canvas.getContext('2d').drawImage(this, 0, 0);

        // Get raw image data
        // callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

        // ... or get as Data URI
        callback(canvas.toDataURL('image/png'));
    };

    image.src = url;
}

/* =====Tournament Detail Page ===== */
myApp.onPageInit('fine-detail', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-fine-detail').append('Fine Detail');
        $('#lbl-fine-detail-description').append('Description');
        $('#lbl-fine-detail-price').append('Price');
    } else {
        $('#lbl-fine-detail').append('Fin detalje');
        $('#lbl-fine-detail-description').append('Beskrivelse');
        $('#lbl-fine-detail-price').append('spillere/deltagere');
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
        $('#btn-update-tournament').append('tilføj');
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

    $$("#edit-tournament-image").attr("data-src", (page.query.image_url == '' || page.query.image_url == null ? "img/envp-icon-e.png" : page.query.image_url));
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

            // if (edit_latitude == '' || edit_longitude == '') {
            //     myApp.alert('Please enter a valid location!');
            //     $$('#btn-update-tournament').removeAttr("disabled");
            //     return false;
            // }

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
    var currency = '';
    if (localStorage.getItem('currency_id') == 1) {
        currency = 'USD';
    } else if (localStorage.getItem('currency_id') == 2) {
        currency = 'DKK';
    } else if (localStorage.getItem('currency_id') == 3) {
        currency = 'GBP';
    } else if (localStorage.getItem('currency_id') == 4) {
        currency = 'EUR';
    }

    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-create-fine').append('Create Fine');
        $('#lbl-fine-add-details').append('Details');
        $('#lbl-fine-add-roster').append('Roster');
        $('#lbl-fine-add-fine').append('Fine');
        $('#lbl-fine-add-price').append('Price ' + '(' + currency + ')');
    } else {
        $('#lbl-create-fine').append('Opret fint');
        $('#lbl-fine-add-details').append('Detaljer');
        $('#lbl-fine-add-roster').append('mandskab');
        $('#lbl-fine-add-fine').append('Bøde');
        $('#lbl-fine-add-price').append('Pris ' + '(' + currency + ')');
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
                data: "tournament_id=" + localStorage.getItem('selectedTournamentId') + "&account_id=" + localStorage.getItem('account_id') + "&roster_id=" + roster_id + "&fine=" + fine_description + "&price=" + fine_price + "&currency_id=" + localStorage.getItem('currency_id'),
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
                                            '<div class="item-after">' + field.price + '</div>' +
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
    } else {
        $('#lbl-roster-statistics').append('mandskab statistik');
    }

    if (localStorage.getItem('selectedSportID') == 3 || localStorage.getItem('selectedSportID') == 4) {
        $('#li-roster-fouls').hide();
        $('#lbl-roster-tournament-points').append('goals/mål');
        $('#lbl-roster-tournament-assists').append('assists');
        $('#lbl-roster-tournament-yellowcard').append('yellow card');
        $('#lbl-roster-tournament-redcard').append('red card');
        $('#lbl-roster-tournament-votes').append('votes');
    } else if (localStorage.getItem('selectedSportID') == 2 || localStorage.getItem('selectedSportID') == 5) {
        $('#li-roster-yellowcard').hide();
        $('#li-roster-redcard').hide();
        $('#lbl-roster-tournament-points').append('goals/mål');
        $('#lbl-roster-tournament-assists').append('assists');
        $('#lbl-roster-tournament-fouls').append('fouls');
        $('#lbl-roster-tournament-votes').append('votes');
    } else if (localStorage.getItem('selectedSportID') == 1 || localStorage.getItem('selectedSportID') == 6) {
        $('#li-roster-yellowcard').hide();
        $('#li-roster-redcard').hide();
        $('#lbl-roster-tournament-points').append('points');
        $('#lbl-roster-tournament-assists').append('assists');
        $('#lbl-roster-tournament-fouls').append('fouls');
        $('#lbl-roster-tournament-votes').append('votes');
    }

    if ((localStorage.getItem('currentTeamAdmin') != localStorage.getItem('account_id')) && localStorage.getItem('currentAccountIsTeamAdmin') == 0) {
        $('#btn-edit-roster-stats').hide();
        $('#btn-delete-tournament-roster').hide();
    }

    var points = 0;
    var assists = 0;
    var fouls = 0;
    var yellowcard = 0;
    var redcard = 0;
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
                yellowcard = field.yellowcard
                redcard = field.redcard
                votes = field.votes
            });

            $$('#roster-points').prepend(points);
            $$('#roster-assists').prepend(assists);
            $$('#roster-fouls').prepend(fouls);
            $$('#roster-yellowcard').prepend(yellowcard);
            $$('#roster-redcard').prepend(redcard);
            $$('#roster-votes').prepend(votes);

            myApp.hideIndicator();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            myApp.hideIndicator();
            myApp.alert(AJAX_ERROR_ALERT);
        });

    $$('#btn-edit-roster-stats').on('click', function() {
        mainView.router.loadPage('edit_roster_tournament_stats.html?roster_id=' + page.query.roster_id + '&roster_name=' + page.query.roster_name + '&roster_position=' + page.query.roster_position + '&points=' + points + '&assists=' + assists + '&fouls=' + fouls + '&yellowcard=' + yellowcard + '&redcard=' + redcard);
    });

    $$('#btn-delete-tournament-roster').on('click', function() {
        myApp.confirm('Are you sure? All votes and fines in this tournament will be lost once you remove this roster.', function () {
            $$.ajax({
                type: "POST",
                url: ENVYP_API_URL + "delete_tournament_roster.php",
                data: "roster_id=" + page.query.roster_id + "&tournament_id=" + localStorage.getItem('selectedTournamentId'),
                dataType: "json",
                success: function(msg, string, jqXHR) {
                    mainView.router.loadPage('tournament_detail.html?tournament_id=' + localStorage.getItem('selectedTournamentId'));
                },
                error: function(msg, string, jqXHR) {
                    myApp.alert(ERROR_ALERT);
                }
            });
        });
    });
});

/* =====Edit Roster Tournament Stats Page ===== */
myApp.onPageInit('edit-roster-tournament-stats', function(page) {
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-edit-statistics').append('Roster Statistics');
    } else {
        $('#lbl-roster-statistics').append('mandskab statistik');
    }

    if (localStorage.getItem('selectedSportID') == 3 || localStorage.getItem('selectedSportID') == 4) {
        $('#li-edit-roster-fouls').hide();
        $('#lbl-edit-roster-statistics-points').append('goals/mål');
        $('#lbl-edit-roster-statistics-assists').append('assists');
        $('#lbl-edit-roster-statistics-yellowcard').append('yellow card');
        $('#lbl-edit-roster-statistics-redcard').append('red card');
    } else if (localStorage.getItem('selectedSportID') == 2 || localStorage.getItem('selectedSportID') == 5) {
        $('#li-edit-roster-yellowcard').hide();
        $('#li-edit-roster-redcard').hide();
        $('#lbl-edit-roster-statistics-points').append('goals/mål');
        $('#lbl-edit-roster-statistics-assists').append('assists');
        $('#lbl-edit-roster-statistics-fouls').append('fouls');
    } else if (localStorage.getItem('selectedSportID') == 1 || localStorage.getItem('selectedSportID') == 6) {
        $('#li-edit-roster-yellowcard').hide();
        $('#li-edit-roster-redcard').hide();
        $('#lbl-edit-roster-statistics-points').append('points');
        $('#lbl-edit-roster-statistics-assists').append('assists');
        $('#lbl-edit-roster-statistics-fouls').append('fouls');
    }

    $$('#edit-roster-name').prepend(page.query.roster_name);
    $$('#edit-roster-position').prepend(page.query.roster_position);

    $$("#edit-roster-points").attr("value", page.query.points);
    $$("#edit-roster-assists").attr("value", page.query.assists);
    $$("#edit-roster-fouls").attr("value", page.query.fouls);
    $$("#edit-roster-yellowcard").attr("value", page.query.yellowcard);
    $$("#edit-roster-redcard").attr("value", page.query.redcard);

    $('#edit-roster-assists').focusTextToEnd();
    $('#edit-roster-fouls').focusTextToEnd();
    $('#edit-roster-yellowcard').focusTextToEnd();
    $('#edit-roster-redcard').focusTextToEnd();
    $('#edit-roster-points').focusTextToEnd();

    $$('#btn-update-roster-stats').on('click', function() {
        if (checkInternetConnection() == true) {
            $$('#btn-update-roster-stats').attr('disabled', true);
            var roster_points = $$('#edit-roster-points').val();
            var roster_assists = $$('#edit-roster-assists').val();
            var roster_fouls = $$('#edit-roster-fouls').val();
            var roster_yellowcard = $$('#edit-roster-yellowcard').val();
            var roster_redcard = $$('#edit-roster-redcard').val();

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

            if (roster_yellowcard == '' || roster_yellowcard == null) {
                myApp.alert('Please enter yellow card!');
                $$('#btn-update-roster-stats').removeAttr("disabled");
                return false;
            }

            if (roster_redcard == '' || roster_redcard == null) {
                myApp.alert('Please enter red card!');
                $$('#btn-update-roster-stats').removeAttr("disabled");
                return false;
            }

            myApp.showIndicator();
            $$.ajax({
                type: "POST",
                url: ENVYP_API_URL + "update_roster_tournament_stats.php",
                data: "account_id=" + localStorage.getItem('account_id') + "&tournament_id=" + localStorage.getItem('selectedTournamentId') + "&roster_id=" + page.query.roster_id + "&points=" + roster_points + "&assists=" + roster_assists + "&fouls=" + roster_fouls + "&yellowcard=" + roster_yellowcard + "&redcard=" + roster_redcard,
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
    if (localStorage.getItem('selectedLanguage') == '1') {
        $('#lbl-edit-team-statistics').append('Edit Statistics');
    } else {
        $('#lbl-edit-team-statistics').append('Rediger statistik');
    }

    $('#li-opp-assists').hide();
    $('#li-opp-fouls').hide();
    $('#li-opp-yellowcard').hide();
    $('#li-opp-redcard').hide();

    $$('#txt-edit-team-name').prepend("Team: <b>" + page.query.team_name + "</b>");
    $$('#txt-edit-opponent-name').prepend("Opponent: <b>" + page.query.opponent_name + "</b>");
    $$('#txt-edit-team-points').attr("value", page.query.team_points);
    $$('#txt-edit-team-assists').attr("value", page.query.team_assists);
    $$('#txt-edit-team-fouls').attr("value", page.query.team_fouls);
    $$('#txt-edit-team-yellowcard').attr("value", page.query.team_yellowcard);
    $$('#txt-edit-team-redcard').attr("value", page.query.team_redcard);
    $$('#txt-edit-opponent-points').attr("value", page.query.opponent_points);
    $$('#txt-edit-opponent-assists').attr("value", page.query.opponent_assists);
    $$('#txt-edit-opponent-fouls').attr("value", page.query.opponent_fouls);
    $$('#txt-edit-opponent-yellowcard').attr("value", page.query.opponent_yellowcard);
    $$('#txt-edit-opponent-redcard').attr("value", page.query.opponent_redcard);

    $('#txt-edit-team-name').focusTextToEnd();
    $('#txt-edit-opponent-name').focusTextToEnd();
    $('#txt-edit-team-points').focusTextToEnd();
    $('#txt-edit-team-assists').focusTextToEnd();
    $('#txt-edit-team-fouls').focusTextToEnd();
    $('#txt-edit-team-yellowcard').focusTextToEnd();
    $('#txt-edit-team-redcard').focusTextToEnd();
    $('#txt-edit-opponent-points').focusTextToEnd();
    $('#txt-edit-opponent-assists').focusTextToEnd();
    $('#txt-edit-opponent-fouls').focusTextToEnd();
    $('#txt-edit-opponent-yellowcard').focusTextToEnd();
    $('#txt-edit-opponent-redcard').focusTextToEnd();

    if (localStorage.getItem('selectedSportID') == 3 || localStorage.getItem('selectedSportID') == 4) {
        $('#li-team-fouls').hide();
        $('#li-opp-fouls').hide();
        $('#lbl-edit-team-points').append('goals/mål');
        $('#lbl-edit-team-assists').append('assists');
        $('#lbl-edit-team-yellowcard').append('Yellow card');
        $('#lbl-edit-team-redcard').append('Red card');
        $('#lbl-edit-opp-points').append('goals/mål');
        $('#lbl-edit-opp-assists').append('assists');
        $('#lbl-edit-opp-yellowcard').append('yellow card');
        $('#lbl-edit-opp-redcard').append('red card');
    } else if (localStorage.getItem('selectedSportID') == 2 || localStorage.getItem('selectedSportID') == 5) {
        $('#li-team-yellowcard').hide();
        $('#li-team-redcard').hide();
        $('#li-opp-yellowcard').hide();
        $('#li-opp-redcard').hide();
        $('#lbl-edit-team-points').append('goals/mål');
        $('#lbl-edit-team-assists').append('assists');
        $('#lbl-edit-team-fouls').append('fouls/minutes');
        $('#lbl-edit-opp-points').append('goals/mål');
        $('#lbl-edit-opp-assists').append('assists');
        $('#lbl-edit-opp-fouls').append('fouls/minutes');
    } else if (localStorage.getItem('selectedSportID') == 1 || localStorage.getItem('selectedSportID') == 6) {
        $('#li-team-yellowcard').hide();
        $('#li-team-redcard').hide();
        $('#li-opp-yellowcard').hide();
        $('#li-opp-redcard').hide();
        $('#lbl-edit-team-points').append('points');
        $('#lbl-edit-team-assists').append('assists');
        $('#lbl-edit-team-fouls').append('fouls');
        $('#lbl-edit-opp-points').append('points');
        $('#lbl-edit-opp-assists').append('assists');
        $('#lbl-edit-opp-fouls').append('fouls');
    }

    $$('#btn-update-tournament-stats').on('click', function() {
        if (checkInternetConnection() == true) {
            $$('#btn-update-tournament-stats').attr('disabled', true);
            var team_points = $$('#txt-edit-team-points').val();
            var team_assists = $$('#txt-edit-team-assists').val();
            var team_fouls = $$('#txt-edit-team-fouls').val();
            var team_yellowcard = $$('#txt-edit-team-yellowcard').val();
            var team_redcard = $$('#txt-edit-team-redcard').val();
            var opponent_points = $$('#txt-edit-opponent-points').val();
            var opponent_assists = $$('#txt-edit-opponent-assists').val();
            var opponent_fouls = $$('#txt-edit-opponent-fouls').val();
            var opponent_yellowcard = $$('#txt-edit-opponent-yellowcard').val();
            var opponent_redcard = $$('#txt-edit-opponent-redcard').val();

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

            if (team_yellowcard == '' || team_yellowcard == null) {
                myApp.alert('Please enter team yellow card!');
                $$('#btn-update-tournament-stats').removeAttr("disabled");
                return false;
            }

            if (team_redcard == '' || team_redcard == null) {
                myApp.alert('Please enter team red card!');
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

            if (opponent_yellowcard == '' || opponent_yellowcard == null) {
                myApp.alert('Please enter opponent yellow card!');
                $$('#btn-update-tournament-stats').removeAttr("disabled");
                return false;
            }

            if (opponent_redcard == '' || opponent_redcard == null) {
                myApp.alert('Please enter opponent red card!');
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
                    "&team_yellowcard=" + team_yellowcard +
                    "&team_redcard=" + team_redcard +
                    "&opponent_points=" + opponent_points +
                    "&opponent_assists=" + opponent_assists +
                    "&opponent_fouls=" + opponent_fouls +
                    "&opponent_yellowcard=" + opponent_yellowcard +
                    "&opponent_redcard=" + opponent_redcard,
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
        $('#lbl-tournament-roster-list').append('mandskab liste');
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

function getMVPImage() {
    myApp.modal({
        title: 'Choose MVP Image',
        verticalButtons: true,
        buttons: [{
            text: 'Take new picture',
            onClick: function() {
                try {
                    navigator.camera.getPicture(attachMVPImage, function(message) {
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
                    navigator.camera.getPicture(attachMVPImage, function(message) {
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
                $('#btn-my-teams').empty();
                $('#btn-my-teams').prepend('My Teams');
                $('#btn-edit-profile').empty();
                $('#btn-edit-profile').prepend('Edit Profile');
                $('#btn-inbox').empty();
                $('#btn-inbox').prepend('Inbox');
                $('#btn-choose-language').empty();
                $('#btn-choose-language').prepend('Language');
                $('#btn-settings').empty();
                $('#btn-settings').prepend('Settings');
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
                $('#btn-my-teams').empty();
                $('#btn-my-teams').prepend('Mine Teams');
                $('#btn-edit-profile').empty();
                $('#btn-edit-profile').prepend('Rediger profil');
                $('#btn-inbox').empty();
                $('#btn-inbox').prepend('Indbakke');
                $('#btn-choose-language').empty();
                $('#btn-choose-language').prepend('Sprog');
                $('#btn-settings').empty();
                $('#btn-settings').prepend('Indstillinger');
                $('#btn-logout').empty();
                $('#btn-logout').prepend('Log ud');
                $('#lbl-team-settings').empty();
                $('#lbl-team-settings').prepend('Indstillinger');
                $('#lbl-team-participants').empty();
                $('#lbl-team-participants').prepend('Deltagere');
                $('#lbl-team-administrators').empty();
                $('#lbl-team-administrators').prepend('Administratorer');
            }
        }, {
            text: 'Cancel',
            onClick: function() {}
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
    $$("#team-edit-image").attr("src", imgfile);
}

function attachProfileImage(imageURI) {
    imgfile = imageURI
    $$("#profile-image").attr("src", imgfile);
}

function attachMVPImage(imageURI) {
    imgfile = imageURI
    $$("#img-mvp-image").attr("src", imgfile);
}

function win(r) {
    var resp = JSON.parse(r.response);
    myApp.alert(resp.message);
}

function winRoster(r) {
    myApp.hideIndicator();
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

function winMVP(r) {
    myApp.hideIndicator();
    var resp = JSON.parse(r.response);
    // myApp.alert(resp.image_url);
    if (resp.status == '0') {
        localStorage.setItem('mvp_image_url', resp.image_url);
    }
}

function winTeamAdd(r) {
    var resp = JSON.parse(r.response);
    myApp.alert(resp.message);
    if (resp.status == '0') {
        mainView.router.loadPage('team_management.html?team_id=' + resp.team_id + '&team_name=' + resp.team_name + '&team_password=' + resp.team_password);
    }
}

function fail(error) {
    myApp.alert("An error has occurred with error code " + error.code + ", please try again.");
}

function getTeamPassword(team_id, team_admin, team_name, team_password, team_image, backTournament) {
    if (team_admin != localStorage.getItem('account_id')) {
        isAccountInvited(team_id, function(response) {
            if (response.status == true) {
                // myApp.prompt('Please enter a password', function(data) {
                    myApp.modalPassword('Please enter a password', function (password) {
                        if (password == team_password) {
                            localStorage.setItem('currentAccountIsTeamAdmin', response.is_admin);
                            mainView.router.loadPage('team_management.html?team_id=' + team_id + '&team_name=' + team_name + '&team_admin=' + team_admin + '&team_image=' + team_image + '&team_password=' + team_password);
                        } else {
                            myApp.alert('Incorrect team password!');
                        }
                    });
                // });
            } else {
                myApp.alert('You are not invited on this event');
            }
        })
    } else {
        mainView.router.loadPage('team_management.html?team_id=' + team_id + '&team_name=' + team_name + '&team_admin=' + team_admin + '&team_image=' + team_image + '&team_password=' + team_password);
    }
    localStorage.setItem('backTournament', backTournament);
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
            '<div class="item-title"><a href="account_list.html" class="link"><font size="2">' + lbl_add_participant + '</font></a></div>' +
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
                    // $("#list-view-participants").append('<li>' +
                    //     '<div class="item-content">' +
                    //     '<div class="item-media"><img src="' + account_image + '" class="img-circle" style="width:44px; height:44px;"/></div>' +
                    //     '<div class="item-inner">' +
                    //     '<div class="item-title-row">' +
                    //     '<div class="item-title">' + field.first_name + ' ' + field.last_name + '</div>' +
                    //     '<div class="item-after"><a href="#" onClick="removeParticipant(' + field.account_id + ');" class="link icon-only link-remove-participant"><i class="fa fa-times" aria-hidden="true"></i></a></div>' +
                    //     '</div>' +
                    //     '<div class="item-subtitle">' + field.account_description + '</div>' +
                    //     '</div>' +
                    //     '</div>' +
                    //     '</li>');
                    $("#list-view-participants").append('<li>' +
                        '<div class="item-content">' +
                        '<div class="item-media"><img src="' + account_image + '" class="img-circle" style="width:44px; height:44px;"/></div>' +
                        '<div class="item-inner">' +
                        '<div class="item-title-row">' +
                        '<div class="item-title">' + field.first_name + ' ' + field.last_name + '</div>' +
                        '<div class="item-after"><i onClick="removeParticipant(' + field.account_id + ');" class="fa fa-times link-remove-participant" aria-hidden="true"></i></div>' +
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
            '<div class="item-title"><a href="administrator_list.html" class="link"><font size="2">' + lbl_add_administrator + '</font></a></div>' +
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
                    // $("#list-view-administrator").append('<li>' +
                    //     '<div class="item-content">' +
                    //     '<div class="item-media"><img src="' + account_image + '" class="img-circle" style="width:44px; height:44px;"/></div>' +
                    //     '<div class="item-inner">' +
                    //     '<div class="item-title-row">' +
                    //     '<div class="item-title">' + field.first_name + ' ' + field.last_name + '</div>' +
                    //     '<div class="item-after"><a href="#" onClick="removeAsAdministrator(' + field.account_id + ');" class="link icon-only link-remove-administrator"><i class="fa fa-times" aria-hidden="true"></i></a></div>' +
                    //     '</div>' +
                    //     '<div class="item-subtitle">' + field.account_description + '</div>' +
                    //     '</div>' +
                    //     '</div>' +
                    //     '</li>');
                    $("#list-view-administrator").append('<li>' +
                        '<div class="item-content">' +
                        '<div class="item-media"><img src="' + account_image + '" class="img-circle" style="width:44px; height:44px;"/></div>' +
                        '<div class="item-inner">' +
                        '<div class="item-title-row">' +
                        '<div class="item-title">' + field.first_name + ' ' + field.last_name + '</div>' +
                        '<div class="item-after"><i onClick="removeAsAdministrator(' + field.account_id + ');" class="fa fa-times link-remove-administrator" aria-hidden="true"></i></div>' +
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

function addPushNotificationID() {
    if (localStorage.getItem('oneSignalUserId') != '' && localStorage.getItem('oneSignalUserId') != undefined) {
        $$.ajax({
            type: "POST",
            url: ENVYP_API_URL + "add_push_notification_id.php",
            data: "account_id=" + localStorage.getItem('account_id') + "&push_id=" + localStorage.getItem('oneSignalUserId'),
            dataType: "json",
            success: function(msg, string, jqXHR) {},
            error: function(msg, string, jqXHR) {}
        });
    }
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
    $$('#txt-team-password').val('');
    $$('#team-image').attr('src', 'img/envp-icon-e.png');
    imgfile = '';
}

function clearEditTeamDetails() {
    $$('#txt-team-edit-name').val('');
    $$('#txt-team-edit-description').val('');
    $$('#txt-team-edit-password').val('');
    $$('#team-edit-image').attr('src', 'img/envp-icon-e.png');
    imgfile = '';
}

function clearRosterDetails() {
    $$('#txt-roster-name').val('');
    $$('#txt-roster-position').val('');
    $$('#roster-image').attr('src', 'img/profile.jpg');
    imgfile = '';
}

function clearEditRosterDetails() {
    $$('#edit-txt-roster-name').val('');
    $$('#edit-txt-roster-position').val('');
    $$('#edit-roster-image').attr('src', 'img/profile.jpg');
    imgfile = '';
}

function clearTournamentDetails() {
    $("#txt-tournament-date").val(new Date().toJSON().slice(0, 16));
    $$('#txt-opponent-name').val('');
    $$('#txt-tournament-location').val('');
    $$('#txt-tournament-description').val('');
    $$('#tournament-image').attr('src', 'img/envp-icon-e.png');
    imgfile = '';
}

function clearEditTournamentDetails() {
    $("#edit-txt-tournament-date").val(new Date().toJSON().slice(0, 16));
    $$('#edit-txt-opponent-name').val('');
    $$('#edit-txt-tournament-location').val('');
    $$('#edit-txt-tournament-description').val('');
    $$('#edit-image-upload').attr('src', 'img/camera-flat.png');
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
    try {
        // if (DEBUG == false) {
            var state = navigator.connection.type;
            if (state == 'none') {
                return false;
            } else {
                return true;
            }
        // } else {
        //     return true;
        // }
    } catch (err) {
        return true;
    }
    // return true;
}

var fbLoginSuccess = function(userData) {
    if (userData.status === 'connected') {
        getFBDetails();
    } else if (userData.status === 'not_authorized') {

    } else {

    }
}

function FBLogin() {
    if (checkInternetConnection() == true) {
        try {
            facebookConnectPlugin.login(["public_profile"],
                fbLoginSuccess,
                function(error) {
                    myApp.alert("[Facebook Error]: " + JSON.stringify(error));
                }
            );
        } catch (err) {
            myApp.alert('[Facebook Error]: ' + err.message);
        }
    } else {
        myApp.alert(NO_INTERNET_ALERT);
    }
}

function FBLogout() {
    facebookConnectPlugin.logout(function(response) {});
}

function getFBDetails() {
    facebookConnectPlugin.api("me/?fields=id,last_name,first_name,email,birthday", ["public_profile"],
        function(result) {
            $$('#btn-email-login').attr('disabled', true);
            $$('#btn-signup-page').attr('disabled', true);
            $$.ajax({
                type: "POST",
                url: ENVYP_API_URL + "add_facebook_user.php",
                data: "facebook_id=" + result.id,
                dataType: "json",
                success: function(msg, string, jqXHR) {
                    localStorage.setItem('isFbLogin', 1);
                    if (msg.status == 1) {
                        localStorage.setItem('account_id', msg.account_id);
                        localStorage.setItem('email', msg.email);
                        localStorage.setItem('first_name', msg.first_name);
                        localStorage.setItem('last_name', msg.last_name);
                        localStorage.setItem('age', msg.age);
                        localStorage.setItem('description', msg.description);
                        localStorage.setItem('account_image', msg.account_image);
                        localStorage.setItem('currency_id', msg.currency_id);
                        localStorage.setItem('time_id', msg.time_id);

                        $('#div-profile-name').empty();
                        $$('#div-profile-name').prepend(localStorage.getItem('first_name') + ' ' + localStorage.getItem('last_name'));
                        $$('#img-profile-image').attr('src', (localStorage.getItem('account_image') == '' || localStorage.getItem('account_image') == null ? "img/profile.jpg" : localStorage.getItem('account_image')));

                        // callPushBot();
                        mainView.router.loadPage('choose_sports.html');
                    } else if (msg.status == 0) {
                        var age = calcAge(result.birthday);
                        var fb_image = 'https://graph.facebook.com/' + result.id + '/picture?type=large';
                        localStorage.setItem('fb_image', fb_image);
                        mainView.router.loadPage('profile_add.html?account_id=' + msg.account_id + '&first_name=' + result.first_name + '&last_name=' + result.last_name + '&age=' + age + '&description=')
                    }
                    addPushNotificationID();
                    $$('#btn-email-login').removeAttr("disabled");
                    $$('#btn-signup-page').removeAttr("disabled");
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    myApp.alert("[ERROR] " + xhr.thrownError);
                    $$('#btn-email-login').removeAttr("disabled");
                    $$('#btn-signup-page').removeAttr("disabled");
                }
            });
        },
        function(error) {
            myApp.alert("[ERROR] " + error);
        });
}

function calcAge(dateString) {
    var birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (31557600000));
}

function onBackKeyDown() {
    try {
        // var view=myApp.getCurrentView();
        // if($$('.popup.popup-login').length){
        //     return false;
        // }else if($$('.popover, .actions-modal, .picker-modal').length){
        //     myApp.closeModal('.popover, .actions-modal, .picker-modal'); 
        // }else if($$('.searchbar.searchbar-active').length){
        //     $$('.searchbar.searchbar-active')[0].f7Searchbar.disable();
        // }else if($$('.photo-browser').length){
        //     $$('.photo-browser .photo-browser-close-link, .photo-browser .close-popup').trigger('click');
        // }else if($$('.popup').length && $$('.popup .view')[0].f7View){
        //     if($$('.popup .view')[0].f7View.history.length>1){
        //       view.router.back();
        //     }else{
        //       myApp.closeModal('.popup');
        //     }
        // }else if($$('.popup').length){
        //     myApp.closeModal('.popup'); 
        // }else if(view.history.length){
        //     view.router.back();
        // }

        if (mainView.activePage.name == 'choose-sports' || mainView.activePage.name == 'main') {
            if ($$('.modal-overlay').hasClass('modal-overlay-visible')) {
                myApp.closeModal();
            } else if ($$('body').hasClass('with-panel-left-cover')) {
                myApp.closePanel('left');
            } else if ($$('body').hasClass('with-panel-right-cover')) { 
                myApp.closePanel('right');
            } else {
                myApp.confirm('Do you want to Exit?', 'Exit App', function() {
                    navigator.app.clearHistory();
                    navigator.app.exitApp();
                });
            }
        } else {
            if ($$('.popup.popup-login').length > 0) {
                return false;
            } else 
            if ($$('.popover, .actions-modal, .picker-modal').length > 0) {
                myApp.closeModal('.popover, .actions-modal, .picker-modal');
            } else if ($$('.searchbar.searchbar-active').length > 0) {
                $$('.searchbar.searchbar-active')[0].f7Searchbar.disable();
            } else if ($$('.photo-browser').length > 0) {
                $$('.photo-browser .photo-browser-close-link, .photo-browser .close-popup').trigger('click');
            } else if ($$('.modal-overlay').hasClass('modal-overlay-visible')) {
                myApp.closeModal();
            } else if ($$('body').hasClass('with-panel-left-cover')) { 
                myApp.closePanel('left');
            } else if ($$('body').hasClass('with-panel-right-cover')) { 
                myApp.closePanel('right');
            } else {
                myApp.closeModal();
                var view = myApp.getCurrentView();
                view.router.back();
            }
        }
    } catch (err) {
        myApp.alert('back error: ' + err.message);
    }
}

(function($) {
    $.fn.focusTextToEnd = function() {
        this.focus();
        var $thisVal = this.val();
        this.val('').val($thisVal);
        return this;
    }
}(jQuery));