// Dependencies

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");


//Scraping tools
const request = require("request");
const cheerio = require("cheerio");

// Require modules
var Comment = require("./models/Comment.js");
var Article = require("./models/Article.js");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Use body parser with our app
app.use(bodyParser.urlencoded({
  extended: false
}));



// Make public a static dir
app.use(express.static("public"));


mongoose.connect("mongodb://localhost/mongoosescraper");

var db = mongoose.connection;

// catch errors
db.on("error", function(error) {
    console.log("Database Error:", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

//============================================================
//                  Routes
//============================================================


// Scrape data from NewYorkTimes and place it into mongo db
app.get("/scrape", function(req, res) {

    request("https://www.wsj.com/", function(error, response, html) {

        var $ = cheerio.load(html);
        
        $("h3.wsj-headline").each(function(i, element) {
            
            var result = {}

            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");


            if (result.title === undefined || result.link === undefined) {
                console.log("invalid article for scrape")
            }
            else {
                // log the Scrape
                console.log("Scraping item number " + i);
                console.log(result.title);
                console.log(result.link);
                
                // Create a new entry with Article Schema
                var entry = new Article(result)
                // Save the Scrape into database
                entry.save(function(err, doc) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(doc);
                    }
                });
            }
        });
    });

    // Send a scrape complete message to the browser
    res.send("Scrape Complete. Go to '/' landing page to see your Articles");
});

// Route to see articles that were added
app.get("/articles", function(req, res) {
    Article.find({}, function(error, doc) {
        if (error) {
            res.send(error);
        }
        else {
            res.json(doc);
        }
    });
});

// Route to grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {
    Article.findOne({ "_id": req.params.id })
    .populate("comment")
    .exec(function(error, doc) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(doc);
        }
    });
});


//Create new comment to a specific article
app.post("/articles/:id", function(req, res) {

    var newComment = new Comment(req.body);

    newComment.save(function(error, doc) {
        if (error) {
            console.log(error);
        }
        else {
            Article.findOneAndUpdate({ "_id": req.params.id }, { "comment": doc._id })
            .exec(function(err, doc) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send(doc);
                }
            });
        };
    });
});




app.listen(3000, function() {
    console.log("App running on port 3000!");
});
