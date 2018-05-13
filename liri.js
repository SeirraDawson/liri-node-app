import { runInContext } from 'vm';

// require("dotenv").config();

// Add the code required to import the `keys.js` file and store it in a variable.

var Twitter = require('twitter');
var spotify = require('spotify');
var omdb = require('omdb');
var fs = require('fs');
var request = require('request');
var input1 = process.argv[2];
var input2 = process.argv.splice(3).join(" ");

function log() {
    fs.appendFile('./log.txt', input1 + " " + input2 + ", ", function(err) {
        // If an error was experienced we say it.
        if (err) {
            console.log(err);
        }
        // If no error is experienced, we'll log the phrase "Content Added" to our node console.
        else {
            // console.log("Content Added!");
        }
    });
};

var keys = require('./keys.js');
//console.log (keys.twitterKeys);
var client = new Twitter(keys.twitterKeys);
var login = {
    screen_name: 'TheLyteBulb',
    count: 20
};

run();

var spotify = new Spotify(keys.spotify);

