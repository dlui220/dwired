var express = require('express');
var app = express();

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectId;
var url = 'mongodb://localhost:8000/test';

app.use(express.static(__dirname + '/public'));

const PORT=8080;

app.listen(process.env.PORT || 8000);
