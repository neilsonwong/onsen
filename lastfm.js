"use strict";

let request = require("request");
let async = require("async");
let fs = require("fs");

let fixLastFmData = require("./fixLastFmData");

function Lastfm(){}

Lastfm.apiKey = "200ef837557217e186dd2eed9a6075b8";
Lastfm.user = "mahourin";
Lastfm.beginningOfTime = 1318052895;

Lastfm.grabWeeks = function (callback) {
    request.post("http://ws.audioscrobbler.com/2.0/", {
        form: {
            method: 'user.getweeklychartlist',
            user: Lastfm.user,
            api_key: Lastfm.apiKey,
            format: "json"
        }
    }, function (err, res, body) {
        if (err) {
            console.log(err);
        }
        try {
            var data = JSON.parse(body);
            var weeks = data.weeklychartlist.chart.filter(function (obj) {
                return (obj.to > Lastfm.beginningOfTime);
            }).map(function (obj) {
                return { to: obj.to, from: obj.from };
            });
            callback(weeks);
        }
        catch (e) {
            console.log("grab weeks error");
            console.log(e);
            //console.log("JSON parse failed");
        }
    });
};

Lastfm.getTracks = function (to, from, callback) {
    request.post("http://ws.audioscrobbler.com/2.0/", {
        form: {
            method: 'user.getweeklytrackchart',
            user: Lastfm.user,
            to: to,
            from: from,
            api_key: Lastfm.apiKey,
            format: "json"
        }
    }, function (err, res, body) {
        if (err) {
            console.log(err);
        }
        try {
            return callback(body);
        }
        catch (e) {
            console.log("get tracks error");
            console.log(e);
        }
    });
};

Lastfm.generateDbFiles = function downloadDbFiles(callback){
    return genDb(Lastfm.beginningOfTime, callback);
};

Lastfm.updateDbFiles = function updateDbFiles(callback){
    //don't need to update things from more than a month ago
    //2629743000 is one month

    let cutoff = new Date().getTime() - 2629743000;
    return genDb(cutoff, callback);
}

let genDb = function genDb(cutoff, callback){
    Lastfm.grabWeeks(function(weeks){
        async.eachSeries(weeks, function Iter(item, next){
            var fromdate =  new Date(1000 * item.from);
            var todate =  new Date(1000 * item.to);
            
            if (1000*item.from > cutoff){
                setTimeout(function(){
                    console.log("getting week " + fromdate  + " ... " + todate);
                    Lastfm.getTracks(item.to, item.from, function(topTracks){
                        fs.writeFile("database/"+item.from+".json", topTracks, next);
                    });
                },
                1500);
            }
            else {
                console.log("skipping " + fromdate);
                return next();
            }
        }, function done(){
            //all done
            //fs.writeFileSync("database2.json", JSON.stringify(db2));
            console.log("up to date");
            if (callback){
                return callback();
            }
        });    
    });
};

Lastfm.generateFixedLastfmDb = function generateFixedLastfmDb(callback) {
    let getDownloadedDatabases = function(callback){
        let testFolder = "database";
        fs.readdir(testFolder, (err, files) => {
            if (callback){
                return callback(files);
            }
        });
    }

    let parseDownloadedDatabase = function(file, callback){
        fs.readFile(file, function(err, data){
            let db = JSON.parse(data).weeklytrackchart;
            return fixLastFmData.aggregateWeeklyTracks(db, callback);
        });
    }

    let db3 = {};

    getDownloadedDatabases(function(files){
        let i, song;
        let topsong = {};
        async.each(files, function(file, done){
            parseDownloadedDatabase("database/"+file, function(week){
                if (week !== null){
                    db3[week.from] = week;
                }
                return done();
            });
        },
        function done(err){
            var songs = fixLastFmData.buildSongBook(db3);

            console.log("writing song files");
            fs.writeFileSync("songs.json", JSON.stringify(songs.all, null, 2));
            fs.writeFileSync("playable.json", JSON.stringify(songs.playable, null, 2));

            return callback(true);
        });
    });
}

Lastfm.updateData = function updateData(callback) {
    let dbPath = "database";
    let fresh = false;

    async.series([
        function ensureDbFolderExists(next) {
            fs.access(dbPath, function(err) {
                if (err){
                    //cannot hit db path
                    //lets make it
                    fresh = true;
                    return fs.mkdir(dbPath, next);
                }
                else {
                    return next();
                }
            });
        },
        function getDataFromLastfm(next){
            return fresh ? Lastfm.generateDbFiles(next) : Lastfm.updateDbFiles(next);
        }
    ],
    function fixDownloadedData(next){
        //synchronous operation
        return Lastfm.generateFixedLastfmDb(callback);
    });
};

module.exports = Lastfm;
