"use strict";

let express = require("express");

//host simple web interface to allow user to manage song libraries

function SongManager(){
    //load playable
    //load catalogue
    this.playable = require("./playable");
    this.catalogue = require("./catalogue");
    this.server = express();

    this.initPaths();
}

SongManager.prototype.initPaths = function(){
    //generate playable table
    let html = baseHtml;
    html[3] = genPlayableTable(this.playable);
    html[1] = genStyle();
    html[4] = genScript();

    this.server.get('/', function(req, res) {
        res.send(html.join(""));
    });

    this.server.listen(7500, function () {
        console.log('SM up')
    })
}

/*
    "title": "Dancing stars on me!",
    "artist": "μ's",
    "playCount": 264,
    "weeksAtTop": 4,
    "topWeek": "2017-01-08T12:00:00.000Z",
    "album": "Love wing bell/Dancing stars on me!",
    "audioBitrate": "320 kbps",
    "sourceFile": "/home/neilson/Music/02. Dancing stars on me!.mp3" 
*/
function genPlayableTable(playable){
    let html = '<table id="playable">';
    let artist, title, song, row, missing;
    let replaceThis = '<label class="replace"><span>browse</browse><input type="file" /></label>';

    //add header
    html += '<tr>' +
            '<th>Title</th>' + 
            '<th>Artist</th>' + 
            '<th>Playcount</th>' + 
            '<th>WeeksAtTop</th>' + 
            '<th>Album</th>' + 
            '<th>File</th>' + 
            '<th>Bitrate</th>' + 
            '<th>Image</th>' + 
            '</tr>';

    for (artist in playable){
        for (title in playable[artist]){
            song = playable[artist][title];

            missing = (song.sourceFile === null);
            //add table row
            row = missing ? '<tr class="missing">' : '<tr>';
            
            //add table cells
            row +=
                '<td>' + song.title + '</td>' + 
                '<td>' + song.artist + '</td>' + 
                '<td>' + song.playCount+ '</td>' + 
                '<td>' + song.weeksAtTop + '</td>' + 
                '<td>' + (song.album || '') + '</td>' + 
                '<td>' + (song.sourceFile || replaceThis) + '</td>' + 
                '<td>' + song.audioBitrate + '</td>' + 
                '<td>' + (song.image || replaceThis) + '</td>';

            row += '</tr>';
            html += row;
        }
    }

    html += '</table>';
    return html;
}

function genStyle(){
    return '<style>' +
        '.missing { color: red; }' + 
        '.replace { cursor: pointer; }' + 
        'input { display: none; }' + 
        '</style>';
}

function genScript(){
    return '<script>' +
    '$("input").change(addPath);' +
    'function addPath(){' +
        'console.log("hi2");' +
        'var $file = $(this);' +
        '$file.parent().html($file.val());' +
        '$file.parent().removeClass("missing");' +
    '}' +
    '</script>';
}

/*[
    0: html start, 
    1: style tag, 
    2: body open, 
    3: body contents, 
    4: script tag, 
    5: html end]
*/
let baseHtml = [
    '<!doctype html>' +
    '<html lang="en">' + 
    '<head>' +
    '<meta charset="utf-8">' +
    '<title>Song Manager</title>' + 
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>' +
    '</head>',
    '',
    '<body>',
    '',
    '',
    '</body>' +
    '</html>'
];

var html2 = '<html lang="en"><head><meta charset="utf-8"><title>Song Manager</title><script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script><style>.missing { color: red; }.replace { cursor: pointer; }.replace > input { display: none; }</style></head><body><table id="playable"><tbody><tr><th>Title</th><th>Artist</th><th>Playcount</th><th>WeeksAtTop</th><th>Album</th><th>File</th><th>Bitrate</th><th>Image</th></tr><tr class="missing"><td>Wish on</td><td>Shota Kageyama</td><td>1</td><td>1</td><td></td><td><div class="replace">browse<input type="file"></div></td><td>null</td><td><div class="replace">browse<input type="file"></div></td></tr></table></body></html>'; 

module.exports = SongManager;