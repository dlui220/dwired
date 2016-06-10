var mongoose = require('mongoose');
var postSchema = mongoose.Schema({
		post: String,
});
module.exports = mongoose.model('posts', postSchema); 
