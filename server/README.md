## Central APP FEA CAVC
O link para o nossa brincadeira será: fea.capella.pro
Um bom programa para simular as requisições para MAC é o [Cocoa Rest Client](https://code.google.com/p/cocoa-rest-client/).

###### -Registro de usuário
```
POST /app/user.json
(uuid, sendcode, system)
RETURN: 2 (ok), 0 (fail)
```
Essa função pode ser chamada sempre que o aplicativo iniciar. Insere se não há nenhum registro com o uuid ou atualiza os outros campo se já exite dispositivo cadastrado.

###### -Cardápio
```
GET /app/bandejao.json
```

###### -Notícias
```
GET /app/<start>/<number>/noticias.json
```
- ``<start>`` a partir de qualnoticia vc quer receber.
- ``<number>`` quantas notcias você quer receber.

###### -Eventos
```
GET /app/<mes>/<ano>/eventos.json
```

#### Vocabulário

* uuid, número único do dispositivo
* sendcode, a string do indicador do dispositivo usado para enviar um alerta
* system, o tipo do dispositivo (android/ios) em letras minusculas

### Montando servidor

Para rodar o servidor, basta executar os seguintes comamdos.
```
bower install
composer install
```
