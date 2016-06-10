// app/routes.js
module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('index.ejs'); //load index.ejs files
    });

    app.get('/login', function(req, res) {
        res.render('login.ejs'); //load login.ejs files
    });

		app.get('/dashboard', isLoggedIn, function(req, res) {
				res.render('dashboard.ejs', {
						user : req.user // get the user out of session and pass to template
				});
		});

    //app.get('/chat', isLoggedIn, function(req, res) {
		app.get('/chat', function(req, res) {
        res.render('messages.ejs', {
            user : req.user // get the user out of session and pass to template
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

		app.get('/chatdata',function(res,req){
				var html_string = "";
				// Base code for querying everything in the database
				// Fetches previous messages and formats them into html_string
				//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
				message.find(function (err, messages) {
						if (err) return console.error(err);
						// console.log(messages);
						// console.log(messages.length);
						for (i=0;i<messages.length;i++){
								if (messages[i]['name'] == "Bob"){ //req.user.username ){ // checks if session matches message
										html_string += '<div class="ui right floated segment right aligned chat-bubble">' +
												'<p>'+ messages[i]['name'] + " :<br>" + messages[i]['message'] + '</p>' + '</div>';
								} else {
										html_string += '<div class="ui right floated segment left aligned chat-bubble">' +
												'<p>'+ messages[i]['name'] + " :<br>" + messages[i]['message'] + '</p>' + '</div>';
								}
								
								
						}
						// console.log(html_string);
				});

				res.send(html_string);
		});
};



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

		// if user is authenticated in the session, carry on
		if (req.isAuthenticated())
				return next();

		// if they aren't redirect them to the home page
		res.redirect('/');
}
