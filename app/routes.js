// app/routes.js
module.exports = function(app, passport) {
    
    app.get('/', function(req, res) {
        res.render('index.ejs'); //load index.ejs files
    });
    
    app.get('/login', function(req, res) {
        res.render('login.ejs'); //load index.ejs files
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
