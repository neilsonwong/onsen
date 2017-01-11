"use strict";

var async = require("async");
var fs = require("fs");
var lastfm = require("./lastfm");


lastfm.updateData(function(success){
    console.log(success ? "yay" : "nay");
});