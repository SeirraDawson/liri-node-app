// Read and set environment variables with the dotenv package
require("dotenv").config();

// key codes stored in a variable.
var keys = require("./keys.js");
// Import the FS package for read/write.
var fs = require("fs");
// Import the Twitter NPM package.
var Twitter = require("twitter");
// Import the node-spotify-api NPM package.
var Spotify = require("node-spotify-api");
// Import the request npm package.
var request = require("request");

// Initialize the API client using the client's id and secret
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// command variables
var action = process.argv[2];
// search parameter for spotify and omdb
var userInput = process.argv[3];

// The switch-case will direct which function gets run.
//action statement, switch statement to declare what action to execute.
switch(action){

    case "my-tweets":
        getTweets();
    break;

    case "spotify-this-song":
        getSong();
    break;

    case "movie-this":
        getMovie();
    break;

    case "do-what-it-says":
        doit();
    break;

    default:
    console.log("\n_______Houston we have a problem!_______" + "\n"+
                "\nPlease enter a command after <node liri.js>: " + "\n" +
                "my-tweets " + "\n" +
                "spotify-this-song '<song name here>'" + "\n" +
                "movie-this '<movie name here>'" + "\n" +
                "do-what-it-says\n");
    break;
};

// Twitter function
function getTweets(){
    // what to search for
    var params = {
        screen_name: "TheLyteBulb",
        count: 20
    };// end of parameters
        // console.log("This is params " + params);

    // get method
    client.get("statuses/user_timeline", params, function(err, tweets, response) {
        //if error, log it, else return the tweets
        if (!err) {
            // for loop to run through the length of my account's tweets
            console.log("\n____________20 Tweet Newsfeed____________\n");
            for(var i = 0; i< tweets.length; i++){
                console.log("________________________________________________\n");
                // adds a number and dot before to show order
                var twitterLog = ((i + 1) + ". " + "Tweet: " + tweets[i].text + "\n" + 
                                "\nCreated At: " + tweets[i].created_at + "\n");
                console.log (twitterLog);
            } // end of for loop
        } // end of else
    }); // end of client.get
} // end of getTweets()

//Spotify functions
function getSong() {
    console.log("\nLoading....Music\n")
    var songSearch;
    // when not text after spotify-this-song
    if(userInput === undefined){
        songSearch = "The Sign Ace of Base";
    }// end of if
    else {
        songSearch = userInput;
    }// end of else
    // spotify search method
    spotify.search({type: "track", query: songSearch || "The Sign Ace of Base", limit: 3}, function(err, data) {
        if (!err) {
            // loop through tracks with 3 limits
            for(var i = 0; i< data.tracks.items.length; i++){
                var spotifyInfo = data.tracks.items[i];
                //console.log(spotifyInfo);
                // if no error, show this information from the API
                console.log("\n_______________" + [i+1] + "." + "Spotify Search_______________\n");
                var artist = spotifyInfo.artists[0].name;
                console.log("Artist(s): " + artist);
                var song = spotifyInfo.name;
                console.log("Song name: " + song);
                var preview = spotifyInfo.preview_url;
                console.log("Preview Link: " + preview);
                var album = spotifyInfo.album.name;
                console.log("Album: " + album + "\n");
            }// end of for loop
        }// end of if
        else {
            console.log("Spotify error!");
            return;
        }// end of else
    });// end of spotify.search
}// end of getSong()

//omdb function
function getMovie() {

    var movieSearch;
    if(userInput === undefined){
        movieSearch = "Mr. Nobody";
    }// end of if
    else {
        movieSearch = userInput;
    }// end of else

    // search url variable
    var url = "http://www.omdbapi.com/?t=" + movieSearch + "&y=&plot=long&tomatoes=true&r=json&apikey=trilogy";

        request(url, function (error, response, body) {
            // If the request is successful
            if (!error && response.statusCode == 200) {
                var body = JSON.parse(body);
                // Parse the body and pull for each attribute
                console.log("\n__________Movie Info__________\n")
                console.log("Title: " + movieSearch);
                console.log("Release Year: " + body.Year);
                console.log("IMdB Rating: " + body.imdbRating);
                console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
                console.log("Country of Production: " + body.Country);
                console.log("Language: " + body.Language);
                console.log("Plot: " + body.Plot);
                console.log("Actors: " + body.Actors + "\n");
            };//end of if
        });//end of request
} // end of getSong()

//doit Function
function doit() {
    console.log("\nPeek into random.txt\n");
    fs.readFile("random.txt", "utf8", function(error, data){
        console.log("Data: " + data);
        if (error) {
            return console.log(error);
        }//end of if
        else{
            // Then split it by commas (to make it more readable)
            dataArr = data.split(",");
            getSong(dataArr[0],dataArr[1]);
        }//end of else
    });//end of fs.readFile
};//end of doit()
