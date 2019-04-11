require("dotenv").config();
var keys = require("./keys");
// Calls OMDB
var request = require('request');
var moment = require('moment');
// Spotify
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var fs = require('fs');

let command = process.argv[2];
let media_array = process.argv.slice(3);
let media = media_array.join(" ");

function doThings(command, media) {
    switch (command) {

        case 'spotify-this-song':
            spotifyThis(media); break;
        case 'movie-this':
            movieThis(media); break;
        case 'concert-this':
            concertThis(media); break;
        case 'do-what-it-says':
            doWhatItSays(); break;
        default:
            console.log("Invalid command. Please type any of the following commands:");
            console.log("concert-this, spotify-this-song, movie-this, do-what-it-says");
    }
}


function concertThis(media) {
    // Default value
    if (media == "") {
        media = "Drake"
    }
    request("https://rest.bandsintown.com/artists/" + media + "/events?app_id=codingbootcamp", function ( response, data) {
        try {
            var response = JSON.parse(data)
            if (response.length != 0) {
                console.log(`Upcoming concerts for ${media} include: `)
                response.forEach(function (element) {
                    console.log("Venue name: " + element.venue.name);
                    if (element.venue.country == "United States") {
                        console.log("City: " + element.venue.city + ", " + element.venue.region);
                    } else {
                        console.log("City: " + element.venue.city + ", " + element.venue.country);
                    }
                    console.log("Date: " + moment(element.datetime).format('MM/DD/YYYY'));
                    console.log();
                })
            } else {
                console.log("No concerts found.");
            }
        }
        catch (error) {
            console.log("No concerts found.");
        }
    });
}
function spotifyThis(media) {
    // Default value
    if (media == "") {
        media = "Ace of Base"
    }

    // Search spotify API
    spotify
        .search({ type: 'track', query: media, limit: 1 })
        .then(function (response) {
            var song = response.tracks.items[0];
            if (song != undefined) {
                console.log();
                console.log("Song Name");
                console.log(song.name);

                console.log("Artist or Artists:");
                for (i = 0; i < song.artists.length; i++) {
                    console.log(song.artists[i].name);
                }

                console.log("Preview Link");
                console.log(song.preview_url);

                console.log("Album");
                console.log(song.album.name);
                console.log();
            } else {
                console.log("Can't find this song!")
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}
function movieThis(movieName) {
    //use Mr.Nobody as default
        if (!movieName) {
            movieName = "mr nobody";
        }
            
    // Runs a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    console.log(queryUrl);

    //Callback to OMDB API
    request(queryUrl, function(error, response, body) {

        if (!error && response.statusCode === 200) {
            var movieObject = JSON.parse(body);

            var movieResults = 
            "------------------------------ begin ------------------------------" + "\r\n" +
            "Title: " + movieObject.Title+"\r\n"+
            "Year: " + movieObject.Year+"\r\n"+
            "Imdb Rating: " + movieObject.imdbRating+"\r\n"+
            "Rotten Tomatoes Rating: " + movieObject.tomatoRating+"\r\n"+
            "Country: " + movieObject.Country+"\r\n"+
            "Language: " + movieObject.Language+"\r\n"+
            "Plot: " + movieObject.Plot+"\r\n"+
            "Actors: " + movieObject.Actors+"\r\n"+
            "------------------------------ end ------------------------------" + "\r\n";
            console.log(movieResults);

            
        } 
        else {
			console.log("Error :"+ error);
			return;
		}
    });
};
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, response) {
        if (err) {
            console.log(err);
        }
        let params = (response.split(','));
        doThings(params[0], params[1]);
    })
}

doThings(command, media);