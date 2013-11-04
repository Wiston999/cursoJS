load('parte1.js');

var filesToRead = arguments;

for(fileIndex in filesToRead){
	print(filesToRead[fileIndex]);
	
	var fileContent = readFile(filesToRead[fileIndex]);
	eval("var jsonObject = "+fileContent);
	print(printJSON(jsonObject));
	
	
	
}