"use strict";

let lastfm = require("./lastfm");
let audioHelper = require("./audioHelper");

// lastfm.updateData(function(success){
    // console.log(success ? "yay" : "nay");
    audioHelper.generateCatalogue("/home/neilson/Music", function(){
        audioHelper.mergeMetadata();
    });
// });

// audioHelper.imHalping("G:/Music");
