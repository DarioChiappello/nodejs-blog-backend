// Para iniciar el servidor
/* 1) abrir cmd 
   2) cd (ruta del proyecto)
   3) ejecutar los comandos "npm start"   o   "node index.js"
   4) abrir el localhost y el puerto para comprobar que funcione
   */

 /* Conexiones 
 por medio de metodo "require"
 Models -> Controllers -> Routes -> App -> Index
models/article.js => controllers/article.js => routes/article.js => app.js => index.js

 */

'use strict'
// uso estricto de javascript


var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

//forzar la desactivacion de metodos antiguos

mongoose.set('useFindAndModify', false);

//para evitar errores
mongoose.Promise = global.Promise;



// conexion a mongodb
// url = mongodb://localhost/27017
//opciones = { useNewUrlParser: true }

mongoose.connect('mongodb://localhost:27017/api_rest_blog', { useNewUrlParser: true })
	.then(() => {

	console.log('La conexion a la base de datos se ha realizado');
	// Crear Servidor y escuchar peticiones HTTP
	app.listen(port, () => {
		console.log('Servidor corriendo en http://localhost:'+port);
	});



});