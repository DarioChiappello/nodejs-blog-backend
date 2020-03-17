'use strict'

var express = require('express');
var ArticleController = require('../controllers/article.js');


//Llamar al router
var router = express.Router();

//Conectar el multiparty
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './upload/articles' }); //Dar destino a los archivos o fotos que se van a guardar



//crear rutas
//rutas de prueba
router.post('/datos-curso', ArticleController.datosCurso);
router.get('/test-de-controlador', ArticleController.test);


//Rutas utiles para articulos
router.post('/save', ArticleController.save); //ruta para guardar datos
router.get('/articles/:last?', ArticleController.getArticles); //ruta para listar articulos
router.get('/article/:id', ArticleController.getArticle); //ruta para seleccionar un articulo determinado
router.put('/article/:id', ArticleController.update); // ruta para actualizar un articulo
router.delete('/article/:id', ArticleController.delete); //ruta para eliminar un articulo
router.post('/upload-image/:id?', md_upload, ArticleController.upload); //ruta para la subida de archivos o imagenes //aplicar middleware a ruta
router.get('/get-image/:image', ArticleController.getImage); //ruta para sacar una imagen de la API
router.get('/search/:search', ArticleController.search); //saca informacion del API


// get para sacar datos de la DB - post para guardar o enviar datos a la DB - put para actualizar - delete para borrar

module.exports = router;