var base_url = "http://fea.capella.pro/";
var sptrans_url = "http://api.olhovivo.sptrans.com.br/v0";
var sptrans_token = "2a05b88dde5789d1210bf16c6cb50b06c8a96310e20c9255e277cafea9367bd2";

angular.module('app_fea.services', [])

.factory('Cardapio_server', function($resource) {
   return $resource(base_url + 'app/bandejao.json');
})

.factory('User_server', function($resource) {
   return $resource(base_url + 'app/user.json');
})

.factory('Noticias_server', function($resource) {
   return $resource(base_url + 'app/:start/:number/noticias.json');
})

.factory('Eventos_server', function($resource) {
   return $resource(base_url + 'app/:mes/:ano/eventos.json');
})

.factory('Post_login', function($resource) {
   return $resource(sptrans_url + '/Login/Autenticar?token=' + sptrans_token);
})

.factory('Get_linha', function($resource) {
   return $resource(sptrans_url + '/Posicao?codigoLinha=:code', {}, {
      query: {
         method: 'GET',
         isArray: false
      }
   });
})

/*54809 8012
56663 8022*/

.factory('Eventos', function(Eventos_server) {
   var eventos = [];
   var set_ano = -1;
   var set_mes = -1;
   var functions = {
      get: function(mes, ano, ok, erro) {
         var send_data = {
            mes: mes,
            ano: ano
         };
         Eventos_server.query(send_data, function(data) {
            eventos = data;
            eventos.forEach(function(element) {
               element.date = new Date(element.data.replace(" ", "T"));
               console.log(element.date);
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
         if (set_ano == ano && set_mes == mes && id) {
            eventos.forEach(function(value, key) {
               if (value.id == id) {
                  ok(value);
               }
            });
         } else {
            functions.get(mes, ano, function() {
               console.log(44);
               functions.get_id(id, mes, ano, ok, erro);
            }, erro);
         }
      }
   };
   return functions;
})

.value("Config_rotas", function(){
   return {
      start: "",
      end: "",
      mode: ""
   };
});
