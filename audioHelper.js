"use strict";

let execFile = require('child_process').execFile;
let async = require("async");
let alias = require("./alias");
let fs = require("fs");

function splitMp3(inputFile, duration, outputFile, callback) {
    //overload
    if (typeof outputFile === "function"){
    	//no outputFile has been passed, it is the callback
    	callback = outputFile;
    	outputFile = "cut_" + inputFile;
    }

    //"ffmpeg -t 30 -i inputfile.mp3 -acodec copy outputfile.mp3"
    return execFile("ffmpeg", ["-t", duration, "-i", inputFile, "-acodec", "copy", outputFile], function(error, stdout, stderr) {
        // command output is in stdout
        if (error){
        	console.log(error);
        }

        if (callback){
        	return callback();
        }
    });
}

function AudioHelper(){}
function AudioProcessor(){}

AudioProcessor.sliceAndDice = function(minlength ,callback){
    let audioFolderPath = "mp3";
    let outputFolderPath = "cut_mp3";
    let playable;
    let gonnaGetCut = [];
    let didNotSlice = [];

    async.series([
        function ensureAudioFolderExists(next) {
            fs.access(audioFolderPath, function(err) {
                if (err){
                    //cannot hit db path
                    //lets make it
                    return fs.mkdir(audioFolderPath, next);
                }
                else {
                    return next();
                }
            });
        },
        function loadPlayable(next) {
            playable = require("./playable");

            for (var artist in gonnaGetCut){
                for (var song in gonnaGetCut[artist]){
                    //only need weeks at top, filename
                    gonnaGetCut.push({
                        file: gonnaGetCut[artist][song].file,
                        weeksAtTop: gonnaGetCut[artist][song].weeksAtTop
                    });
                }
            }

            return next();

        },
        function tryToCutDEMALL(next){
            return async.eachLimit(gonnaGetCut, 3, function(song, after){
                let songFile = audioFolderPath + "/" + song.file;
                fs.access(songFile, function(err){
                    if (err) {
                        //sum ting wong
                        didNotSlice.push(song);
                        return after();
                    }
                    else {
                        return splitMp3(songFile, minlength*(song.weeksAtTop), outputFolderPath + "/" + song.file, after);
                    }
                });
            }, next);
        }
    ],
    function done(){
        console.log("done");
        if (callback){
            return callback();
        }
    });
};

AudioHelper.generateCatalogue = function(dirs, callback){
    //handle non arrays
    if (!Array.isArray(dirs)){
        dirs = [dirs];
    }

    let catalogue = {};
    
    async.each(dirs, function(dir, done){
        //run exiftool and recursively grab mp3 metadata from dir
        grabFileMetaData(dir, function(data){
            //loop through and throw into a big catalogue
            let i, artist, title, aliasTemp;
            for (i = 0; i < data.length; ++i){
                //i am lazy
                //so for now skip songs with incomplete artist, title

                aliasTemp = alias.get(data[i].Artist, data[i].Title);
                artist = aliasTemp[0];
                title = aliasTemp[1];
                
                if (artist === null || title === null){
                    continue;
                }

                //create the artist entry
                if (catalogue[artist] === undefined){
                    catalogue[artist] = {};
                }

                //add the song
                if (catalogue[artist][title] === undefined){
                    catalogue[artist][title] = data[i];
                }
                else {
                    //we already have a version of this song
                    if (compareBitrate(data[i], catalogue[artist][title])){
                        //the new one has a higher bitrate, we will use that instead
                        catalogue[artist][title] = data[i];
                    }
                }
            }
            return done();
        });
    },
    function done(){
        console.log("done cataloguing, writing catalogue");
        fs.writeFile("catalogue.json", JSON.stringify(catalogue, null, 2), function(){
            console.log("catalogue written");
            if (callback){
                return callback();
            }
        });
    });

    /*
    {
        Album
        Artist
        Title
        AudioBitrate
        SourceFile
    }
    */

};

function compareBitrate(a, b){
    try {
        let a_br = parseInt(a.AudioBitrate.replace("kbps", "").trim());
        let b_br = parseInt(a.AudioBitrate.replace("kbps", "").trim());
        return a_br > b_br;
    }
    catch (e){

    }
    return false;
}

function grabFileMetaData(dir, callback){
    var metaData = {};

    //exiftool -artist -album -"AudioBitrate" -j a.mp3
    //exiftool -artist -album -AudioBitrate -j -charset utf8 -if "$FileType eq 'MP3'" "G:/Music"
    execFile("exiftool", ["-Artist", "-Album", "-Title", "-AudioBitrate", "-ext", "mp3", "-ext", "m4a", "-charset", "utf8", "-m", "-j", "-r", dir], 
        { maxBuffer: 10000000 }, 
        function(error, stdout, stderr) {

        if (error){
            console.log(error);
        }
        else {
            try {
                metaData = JSON.parse(stdout);
            }
            catch(e){
                console.err(e);
            }
        }

        if (callback){
            return callback(metaData);
        }
    });
}


AudioHelper.mergeMetadata = function(callback){
    let playable = require("./playable");
    let catalogue = require("./catalogue");
    let artist, song, aArtist, aSong;
    let addedSource = 0;
    let totalSongs = 0;

    for (artist in playable){
        aArtist = alias.artist(artist);
        for (song in playable[artist]){
            aSong = alias.title(song);
            ++totalSongs;
            if (catalogue[aArtist] !== undefined && 
                catalogue[aArtist][aSong] !== undefined){
                    ++addedSource;
                    //merge the data together, we want to grab
                    //Album
                    //AudioBitrate
                    //SourceFile 
                    playable[artist][song].album = catalogue[aArtist][aSong].Album;
                    playable[artist][song].audioBitrate = catalogue[aArtist][aSong].AudioBitrate;
                    playable[artist][song].sourceFile = catalogue[aArtist][aSong].SourceFile;
            }
            else {
                //doesn't exist, add blank entries
                playable[artist][song].album = null;
                playable[artist][song].audioBitrate = null;
                playable[artist][song].sourceFile = null;

                console.log("missing file: " + aArtist + " - " + aSong);
            }
        }
    }

    //write new playable
    fs.writeFile("playable.json", JSON.stringify(playable, null, 2), function(){
        console.log("playable written");
        console.log("added: " + addedSource);
        console.log("total: " + totalSongs);
        if (callback){
            let error = (totalSongs - addedSource) == 0 ? null : "error: please ensure all files have paths";
            return callback(error);
        }
    });
}
module.exports = AudioHelper;