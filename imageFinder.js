"use strict";

const got = require("got");
const qs = require("querystring");
const fs = require("fs");
const path = require("path");

function ImageFinder(gApiKey, gCX, imageDir){
	this.apiKey = gApiKey;
	this.cx = gCX;
	this.imageDir = imageDir;
}

ImageFinder.prototype.findImageUrl = function(query){
	return new Promise((resolve, reject) => {
		got("https://www.googleapis.com/customsearch/v1?" +
			this.buildQuery(query), {json: true})
		.then(res => {
			if (res && res.body && res.body.items && res.body.items.length > 0){
				//we got a result
				let result = {query: query, url: res.body.items[0].link};
				console.log(result);
				return resolve(result);
			}
			else {
				return reject("no results found");
			}
		});
	});
}

ImageFinder.prototype.buildQuery = function buildQuery(query){
	return qs.stringify({
		q: query.replace(/\s/g, '+'),
		searchType: 'image',
		cx: this.cx,
		key: this.apiKey,
		num: 1
	});
}

ImageFinder.prototype.downloadImage = function(queryRes){
	let query = queryRes.query;
	let url = queryRes.url;
	let filename = query + url.substring(url.lastIndexOf("."), url.lastIndexOf(".") + 3);
	got.stream(url).pipe(fs.createWriteStream(path.join(this.imageDir, filename)));
};

ImageFinder.prototype.genImg = function(artist, title){
	return this.findImageUrl(artist + " " + title)
	.then(this.downloadImage.bind(this))
	.catch((e) => {
		console.log("something went wrong!");
		console.log(e);
	});
};

ImageFinder.prototype.getAllImgs = function(dataRoot){
	let weekly;
	try {
	    weekly = require(path.join(dataRoot, "weekly"));
	}
	catch(e){
		console.log("could not find weekly");
	}

	weekly.map(val => {
		return this.genImg.bind(this, val.artist, val.title);
	})
	.reduce((p, fn) => {
		console.log(p);
		return p.then(fn);
	}, Promise.resolve);
};

let imgf = new ImageFinder("AIzaSyDFKQ5C0CXgAD1TjxGVqmfA25Mp8QCXlME",
	"007452572455457586091:ujqb96chqqm", "/home/neilson/Pictures/test");

imgf.genImg("ayaka", "why");

// imgf.getAllImgs("/home/neilson/onsendb");
