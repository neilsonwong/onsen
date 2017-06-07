"use strict";

let Onsen = require("./index")("200ef837557217e186dd2eed9a6075b8", 
	"mahourin",
    1318052895,
    "/home/neilson/Music",
    "/home/neilson/onsendb");

// Onsen.getWeekly(() => {
// 	console.log("got weekly");
// });

Onsen.cutSongs(() => {
	console.log("songs have been cut");
});