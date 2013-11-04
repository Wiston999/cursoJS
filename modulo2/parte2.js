function printJSON(jsonObject){
	var outerDiv = $("<div style='margin-left:20px'>");
	for(tag in jsonObject){
		if((typeof jsonObject[tag]).toLowerCase() != 'object' && (typeof jsonObject[tag]).toLowerCase() != 'array'){	//Si no es un array ni otro diccionario imprimimos directamente el valor
			var div = $("<div></div>")
			div.html(tag+" : "+jsonObject[tag]);
		}else{	//Si no, llamamos recursivamente a esta funcion
			var span = $('<span style="cursor:pointer" data-active="1"></span>')
			span.html('<b>-</b> ');
			var div = $("<div></div>");
			div.append(span);
			div.append($('<span>'+tag+' : </span>'));
			div.append(printJSON(jsonObject[tag]));
			span.click(function(){
				$(this).next().next().toggle(500);
				if($(this).data('active') == '1'){
					$(this).html('<b>+</b> ');
					$(this).data('active', '0');
				}else{
					$(this).html('<b>-</b> ');
					$(this).data('active', '1');
				}
			});
		}
		outerDiv.append(div);
	}
	return outerDiv;
}
