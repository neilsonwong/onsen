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

AudioHelper.imHalping = function(dirs, callback){
    //handle non arrays
    if (!Array.isArray(dirs)){
        dirs = [dirs];
    }

    let playable = require("./playable");
    let catalogue = {};
    
    async.each(dirs, function(dir, done){
        //run exiftool and recursively grab mp3 metadata from dir
        grabFileMetaData(dir, function(data){
            //loop through and throw into a big catalogue
            let i, artist, title;
            for (i = 0; i < data.length; ++i){
                //i am lazy
                //so for now skip songs with incomplete artist, title

                artist = alias.title(data[i].Artist);
                title = alias.title(data[i].Title);

                if (artist == null || title == null){
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
        fs.writeFile("catalogue.json", JSON.stringify(catalogue), function(){
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
    execFile("exiftool", ["-Artist", "-Album", "-Title", "-AudioBitrate", "-ext", "mp3", "-ext", "m4a", "-charset", "utf8", "-j", "-r", dir], function(error, stdout, stderr) {
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

module.exports = AudioHelper;