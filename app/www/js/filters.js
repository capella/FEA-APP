angular.module('fea_app.filters', [])

.filter('beforeToday', function(){

	return function(input){

		var out = [];
		//vamos fazer um foreach e se o dia for antes de hoje, sai do filtro
		angular.forEach(input, function(dia) {
      		if (dia.day >= moment().format('E')) {
        		out.push(dia);
      		}
      
    	});
	    return out;
	}
});