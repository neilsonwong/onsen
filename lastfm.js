var request = require("request");

function Lastfm(){}
Lastfm.apiKey = "200ef837557217e186dd2eed9a6075b8";
Lastfm.user = "mahourin";

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
            callback(body);
        }
        catch (e) {
            console.log(e);
        }
    });
};


Lastfm.updateDbFiles = function updateDbFiles(callback){
    //don't need to update things from more than a month ago
    let cutoff = new Date().getTime() - 2629743000;
    Lastfm.grabWeeks(function(weeks){
        async.eachSeries(weeks, function Iter(item, next){
            var fromdate =  new Date(1000 * item.from);
            var todate =  new Date(1000 * item.to);
            
            if (1000*item.from > cutoff){
                setTimeout(function(){
                    console.log("getting week " + fromdate  + " ... " + todate);
                    Lastfm.getTracks(item.to, item.from, function(topTracks){
                        fs.writeFile("database/"+from+".json", topTracks, next);
                    });
                },
                1500);
            }
            else {
                console.log("skipping " + fromdate);
                next();
            }
        }, function done(){
            //all done
            //fs.writeFileSync("database2.json", JSON.stringify(db2));
            console.log("up to date");
            if (callback){
                callback();
            }
        });    
    });
}

module.exports = Lastfm;