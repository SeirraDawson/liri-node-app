// per homework instructions
// require("dotenv").config();


// code required to import the `keys.js` file and stored in a variable.
var keys = require("./keys.js");
var fs = require('fs');
var request = require('request');
// command variables
var action = process.argv[2];
// name of song or movie
var value = process.argv[3];

// The switch-case will direct which function gets run.
// switch case for whatever command the user enters
switch(action){
    case 'my-tweets':
        twitter();
    break;

    case 'spotify-this-song':
        spotify();
    break;

    case 'movie-this':
        movie();
    break;

    case 'do-what-it-says':
        doit();
    break;

    default:
    break;
}

// Twitter function
// show the last 20 tweets and when they were created at in your terminal/bash window.
function twitter(){
    // twitter keys variable, referencing the keys file and export line
    var twitterKeys = require('./keys.js').twitterKeys;
    // npm package
    var Twitter = require('twitter');
    // the keys
    var client = new Twitter ({
            consumer_key: twitterKeys.consumer_key,
            consumer_secret: twitterKeys.consumer_secret,
            access_token_key: twitterKeys.access_token_key,
            access_token_secret: twitterKeys.access_token_secret
    });// end of client obj.

    // what to search for
    var params = {screen_name: 'TheLyteBulb', count: 20};
        console.log('This is params ' + params);

    // using the npm
    client.get('statuses/user_timeline', params, function(err, tweets, response) {
        //if error, log it, else log the tweets
        if (err) {
            console.log(err);
        }
        else {
            // for loop to run through the length of my account's tweets
            console.log("\n__________Tweet__________\n");
            for(i=0; i< tweets.length; i++){
                // adds a number and dot before to show order
                console.log((i+1) + ". " + "Tweet: " + "'" + tweets[i].text + "'" + "\n Created At: " + tweets[i].created_at);
            } // end of for loop
        } // end of else
    }); // end of client.get
} // end of twitter()

//Spotify functions
function spotify() {
    //npm package
    var Spotify = require('node-spotify-api');
    // the keys
    var spotify = new Spotify(keys.spotify);

    spotify.search({type: 'track', query: value || 'The Sign Ace of Base'}, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        else {
            var spotifyInfo = data.tracks.items[0];
            //console.log(spotifyInfo);
            //console.log("________spotifyInfo.artists[0].name_______");

            // if no error, show me the information from the API
            console.log("\n__________SPOTIFY THIS__________\n");
            var artist = spotifyInfo.artists[0].name;
            console.log("Artist(s): " + artist);
            var song = spotifyInfo.name;
            console.log("Song name: " + song);
            var preview = spotifyInfo.preview_url;
            console.log("Preview Link: " + preview);
            var album = spotifyInfo.album.name;
            console.log("Album: " + album);
        }// end of else
    });// end of spotify.search
}// end of spotify()

//omdb function
function movie() {
    //npm package
    var request = require('request');
    // set movie name equal to user input
    var movieName = value;
    var movieDefault = "Mr.Nobody";
    // search url variable
    var url = 'http://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&apikey=trilogy';
    var urlDefault = 'http://www.omdbapi.com/?t=' + movieDefault + '&plot=short&apikey=trilogy';

    // if the user entered a title, search that
    if (movieName != null) {
        request(url, function (error, response, body) {
            // If the request is successful
            if (!error && response.statusCode == 200) {
                // Parse the body and pull for each attribute
                console.log("\n__________Movie Info__________\n")
                console.log("Title: " + value);
                console.log("Year: " + JSON.parse(body)["Year"]);
                console.log("Rating: " + JSON.parse(body)["imdbRating"]);
                console.log("Country of Production: " + JSON.parse(body)["Country"]);
                console.log("Language: " + JSON.parse(body)["Language"]);
                console.log("Plot: " + JSON.parse(body)["Plot"]);
                console.log("Actors: " + JSON.parse(body)["Actors"]);
            };//end of if
        });//end of request

        // if user doesn't enter a value, value will be set to Mr.Nobody
        } else {
            request(urlDefault, function (error, response, body) {
            // If the request is successful (i.e. if the response status code is 200)
            if (!error && response.statusCode == 200) {
                console.log("Title: " + movieDefault);
                console.log("Year: " + JSON.parse(body)["Year"]);
                console.log("Rating: " + JSON.parse(body)["imdbRating"]);
                console.log("Country of Production: " + JSON.parse(body)["Country"]);
                console.log("Language: " + JSON.parse(body)["Language"]);
                console.log("Plot: " + JSON.parse(body)["Plot"]);
                console.log("Actors: " + JSON.parse(body)["Actors"]);
            };//end of if
        });//end of request
    } // end of else
} // end of movie()

//doit Function
function doit() {
    fs.readFile('random.txt', "utf8", function(error, data){

        if (error) {
            return console.log(error);
            }

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        // Each command is represented. Because of the format in the txt file, remove the quotes to run these commands. 
        if (dataArr[0] === "spotify-this-song") {
            var songcheck = dataArr[1].slice(1, -1);
            spotify(songcheck);
        } else if (dataArr[0] === "my-tweets") {
            var tweetname = dataArr[1].slice(1, -1);
            twitter(tweetname);
        } else if(dataArr[0] === "movie-this") {
            var movie_name = dataArr[1].slice(1, -1);
            movie(movie_name);
        }//end of else if
    });//end of fs.readFile
};//end of doit()
