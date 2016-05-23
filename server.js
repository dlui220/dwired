var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

//Lets define a port we want to listen to
const PORT=8080; 

app.listen(process.env.PORT || 8000);
