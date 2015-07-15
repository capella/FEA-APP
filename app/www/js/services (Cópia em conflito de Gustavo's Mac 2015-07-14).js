angular.module('fea_app.services', [])

//serviço principal de busca de informações combinando cache e servidor
.service("datafetcher", function($q, $http, cachenizer){
	return({
		fetch:fetch,
		grabFromCache: grabFromCache
	});
	function fetch(data, stKey, srUrl)
	{
		var base_url = "http://fea.capella.pro/";
		var deferred = $q.defer();
		var that = this;
		//verificamos se tem conexão
		if(navigator.onLine)
		{
			//usar servidor
			$http.get(base_url+srUrl, data).then(function(data){

				//sucesso. Cachear e retornar pro callback
				cachenizer.write(data, stKey);
				deferred.resolve(data);

			}, function(status){
				if(status === 0) //pau de timeout
				{
					//tentar buscar do cache
					grabFromCache(stKey).then(function(data){
						deferred.resolve(data);
					}, function(error){
						//se nem tiver no cache, retorna erro de timeout
						deferred.reject("timeout");
					});
				}
				else //pau interno
				{
					deferred.reject("internal-error");
				}
			});
		}
		else
		{
			//tentar buscar do cache
			grabFromCache(stKey).then(function(data){
				deferred.resolve(data);
			}, function(error){
				deferred.reject("no-cache");
			});
		}
		return deferred.promise;
	}
	//busca no cache
	function grabFromCache(key)
	{
		var deferred = $q.defer();
		var data = cachenizer.get(key);
		if(data == null)
		{
			//se nao achar, retorna erro
			deferred.reject();
		}
		else
		{
			deferred.resolve(data);
		}
		return deferred.promise;
	}
})

//gerenciador de cache
.service('cachenizer', function(localStorageService){
	return({
		write: write,
		get: get,
		clean: clean
	});
	function write(data, key)
	{
		localStorageService.set(key, data);
	}
	function get(key)
	{
		return localStorageService.get(key);
	}
	function clean()
	{
		localStorageService.clearAll();
	}
})

//para dados que precisem ser persistidos na troca de views
.service("persistor", function(){
	return({
		set: set,
		get: get,
		remove: remove,
		clean: clean
	});

	function set(propname, value)
	{
		this[propname] = value;
	}
	function get(propname, def)
	{
		if(typeof this[propname] === "undefined")
		{
			this[propname] = def;
		}
		return this[propname];
	}
	function remove(propname)
	{
		delete this[propname];
	}
	function clean()
	{
		for (var propname in this) {
			if(!angular.isFunction(this[propname]))
			{
				this[propname] = undefined;
			}
		}
	}
})

.service("loadingService", function($ionicLoading){
	return({
		startLoading: startLoading,
		finishWithSuccess: finishWithSuccess,
		finishWithError: finishWithError
	})

	function startLoading(scope)
	{
		$ionicLoading.show({
      		template: '<ion-spinner></ion-spinner> Carregando...'
  		});
	}
});