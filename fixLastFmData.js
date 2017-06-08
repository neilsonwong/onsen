"use strict";

let alias = require("./alias");

function LastFmDataFixer(){}

LastFmDataFixer.aggregateWeeklyTracks = function aggregateWeeklyTracks (db, callback){
    let week = {
        from: db["@attr"].from,
        to: db["@attr"].to,
        tracks: []
    }

    let trackHashMap = {};
    let i, song, artist, title, playCount, tempKey, aliasTemp;

    for (i = 0; i < db.track.length; ++i){
        song = db.track[i];
        aliasTemp = alias.get(song.artist["#text"], song.name);
        artist = aliasTemp[0];
        title = aliasTemp[1];
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
        return callback(week);
    }
}

LastFmDataFixer.buildSongBook = function buildSongBook(db3){
    let songs = {};
    let playable = {};
    let topsong = {};
	let i, len, song;
    let weeklyChart = [];

    //build song archive
    for (var week in db3) {
        if (db3.hasOwnProperty(week)) { 
            //build array of top songs for each week
            len = db3[week].tracks.length;
            for (i = 0; i < len; ++i){
                song = db3[week].tracks[i];
                if (songs[song.artist] === undefined){
                    songs[song.artist] = {};
                }

                if (songs[song.artist][song.title] === undefined){
                    song.weeksAtTop = 0;
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
                    ++songs[song.artist][song.title].weeksAtTop;
                }

                //top song
                if (topsong[song.artist] && topsong[song.artist][song.title] !== undefined){
                    playable[song.artist][song.title] = songs[song.artist][song.title];
                    playable[song.artist][song.title].topWeek = topsong[song.artist][song.title];
                }
            }
        }
    }

    for (var week in db3) {
        if (db3.hasOwnProperty(week)) { 
            //build array of top songs for each week
            buildWeeklyTop(week);
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

    function buildWeeklyTop(week){
        if (db3[week] && db3[week].tracks.length > 0){
            let song = db3[week].tracks[0];
            let playableEntry = playable[song.artist][song.title];
            let metaData = {
              "week": week,
              "title": song.title,
              "artist": song.artist,
              "playCount": playableEntry.playCount,
              "weeksAtTop": playableEntry.weeksAtTop,
              "topWeek": playableEntry.topWeek,
              "sourceFile": null,
            }
            if (week > 1319371100){
                weeklyChart.push(metaData);
            }
        }
    }

    return {all: songs, playable: playable, weeklyTop: weeklyChart};
}

module.exports = LastFmDataFixer;
