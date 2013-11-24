var express = require('express');
var app = express();
app.set('title', 'Tasks');
var tasks = new Object;

app.use(express.logger());

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
app.get('/task/:name/*',function(req,res,next){
	res.header('200', { 'Content-Type': 'application/json' });
	if(req.params.name && tasks[req.params.name]){
		next();
	}else{
		res.send({error: 'Task not found'});
	}
});

app.post('/task/:name/*',function(req,res,next){
	res.header('200', { 'Content-Type': 'application/json' });
	if(req.params.name && tasks[req.params.name]){
		next();
	}else{
		res.send({error: 'Task not found'});
	}
});

app.delete('/task/:name/*',function(req,res,next){
	res.header('200', { 'Content-Type': 'application/json' });
	if(req.params.name && tasks[req.params.name]){
		next();
	}else{
		res.send({error: 'Task not found'});
	}
});
//Fin control de errores

app.get('/', function(req, res){
	res.send( {tasks: tasks} );
});

app.put('/addTask/:name', function(req, res){
	tasks[req.params.name] = new Object;
	tasks[req.params.name]['date'] = new Object;
	tasks[req.params.name]['description'] = new String;
	tasks[req.params.name]['date']['start'] = new String;
	tasks[req.params.name]['date']['end'] = new String;
	res.send( {created: req.params.name });
});

app.get('/task/:name', function(req, res){
	res.send( {task: tasks[req.params.name]} );
});

app.get('/task/:name/dates', function(req, res){
	var jsonResponse = new Object;
	jsonResponse[req['params']['name']] = tasks[req.params.name]['date'];
	res.send( jsonResponse  );
});

app.get('/task/:name/duration', function(req, res){
	var duration = 0;
	var jsonResponse = new Object;
	if(tasks[req.params.name]['date']){
		duration = (tasks[req.params.name]['date'].end - tasks[req.params.name]['date'].start) / 1000;
	}
	jsonResponse[req.params.name] = duration;
	res.send( jsonResponse );
});

app.get('/task/:name/description', function(req, res){
	var jsonResponse = new Object;
	jsonResponse[req['params']['name']] = tasks[req.params.name]['description'];
	res.send( jsonResponse );
});

app.get('/search/:word', function(req, res){
	var jsonResponse = new Object;
	jsonResponse['tasks'] = new Array;
	for(var taskName in tasks){
		console.log(taskName);
		console.log(tasks[taskName]);
		if(tasks[taskName]['description'].search(req['params']['word']) != -1){
			jsonResponse['tasks'].push(taskName);
		}
	}
	res.send( jsonResponse );
});

app.post('/task/:name/startDate/:startDate/endDate/:endDate', function(req, res){
	tasks[req.params.name].date = {start: new Date(req.params.startDate), end: new Date(req.params.endDate)};
	var jsonResponse = new Object;
	jsonResponse[req['params']['name']] = tasks[req.params.name]['date'];
	res.send( jsonResponse );
});

app.post('/task/:name/description/:description', function(req, res){
	tasks[req.params.name]['description'] = req.params.description;
	var jsonResponse = new Object;
	jsonResponse[req['params']['name']] = tasks[req.params.name]['description'];
	res.send( jsonResponse ) ;
});

app.delete('/task/:name', function(req, res){
	delete tasks[req.params.name];
	res.send( {deleted: req.params.name} ) ;
});
app.listen(8080);
