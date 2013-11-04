var limite=process.argv[2]?process.argv[2]:20;

function fibonacci(number){
	if(number == 0){
		return 0;
	}else if(number == 1){
		return 1;
	}else{
		return fibonacci(number-1)+fibonacci(number -2);
	}
}

var solucion = new Object;
solucion['start'] = limite;
solucion['end'] = fibonacci(limite);

console.log(solucion);
