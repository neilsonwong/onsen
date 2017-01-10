var async = require("async");
var fs = require("fs");
var lastfm = require("./lastfm");
var fixLastFmData = require("./fixLastFmData");

function getDownloadedDatabases(callback){
    let testFolder = "database";
    fs.readdir(testFolder, (err, files) => {
        if (callback){
            callback(files);
        }
    });
}

function parseDownloadedDatabase(file, callback){
    fs.readFile(file, function(err, data){
        let db = JSON.parse(data).weeklytrackchart;
        fixLastFmData.aggregateWeeklyTracks(db, callback);
    });
}

function generateFixedLastfmDb() {
    let db3 = {};

    getDownloadedDatabases(function(files){
        let i, song;
        let topsong = {};
        async.each(files, function(file, done){
            parseDownloadedDatabase("database/"+file, function(week){
                if (week !== null){
                    db3[week.from] = week;
                }
                done();
            });
        },
        function done(err){
            var songs = fixLastFmData.buildSongBook(db3);

            console.log("writing song files");
            fs.writeFileSync("songs.json", JSON.stringify(songs.all, null, 2));
            fs.writeFileSync("playable.json", JSON.stringify(songs.playable, null, 2));
        });
    });
}
generateFixedLastfmDb();