var http = require('http');
var url = require('url');
var fs = require('fs');

var userAgents = [
	"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
	"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1468.0 Safari/537.36",
	""
];

var regexp = new RegExp(/src: local\(\'(.*?)\'\).*?url\((.*?(\.\w+))\)/g);

module.exports = function(grunt) {
  grunt.registerMultiTask('download-fonts', function() {		
  	var options = this.options();

  	var destinationDir = options.fontsDir;
  	var cssFilePath = options.cssDir + 'font-face.css';
  	var relativeFontsDir = options.relativeFontsDir;

  	var requestOptions = { 
  		host: '', 
  		headers: {},
  		port: 80 
  	};

  	var done = this.async();

  	var generatedFileNames = [];

  	if (grunt.file.exists(cssFilePath)) {
			grunt.file.delete(cssFilePath, {force: true});
		}

  	this.files.forEach(function(file) {
  		userAgents.forEach(function(userAgent) {
  			http.get(getRequestOptions(file.orig.src[0], userAgent), function(res) {
  				res.setEncoding('utf8');

			  	var body = '';

			  	res.on("data", function(chunk) {
			  		// Build the body of a response
			  		body += chunk;
				  });

				  res.on('end', function () {				
				  	var fontFileDownloads = [];

				  	// Append the results from the requests into a file
						appendToCssOutputFile.call(grunt, cssFilePath, body);

				  	// Once a request is completed, parse the whole result
						matchCaptureGroups(regexp, body, function(name, extension, url) {
							// Pair remote url with local one to replace them later
							generatedFileNames.push({
								localUrl: getFontFilename(relativeFontsDir, name, extension),
								remoteUrl: url
							});

							// Download font files
						  fontFileDownloads.push(downloadFontFile(destinationDir, name, extension, url, function() {
								var result = fontFileDownloads.filter(function(controller) { 
									return !controller.complete;
								});						  		

								if (result.length == 0) {
									replaceRemoteUrlsWithLocal.call(grunt, cssFilePath, generatedFileNames);
									done(true);
								}
						  }));
						});
				  });
  			});
  		});
  	});
	});
}

getRequestOptions = function(u, userAgent) {
	var parsedUrl = url.parse(u);

	return { 
  		host: parsedUrl.hostname,
  		path: parsedUrl.path,
  		headers: { 'user-agent': userAgent},
  		port: 80 
	}
}

matchCaptureGroups = function(regexp, body, matchCallback) {
	var match = regexp.exec(body);
	
	while (match != null) {
    var name = match[1];
    var url = match[2];
    var extension = match[3];

    matchCallback(name, extension, url);

    match = regexp.exec(body);
	}
}

downloadFontFile = function(dest, name, extension, url, complete) {
	var file = fs.createWriteStream(getFontFilename(dest, name, extension));
	
	var controller = { 
		complete: false
	}

	var callback = function(response) {
		response.pipe(file);
		controller.complete = true;
		complete();
	}

  http.get(url, callback);

	return controller;
}

appendToCssOutputFile = function(cssFilePath, body) {
	var content = "";

	if (this.file.exists(cssFilePath)) {
		content = this.file.read(cssFilePath);
		content += body;
	} else {
		content += body;
	}
	
	this.file.write(cssFilePath, content);
}

replaceRemoteUrlsWithLocal = function(cssFilePath, remoteAndLocalUrlPairs) {
	var content = this.file.read(cssFilePath);

	remoteAndLocalUrlPairs.forEach(function(pair) {
		content = content.replace(pair.remoteUrl, pair.localUrl);
	});

	this.file.write(cssFilePath, content);
}

getFontFilename = function(dest, name, extension) {
	return dest + name.replace(" ", "") + extension;
}
