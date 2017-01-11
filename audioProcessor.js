let execFile = require('child_process').execFile;

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