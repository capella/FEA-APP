var base_url = "http://fea.capella.pro/";

angular.module('app_fea.services', [])

.factory('Cardapio_server', function($resource) {
  return $resource(base_url+'app/bandejao.json');
})

.factory('User_server', function($resource) {
  return $resource(base_url+'app/user.json');
})

.factory('Noticias_server', function($resource) {
  return $resource(base_url+'app/:start/:number/noticias.json');
})

.factory('Eventos_server', function($resource) {
  return $resource(base_url+'app/:mes/:ano/eventos.json');
})


.factory('Eventos', function(Eventos_server) {
    var eventos = [];
    var set_ano = -1;
    var set_mes = -1;
    var functions = {
        get: function(mes, ano, ok, erro) {
        	var send_data = {mes: mes, ano: ano};
			Eventos_server.query(send_data, function(data) {
				eventos = data;
				eventos.forEach(function(element){
					element.date = new Date(element.data2*1000);
				});
                set_ano = ano;
				set_mes = mes;
				ok(data);
			}, function(error) {
				erro(error)
			});  
		},
        get_id: function(id, mes, ano, ok, erro) {
        	var return_data;
        	if (set_ano == ano && set_mes == mes && id){
        		eventos.forEach(function(value, key) {
        			if(value.id == id){
        				ok(value);
        			}
        		});
        	} else {
                functions.get(mes, ano, function(){
                    console.log(44);
                    functions.get_id(id, mes, ano, ok, erro);
                }, erro);
            }
		}
    };
    return functions;
})

;
