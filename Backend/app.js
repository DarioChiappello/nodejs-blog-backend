'use strict'

// cargar modulos de node para  crear servidor

var express = require('express');
var bodyParser = require('body-parser'); //convierte datos a objeto de js

//ejecutar express (http)

var app = express();

//cargar ficheros rutas
var article_routes = require('./routes/article.js');



//cargar Middlewares

app.use(bodyParser.urlencoded({extended:false})); //carga el body-parser
app.use(bodyParser.json()); // convierte el objeto a json


//CORS
// CORS --> acceso cruzado entre dominios. Permite el acceso y llamadas HTTP , AJAX o Asincronas desde cualqiuer ordenador o navegador Frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
}); // es un midleware que se ejecuta antes de las rutas y permite el acceso, metodos


// Añadir prefijos a rutas / Cargar rutas
app.use('/api', article_routes);




// exportar modulo (fichero actual)

module.exports = app; // permite usar objetos fuera del fichero

//Arquitectura = Modelo vista controlador MVC







//Anotaciones 
// Ruta o metodo de prueba para el API
//envia por get

/*
enviar por get
app.get('/datos-curso', (req, res) => {
	var hola = req.body.hola;
	return res.status(200).send({
		curso: 'Master en Frameworks JS',
		autor: 'Darío Chiappello',
		url: 'https://www.linkedin.com/in/dar%C3%ADo-chiappello-9b3b07b2/',
		hola
	});
});
*/
/* 
enviar por post
app.post('/datos-curso', (req, res) => {
	var hola = req.body.hola;
	return res.status(200).send({
		curso: 'Master en Frameworks JS',
		autor: 'Darío Chiappello',
		url: 'https://www.linkedin.com/in/dar%C3%ADo-chiappello-9b3b07b2/',
		hola
	});
});

*/