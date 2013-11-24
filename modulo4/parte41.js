var rest = require('restler');
var userName = process.argv[2]?process.argv[2]:'wiston999';

rest.get("https://api.github.com/search/repositories?q=user:"+userName).on('complete', function(data){
	console.log(userName+" has "+data.items.length+" repositories.");
	for(var item in data.items){
		console.log('RepoName: '+data.items[item].name+' ('+data.items[item].description+')');
	}
});