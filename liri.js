// code required to import the `keys.js` file and stored in a variable.
var keys = require("./keys.js");
//npm package
var fs = require("fs");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
// command variables
var action = process.argv[2];
// name of song or movie
var value = process.argv[3];

// The switch-case will direct which function gets run.
// switch case for whatever command the user enters
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
    console.log("\nHouston we have a problem!" + "\n"+
                "\nPlease enter a command after <node liri.js>: " + "\n" +
                "my-tweets " + "\n" +
                "spotify-this-song 'music info' " + "\n" + 
                "movie-this" + "\n" +
                "do-what-it-says\n");
    break;
}

// Twitter function
function getTweets(){
    // twitter keys variable, referencing the keys file and export line
    var twitterKeys = require("./keys.js").twitterKeys;
    // the keys
    var client = new Twitter ({
            consumer_key: twitterKeys.consumer_key,
            consumer_secret: twitterKeys.consumer_secret,
            access_token_key: twitterKeys.access_token_key,
            access_token_secret: twitterKeys.access_token_secret
    });// end of client obj.

    // what to search for
    var params = {
        screen_name: "TheLyteBulb",
        count: 20,
    };// end of parameters
        // console.log("This is params " + params);

    // params show the last 20 tweets and when they were created them in bash.
    client.get("statuses/user_timeline", params, function(err, tweets, response) {
        //if error, log it, else return the tweets
        if (err) {
            console.log(err);
        }
        else {
            // for loop to run through the length of my account's tweets
            console.log("\n____________20 Tweet Newfeed____________\n");
            for(var i = 0; i< tweets.length; i++){
                console.log("________________________________________________\n");
                // adds a number and dot before to show order
                var twitterLog = ((i + 1) + ". " + "Tweet: " + tweets[i].text + "\n" + "\nCreated At: " + tweets[i].created_at + "\n");
                console.log (twitterLog);
            } // end of for loop
        } // end of else
    }); // end of client.get
} // end of getTweets()

//Spotify functions
function getSong() {
    console.log("\nLoading....Music\n")
    // spotify keys variable, referencing the keys file and export line
    var spotifyKey = require("./keys.js").spotify;
    // the keys
    var spotify = new Spotify({
        id: spotifyKey.id,
        secret: spotifyKey.secret
    });

    spotify.search({type: "track", query: value || "The Sign Ace of Base", limit: 3}, function(err, data) {
        if (!err) {
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
    // set movie name equal to user input
    var movieName = value;
    var movieDefault = "Mr.Nobody";
    // search url variable
    var url = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";
    var urlDefault = "http://www.omdbapi.com/?t=" + movieDefault + "&plot=short&tomatoes=true&apikey=trilogy";

    // if the user entered a title, search that
    if (movieName != null) {
        request(url, function (error, response, body) {
            // If the request is successful
            if (!error && response.statusCode == 200) {
                var body = JSON.parse(body);
                // Parse the body and pull for each attribute
                console.log("\n__________Movie Info__________\n")
                console.log("Title: " + movieName);
                console.log("Release Year: " + body.Year);
                console.log("IMdB Rating: " + body.imdbRating);
                console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
                console.log("Country of Production: " + body.Country);
                console.log("Language: " + body.Language);
                console.log("Plot: " + body.Plot);
                console.log("Actors: " + body.Actors);
            };//end of if
        });//end of request

        // if user doesn't enter a value, value will be set to Mr.Nobody
        } else {
            request(urlDefault, function (error, response, body) {
            // If the request is successful (i.e. if the response status code is 200)
            if (!error && response.statusCode == 200) {
                var body = JSON.parse(body);
                // Parse the body and pull for each attribute
                console.log("\n__________Default Movie Info__________\n")
                console.log("Title: " + movieDefault);
                console.log("Release Year: " + body.Year);
                console.log("IMdB Rating: " + body.imdbRating);
                console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
                console.log("Country of Production: " + body.Country);
                console.log("Language: " + body.Language);
                console.log("Plot: " + body.Plot);
                console.log("Actors: " + body.Actors + "\n");
            };//end of if
        });//end of request
    } // end of else
} // end of getSong()

//doit Function
function doit() {
    fs.readFile("random.txt", "utf8", function(error, data){

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
