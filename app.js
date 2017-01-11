"use strict";

var lastfm = require("./lastfm");

lastfm.updateData(function(success){
    console.log(success ? "yay" : "nay");
});