var express = require('express');
var app = express();
app.set('title', 'Blogging');
var comments = new Object;
var fs = require('fs');
var index = fs.readFileSync('index.html');

app.use(express.logger());

app.set('case sensitive routing', true);

app.configure(function(){
	app.use('/static', express.static(__dirname + '/static'));
	
});

app.get('/*',function(req,res,next){
	res.header('200', { 'Content-Type': 'application/json' });
	next();
});

app.post('/*',function(req,res,next){
    res.header('200', { 'Content-Type': 'application/json' });
	next();
});

app.put('/*',function(req,res,next){
    res.header('200', { 'Content-Type': 'application/json' });
    next();
});

app.delete('/*',function(req,res,next){
	res.header('200', { 'Content-Type': 'application/json' });
	next();
});

//Un poco de control de errores para que no se pueda acceder a una tarea que no existe
app.get('/:username/*',function(req,res,next){
	res.header('200', { 'Content-Type': 'application/json' });
	if(req.params.username && comments[req.params.username]){
		next();
	}else{
		res.send({status: 'error', description: 'User not logged in'});
	}
});

app.post('/:username/*',function(req,res,next){
	res.header('200', { 'Content-Type': 'application/json' });
	if(req.params.username && comments[req.params.username]){
		next();
	}else{
		res.send({status: 'error', description: 'User not logged in'});
	}
});

app.delete('/:username/*',function(req,res,next){
	res.header('200', { 'Content-Type': 'application/json' });
	if(req.params.username && comments[req.params.username]){
		next();
	}else{
		res.send({status: 'error', description: 'User not logged in'});
	}
});
//Fin control de errores

app.get('/', function(req, res){
	res.writeHead(200, {'Content-Type': 'text/html'});
	index = fs.readFileSync('index.html');
	res.end(index);
});

app.put('/:username', function(req, res){
	var response = new Object;
	if(comments[req.params.username]){
		response['status'] = 'error';
		response['description'] = 'User already in use';
	}else{
		comments[req.params.username] = new Array;
		response['status'] = 'success';
		response['description'] = 'User '+req.params.username+' logged in.';
	}
	res.send( response );
});

app.get('/:username', function(req, res){
	var response = new Object
	response['status'] = 'success';
	response['description'] = 'User comments';
	response['comments'] = comments[req.params.username];
	res.send( response );
});

app.get('/:username/users', function(req, res){
	var response = new Object
	response['status'] = 'success';
	response['description'] = 'User comments';
	response['users'] = Object.keys(comments);
	
	res.send( response );
});

app.get('/:username/:searchuser', function(req, res){
	var response = new Object
	if(comments[req.params.searchuser]){
		response['status'] = 'success';
		response['description'] = 'User comments';
		response['comments'] = comments[req.params.searchuser];
	}else{
		response['status'] = 'error';
		response['description'] = 'User '+req.params.searchuser+' not logged in';
	}
	res.send( response );
});

app.get('/:username/search/:word', function(req, res){
	var response = new Object;
	var foundComments = new Array;
	for(var userName in comments){
		for(var i=0; i<comments[userName].length; i++){
			if(comments[userName][i]['content'].search(req['params']['word']) != -1){
				foundComments.push(comments[userName][i]);
			}
		}
	}
	if(foundComments.length > 0){
		response['status'] = 'success';
		response['description'] = 'Posts containing word '+req.params.word;
		response['comments'] = foundComments;
	}else{
		response['status'] = 'error';
		response['description'] = 'No comments with term '+req.params.word;
	}
	res.send( response );
});

app.post('/:username/:title/:comment', function(req, res){
	var response = new Object;
	var tmpComment = new Object;
	tmpComment['title'] = req.params.title;
	tmpComment['content'] = req.params.comment;
	tmpComment['date'] = new Date().getTime();
	tmpComment['author'] = req.params.username;		//Solo para acceder facil desde el cliente
	comments[req.params.username].push(tmpComment);
	
	response['status'] = 'success';
	response['description'] = 'Comment Posted';
	response['newComment'] = tmpComment;
	
	res.send( response );
});

app.delete('/:username', function(req, res){
	delete comments[req.params.username];
	res.send( {status: 'success', description: 'User logged off'} ) ;
});
app.listen(8765);
