var mongoose = require('mongoose');
var msgSchema = mongoose.Schema({
		name: String,
		message: String,
		time: Number
});
module.exports = mongoose.model('messages', msgSchema); 
