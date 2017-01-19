let execFile = require('child_process').execFile;
let async = require("async");

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

AudioHelper.imHalping = function(dir){
    let playable = require("./playable");
    

    grabFileMetaData(dir, function(data){
        //loop through and throw into a big catalogue
    });

    /*
    {
        album
        artist
        AudioBitrate
        SourceFile
    }
    */

};

function grabFileMetaData(dir, callback){
    var metaData = {};

    //exiftool -artist -album -"AudioBitrate" -j a.mp3
    //exiftool -artist -album -AudioBitrate -j -charset utf8 -if "$FileType eq 'MP3'" "G:\Music"
    execFile("exiftool", ["-artist", "-album", "-AudioBitrate", "-charset", "utf8", "-if \"$FileType eq 'MP3'\"", "-j" , "-r", dir], function(error, stdout, stderr) {
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