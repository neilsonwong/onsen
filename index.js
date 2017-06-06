"use strict";

let fs = require("fs");
let path = require("path");

let lastfm;
let audioHelper = require("./audioHelper");
let songManager = require("./songManager");

    // Lastfm.apiKey = "200ef837557217e186dd2eed9a6075b8";
    // Lastfm.user = "mahourin";
    // Lastfm.beginningOfTime = 1318052895;
    // "/home/neilson/Music"

function Onsen(apiKey, lastFmUser, startTimeStamp, musicLib, dataRoot){
	lastfm = require("./lastfm")(apiKey, lastFmUser, startTimeStamp, dataRoot);
	Onsen.musicLib = musicLib;
	Onsen.dataRoot = dataRoot;
	return Onsen;
}

Onsen.update = function updateData(callback){
	lastfm.updateData(function(success){
	    console.log(success ? "yay" : "nay");
	    audioHelper.generateCatalogue(Onsen.musicLib, Onsen.dataRoot, function(){
	        audioHelper.mergeMetadata(Onsen.dataRoot, function(error){
	            // if there is an error, it means files are missing
	            // let sm = new songManager();
	            fs.writeFile(path.join(Onsen.dataRoot, "lastUpdated.txt"), Date.now(), () => {
		            if (callback){
		            	return callback()
		            }
	            });
	        });
	    });
	});
}

Onsen.getWeekly = function getWeekly(callback){
	fs.readFile(path.join(Onsen.dataRoot, "lastUpdated.txt"), (err, data) => {
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