var rest = require('restler');
var readLine = require('readline');
var baseUrl = 'http://127.0.0.1:8080';
var rl = readLine.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

rl.on('line', function (cmd) {
	cmd = cmd.toLowerCase().trim();
	var splitedCmd = cmd.split(/\s+/);
	var command = splitedCmd[0];
	var args = splitedCmd.slice(1);	//Cogemos los parametros
	switch (command){
		case 'createtask':
			rest.put(baseUrl+'/addTask/'+args[0]).once('complete', function(data){
				console.log(data);
			});
		break;
		case 'adddescription':
			rest.post(baseUrl+'/task/'+args[0]+'/description/'+args.slice(1).join('+')).once('complete', function(data){
				console.log(data);
			});
		break;
		case 'getdescription':
			rest.get(baseUrl+'/task/'+args[0]+'/description').once('complete', function(data){
				if(data.error){
					console.log(data);
				}else{
					console.log(args[0]+': '+data[args[0]].replace(/\+/g, ' '));
				}
			});
		break;
		case 'listtasks':
			rest.get(baseUrl+'/').once('complete', function(data){
				var tasks = data.tasks;
				for(taskName in tasks){
					console.log("Nombre: "+taskName);
					console.log("\tDescripcion: "+tasks[taskName].description.replace('+', ' '));
					console.log("\tDe: "+tasks[taskName].date.start);
					console.log("\tA: "+tasks[taskName].date.end);
				}
			});
		break;
		case 'adddate':
			rest.post(baseUrl+'/task/'+args[0]+'/startDate/'+args[1]+'/endDate/'+args[2]).once('complete', function(data){
				console.log(data);
			});
		break;
		case 'getdate':
			rest.get(baseUrl+'/task/'+args[0]+'/dates/').once('complete', function(data){
				if(data.error){
					console.log(data);
				}else{
					console.log("Fecha de inicio: "+data[args[0]]['start']);
					console.log("Fecha de fin: "+data[args[0]]['end']);
				}
			});
		break;
		case 'getduration':
			rest.get(baseUrl+'/task/'+args[0]+'/duration/').once('complete', function(data){
				if(data.error){
					console.log(data);
				}else{					
					var duration = data[args[0]];
					var timeDescription = 'segundos';
					if( Math.floor(duration / 60) > 0 ){
						timeDescription = 'minutos';
						duration = duration / 60;
					}
					if( Math.floor(duration / 60) > 0 ){
						timeDescription = 'horas';
						duration = duration / 60;
					}
					if( Math.floor(duration / 24) > 0 ){
						timeDescription = 'dias';
						duration = duration / 24;
					}
					console.log("Duracion de la tarea: "+duration+" "+timeDescription);
				}
			});
		break;
		case 'deletetask':
			rest.del(baseUrl+'/task/'+args[0]).once('complete', function(data){
				console.log(data);
			});
		break;
		case 'search':
			rest.get(baseUrl+'/search/'+args[0]).once('complete', function(data){
				var tasks = data.tasks;
				if(tasks.length > 0){
					console.log('Tareas que contienen la palabra '+args[0]+':');
					
					for(var i=0; i<tasks.length; i++){
						console.log(tasks[i]);
					}
				}else{
					console.log('No hay tareas que contengan la palabra '+args[0]+' en su descripcion.');
				}
			});
		break;
		default:
			console.log('Orden no reconocida');
		break;
	}
	
});