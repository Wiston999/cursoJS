function printJSON(jsonObject){
	var outerDiv = "<div style='margin-left:20px'>";
	for(tag in jsonObject){
		if((typeof jsonObject[tag]).toLowerCase() != 'object' && (typeof jsonObject[tag]).toLowerCase() != 'array'){	//Si no es un array ni otro json imprimimos directamente el valor
			var div = "<div>"+tag+" : "+jsonObject[tag];
		}else{	//Si no, llamamos recursivamente a esta funcion
			var div = "<div>"+tag+" : </div>";
			div+=printJSON(jsonObject[tag]);
		}
		outerDiv += div + "</div>\n";
	}
	return outerDiv;
}
