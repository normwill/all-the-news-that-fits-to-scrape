$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});



// ===================================
// when clicking an article on the page
// ===================================

$(document).on("click", "p", function() {
    // Empty the note section
    $("#comments").empty();

    var thisId = $(this).attr("data-id");

    // grab the article information from our API
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    .done(function(data) {

        console.log(data);

        // append title of article to comment section
        $("#comments").append("<h2>" + data.title + "</h2>");

        // append input element to the comment section
        $("#comments").append("<input id='titleinput' name='title'>");

        // append textbox to comment section
        $("#comments").append("<textarea id='bodyinput' name='body'>");

        // append submit button to comment section
        $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");

        // If a comment already exists in the article
        if (data.comment) {
            $("#titleinput").val(data.comment.title);
            $("#bodyinput").val(data.comment.body);
        }

    });
});


// ==================================== \\
// When clicking the save comment button \\
// =======================================\\

$(document).on("click", "#savecomment", function() {

    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
    .done(function(data) {
        console.log(data);
        $("#comments").empty(); // empty the comments section
    });

    $("#titleinput").val(""); // empty the title field
    $("#bodyinput").val(""); // empty the textbox field

});


console.log(windows.location.href);