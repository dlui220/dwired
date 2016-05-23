var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
var path = require('path');

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/home.html'));
});

app.listen(8080);
