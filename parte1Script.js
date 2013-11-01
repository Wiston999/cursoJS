load('parte1.js');
var FileReader = java.io.FileReader;
var BufferedReader =java.io.BufferedReader;


var filesToRead = arguments;

for(fileIndex in filesToRead){
	print(filesToRead[fileIndex]);
	
	var fileContent = readFile(filesToRead[fileIndex]);
	eval("var jsonObject = "+fileContent);
	print(printJSON(jsonObject));
	
}