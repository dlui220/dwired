
// app/routes.js
module.exports = function(app, passport) {

    var mongoose = require('mongoose');
    var message = require('../app/msg_model.js');
    var posts = require('../app/post_model.js');
    var configDB = require('../config/database.js');

    //connect to database file (which contains db url)
    mongoose.connect(configDB.url);
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function(){
        console.log("Connected to DataBase");
        //do operations which involve interacting with DB.
    });

    var html_string = "";
    var pst_string = "";
    // Base code for querying everything in the database
    // Fetches previous messages and formats them into html_string
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//


    app.get('/', function(req, res) {
        if (logged) {
            res.render('index.ejs', {
                user : req.user
            });
        }
        else {
            res.render('intro.ejs');
        }
    });

    app.get('/login', function(req, res) {
        res.render('login.ejs'); //load login.ejs files
    });

    app.get('/dashboard', isLoggedIn, function(req, res) {
        posts.find(function (err, psts) {
            if (err) {
                return console.error(err);
            }
            //console.log("start");
            //console.log(psts);
            // console.log(messages.length);
            pst_string = "";
            for (i=0;i<psts.length;i++){
                pst_string += '<div class="ui left aligned segment"><a class="ui blue ribbon label">Class Post</a><span></span><!--<h3 class="writing">Rick Melucci</h3>--><p class="post">' + psts[i]['post'] + '</p></div><br><br><br>';
                /*'<div class="ui left floated segment center aligned chat-bubble">' + '<p>'+ psts[i]['post'] + '</p>' + '</div>';*/
                //console.log("hey");
                //console.log(pst_string);
            }
        });
        res.render('dash.ejs', {
            user : req.user, // get the user out of session and pass to template
            p : pst_string
        });
    });

    app.get('/chat', isLoggedIn, function(req, res) {
        //html_string = "";
        message.find(function (err, messages) {
            if (err) {
                return console.error(err);
            }
            // console.log(messages);
            // console.log("req.user.google.name: "+req.user.google.name);
						for (i=0;i<messages.length;i++){
								console.log(messages[i]['name']);
								if (messages[i]['name'] == (req.user.google.name+" ")){ // checks if session matches message
										console.log("current name matches message");
										html_string += '<div class="ui right floated segment center aligned chat-bubble">' + '<p>'+ messages[i]['name'] + " : "  + messages[i]['message'] + '</p>' + '</div>';
								} else {
										html_string += '<div class="ui left floated segment center aligned chat-bubble">' + '<p>'+ messages[i]['name'] + " : "  + messages[i]['message'] + '</p>' + '</div>';
								}
									 }
						});
										 res.render('messages.ejs', {
						user : req.user, // get the user out of session and pass to template
						m : html_string
				});
    });

    app.get('/files', function(req, res) {
        res.render('files.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/dashboard',
                failureRedirect : '/'
            }));
};
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
function logged(req, res) {
    if (req.isAuthenticated()){
        return true;
    };
}
