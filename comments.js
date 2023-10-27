// Create web server
// Start server with node comments.js

// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var url = require('url');
var port = 8080;
var file = 'comments.json';
var querystring = require('querystring');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  var params = querystring.parse(url.parse(request.url).query);
  var name = params.name;
  var comment = params.comment;
  var d = new Date();
  var time = d.toUTCString();

  if (name && comment) {
    fs.readFile(file, function (err, data) {
      if (err) throw err;
      var obj = JSON.parse(data);
      obj.comments.push({ name: name, comment: comment, time: time });
      var json = JSON.stringify(obj);
      fs.writeFile(file, json, function (err) {
        if (err) throw err;
        console.log('The comment has been saved!');
      });
    });
  }

  fs.readFile(file, function (err, data) {
    if (err) throw err;
    var obj = JSON.parse(data);
    var html = '<!DOCTYPE html><html><head><title>Comments</title></head><body><h1>Comments</h1><ul>';
    for (var i = 0; i < obj.comments.length; i++) {
      html += '<li>' + obj.comments[i].name + ' said: ' + obj.comments[i].comment + ' at ' + obj.comments[i].time + '</li>';
    }
    html += '</ul><form><p>Name: <input type="text" name="name"></p><p>Comment: <input type="text" name="comment"></p><input type="submit" value="Submit"></form></body></html>';
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(html);
    response.end();
  });
});

// Listen on port 8000, IP defaults to