"use strict";

let fs = require("fs");

let lastfm;
let audioHelper = require("./audioHelper");
let songManager = require("./songManager");

    // Lastfm.apiKey = "200ef837557217e186dd2eed9a6075b8";
    // Lastfm.user = "mahourin";
    // Lastfm.beginningOfTime = 1318052895;
    // "/home/neilson/Music"

function Onsen(apiKey, lastFmUser, startTimeStamp, musicLib){
	lastfm = require("./lastfm")(apiKey, lastFmUser, startTimeStamp);
	Onsen.musicLib = musicLib;
	return Onsen;
}

Onsen.update = function updateData(callback){
	lastfm.updateData(function(success){
	    console.log(success ? "yay" : "nay");
	    audioHelper.generateCatalogue(Onsen.musicLib, function(){
	        audioHelper.mergeMetadata(function(error){
	            // if there is an error, it means files are missing
	            // let sm = new songManager();
	            fs.writeFile("lastUpdated.txt", Date.now(), () => {
		            if (callback){
		            	return callback()
		            }
	            });
	        });
	    });
	});
}

Onsen.getWeekly = function getWeekly(callback){
	fs.readFile("lastUpdated.txt", (err, data) => {
		function update(){
			Onsen.update(() => {
				if (callback){
					return callback();
				}
			});
		}
		if (err){
			console.log(err);
			update();
		}
		else {
			let lastUpdated = parseInt(data);
			if (lastUpdated < Date.now - 604800000){
				update();
			}
			else {
				console.log("db already up to date");
				if (callback){
					return callback();
				}
			}
		}
	});
}

module.exports = Onsen;