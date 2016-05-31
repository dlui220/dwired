var comments = $(".dwired-comment");
var commentButton = $(".like");

commentButton.click(function(){
    comments.transition('slide down');
});
