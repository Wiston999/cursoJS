var http=require('http');
var listenIP = process.argv[2]?process.argv[2]:'0.0.0.0';
var puerto=process.argv[3]?process.argv[3]:8080;
var counter = 0;

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	var htmlResponse = new String("<html><head><title>##title</title></head><body>");
	var split_url=req.url.split("/");
	if ( split_url[1] == '' ) {
		counter += 1;
		htmlResponse = htmlResponse.replace('##title', 'NodeJS Counter');
		htmlResponse += "<h1>Contador</h1>El valor del contador es: "+counter;
	} else {
		htmlResponse = htmlResponse.replace('##title', 'Forbidden');
		htmlResponse += "<h1>Forbidden</h1>";
	}
	htmlResponse += "</body></html>";
	res.end(htmlResponse);
}).listen(puerto, listenIP);
console.log('Server running at http://'+listenIP+':'+puerto+'/');