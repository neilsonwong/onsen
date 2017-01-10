var alias = require("./alias");

function LastFmDataFixer(){

}

LastFmDataFixer.aggregateWeeklyTracks = function aggregateWeeklyTracks (db, callback){
    let week = {
        from: db["@attr"].from,
        to: db["@attr"].to,
        tracks: []
    }

    let trackHashMap = {};
    let i, song, artist, title, playCount;

    for (i = 0; i < db.track.length; ++i){
        song = db.track[i];
        title = alias.title(song.name);
        artist = alias.artist(song.artist["#text"]);
        tempKey = artist + "-" + title;
        playCount = parseInt(song.playcount);

        //add to hashmap
        //if exists sum total playcount
        if (trackHashMap[tempKey] !== undefined){
            trackHashMap[tempKey].playCount += playCount;
        }
        else {
            trackHashMap[tempKey] = {
                title: title,
                artist: artist,
                playCount: playCount
            }
        }
    }

    //aggregated the tracks
    for (var track in trackHashMap) {
        // check also if property is not inherited from prototype
        if (trackHashMap.hasOwnProperty(track)) { 
            week.tracks.push(trackHashMap[track]);
        }
    }

    week.tracks.sort(function sortDescending(a, b) {
        return b.playCount - a.playCount;
    });

    if (callback) {
        callback(week);
    }
}

LastFmDataFixer.buildSongBook = function buildSongBook(db3){
    let songs = {};
    let playable = {};
    let topsong = {};

    //build song archive
    for (var week in db3) {
        if (db3.hasOwnProperty(week)) { 
            let len = db3[week].tracks.length;
            for (i = 0; i < len; ++i){
                song = db3[week].tracks[i];
                if (songs[song.artist] === undefined){
                    songs[song.artist] = {};
                }

                if (songs[song.artist][song.title] === undefined){
                    songs[song.artist][song.title] = song;
                }
                else {
                    songs[song.artist][song.title].playCount += song.playCount;
                }
                
                if (i === 0){
                    if (topsong[song.artist] === undefined){
                        topsong[song.artist] = {};
                    }
                    topsong[song.artist][song.title] = new Date(1000* db3[week].from);

                    if (playable[song.artist] === undefined){
                        playable[song.artist] = {};
                    }
                }

                //top song
                if (topsong[song.artist] && topsong[song.artist][song.title] !== undefined){
                    playable[song.artist][song.title] = songs[song.artist][song.title];
                    playable[song.artist][song.title].topWeek = topsong[song.artist][song.title];
                }
            }
        }
    }

    function totalPlays(artistObj){
        var totalPlays = 0;
        for (var title in artistObj){
            if (artistObj.hasOwnProperty(title) && title !== "artist"){
                totalPlays += artistObj[title].playCount;
            }
        }
        return totalPlays;
    }

    //filter out small artists
    for (var artist in songs){
        if (totalPlays(songs[artist]) < 50){
            delete songs[artist];
        }
    }

    return {all: songs, playable: playable};
}

module.exports = LastFmDataFixer;