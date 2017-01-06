var request = require("request");
var async = require("async");
var fs = require("fs");
var MongoClient = require('mongodb').MongoClient;

var apiKey = "200ef837557217e186dd2eed9a6075b8";
var user = "mahourin";

var db = [];
var db2 = {};

var grabWeeks = function (callback) {
    request.post("http://ws.audioscrobbler.com/2.0/", {
        form: {
            method: 'user.getweeklychartlist',
            user: user,
            api_key: apiKey,
            format: "json"
        }
    }, function (err, res, body) {
        if (err) {
            console.log(err);
        }
        try {
            var data = JSON.parse(body);
            var weeks = data.weeklychartlist.chart.filter(function (obj) {
                return (obj.to > 1318052895);
            }).map(function (obj) {
                return { to: obj.to, from: obj.from };
            });
            callback(weeks);
        }
        catch (e) {
            console.log("JSON parse failed");
        }
    });
}
var addTopTracks = function (to, from, callback) {
    request.post("http://ws.audioscrobbler.com/2.0/", {
        form: {
            method: 'user.getweeklytrackchart',
            user: user,
            to: to,
            from: from,
            api_key: apiKey,
            format: "json"
        }
    }, function (err, res, body) {
        if (err) {
            console.log(err);
        }
        try {
            //var data = JSON.parse(body);
            fs.writeFile("database/"+from+".json", body);
//            db2[from] = body;

            /*
            if (data.weeklytrackchart.track.length > 0) {
                var song = {
                    to: data.weeklytrackchart["@attr"].to,
                    from: data.weeklytrackchart["@attr"].from,
                    start: dateFromTimestamp(data.weeklytrackchart["@attr"].from),
                    end: dateFromTimestamp(data.weeklytrackchart["@attr"].to),
                    title: data.weeklytrackchart.track[0].name,
                    artist: data.weeklytrackchart.track[0].artist["#text"],
                    playcount: data.weeklytrackchart.track[0].playcount
                };
                db.push(song);
                console.log("this week is " + song.title);
            }
            */
            callback();
        }
        catch (e) {
            console.log(e);
            console.log("JSON parse failed");
        }
    });
};

var dateFromTimestamp = function(timestamp) {
    return new Date(1000 * timestamp)
};

function main(){
    grabWeeks(function(weeks){
        async.eachSeries(weeks, function Iter(item, next){
            setTimeout(function(){
                var fromdate =  new Date(1000 * item.from);
                var todate =  new Date(1000 * item.to);
                console.log("getting week " + fromdate  + " ... " + todate);
                addTopTracks(item.to, item.from, next);
            },
            1500);
        }, function done(){
            //all done
            fs.writeFileSync("database2.json", JSON.stringify(db2));
        });    
    });
}

function connectToMongo(callback){
    // Connection URL
    var url = 'mongodb://localhost:27017/myproject';

    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, db) {
        console.log("Connected successfully to server");
        if (callback){
            callback(db);
        }
    });
}

var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('test');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

connectToMongo();