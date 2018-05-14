var keys = require("./keys.js");

// Add the code required to import the `keys.js` file and store it in a variable.

var omdb = require('omdb');
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

// TWITTER FUNCTIONnode liri.
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
  });
  // what to search for
  var params = {screen_name: 'TheLyteBulb'};
  console.log('This is params ' + params);

  // using the npm
  client.get('statuses/user_timeline', params, function(error, tweets) {
    //if error, log it, else log the tweets
    if (error) {
      console.log(error);
    }
    else {
      // for loop to run through the length of my account's tweets
      console.log("\n////////TWEET ME//////////\n");
      for(i=0; i< tweets.length; i++){
        // adds a number and dot before to show order
        console.log((i+1) + ". " + tweets[i].text);
      }
    }
  });
}

// var spotify = new Spotify(keys.spotify);

//SPOTIFY FUNCTION
function spotify() {
    //npm package
    var spotify = require('spotify');
  
    spotify.search({type: 'track', query: value || 'ace of base the sign'}, function(err, data) {
      if (err) {
          console.log('Error occurred: ' + err);
          return;
      }
      else {
      //console.log("______Data______")
      //console.log(data);
      //console.log("______Data.tracks.items______")
      var spotifyCall = data.tracks.items[0];
      //console.log(spotifyCall);
      //console.log("________spotifyCall.artists[0].name_______");
  
  // if no error, show me the information from the API
      console.log("\n__________SPOTIFY THIS__________\n");
      var artist = spotifyCall.artists[0].name;
      console.log("Artist: " + artist);
      var song = spotifyCall.name;
      console.log("Song name: " + song);
      var preview = spotifyCall.preview_url;
      console.log("Preview Link: " + preview);
      var album = spotifyCall.album.name;
      console.log("Album: " + album);
      }
    });
  }