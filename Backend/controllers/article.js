'use strict'

var validator = require('validator');


var fs = require('fs'); //eliminar archivos del sistema de ficheros FileSystem o fs
var path = require('path'); // sacar el path o ruta de los archivos

var Article = require('../models/article.js');

var controller = {

    datosCurso: (req, res) => {
        var hola = req.body.hola;
        return res.status(200).send({
            curso: 'Master en Frameworks JS',
            autor: 'Darío Chiappello',
            url: 'https://www.linkedin.com/in/dar%C3%ADo-chiappello-9b3b07b2/',
            hola
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la accion test del controlador de articulos'
        });
    },

    //Metodo para guardar articulos
    save: (req, res) => {
        //recoger parametros por post
        var params = req.body;

        //validar datos (validator)
        try {
            // crea la variable y sera true cuando no este vacio params.title y params.content
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_title && validate_content) {

            /*return res.status(200).send({
			message: "Validacion correcta"
		});*/

            //Crear objeto a guardar
            var article = new Article();

            //Asignar valores
            article.title = params.title;
            article.content = params.content;
            if (params.image) {
                article.image = params.image;
            }else{
                article.image = null;
            }
            


            //Guardar articulo
            article.save((err, articleStored) => {
                //Devuelve error al guardar
                if (err || !articleStored) {
                    return res.status(200).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado!'
                    });
                }

                //Devolver respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });

            });
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Datos no validos'
            });
        }

    },

    //Nuevo metodo para sacar todos los articulos
    getArticles: (req, res) => {

        //consulta
        var query = Article.find({});

        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }



        // Find para sacar datos de la base de datos(DB)
        // Sort para ordenar los articulos de mas nuevo a mas viejo 
        //sort('_id') envia de forma ascendente //sort('-_id') envia de forma descendente
        query.sort('-_id').exec((err, articles) => {

            //error
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos!'
                });
            }

            //Cuando no hay articulos
            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos!'
                });
            }

            //Cuando se cumplen las condiciones
            return res.status(200).send({
                status: 'success',
                articles
            });
        })



    },

    // Metodo para sacar un unico articulo en concreto
    getArticle: (req, res) => {
        // Recoger ID de la URL
        var articleId = req.params.id;
        //Comprobar que existe (diferente de null)
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'El artículo no existe!'
            });
        }
        //Buscar el articulo
        Article.findById(articleId, (err, article) => {
            //error al devolver los datos
            /*if (err) {
            return res.status(500).send({
            status: 'error',
            message: 'Error en el servidor!'
            });
            }*/

            // el articulo no existe o error en el servidor (condiciones unificadas y el if de arriba no va)
            if (err || !article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'El artículo no existe!'
                });
            }

            // como no entran las otras dos condiciones negativas va el success
            //Devolver el articulo en JSON
            return res.status(200).send({
                status: 'success',
                article
            });

        });

    },

    //Actualizar o modificar los datos de un articulo
    update: (req, res) => {
        //Recoger el ID del articulo por la URL
        var articleId = req.params.id;
        //Recoger los datos que llegan por PUT
        var params = req.body;
        //Validar los datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            // titulo y contenido no deben estar vacios
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_title && validate_content) {
            //Find and update
            Article.findOneAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'
                    });
                }
                if (!articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El artículo no existe'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });
        } else {
            //Devolver respuesta
            return res.status(200).send({
                status: 'error',
                message: 'La validacion no es correcta'
            });
        }
    },

    //Eliminar articulo
    delete: (req, res) => {
        //Recoger ID de la URL
        var articleId = req.params.id;


        //Find and delete
        Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
            //error al eliminar
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al eliminar'
                });
            }
            //no existe el articulo o no se pudo eliminar
            if (!articleRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el artículo o posiblemente no exista!'
                });
            }
            //eliminar articulo
            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });


        });
    },

    //Subida de archivos -upload
    upload: (req, res) => {
        // Configurar el modulo connect multiparty (se hace en el router). router/article.js


        //Recoger el fichero de la petición
        var file_name = 'Imagen no subida...';
        //Comprobar que llegue la imagen
        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }


        //Conseguir el nombre y la extensión del archivo
        //muchas librerias envian como file0 o file123 imgs
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\'); //separar en partes el path para quedarse solamente con el nombre


        //ADVERTENCIA EN LINUX O MAC - se debería usar
        //var file_split = file_path.split('/');

        //Nombre del archivo
        var file_name = file_split[2]; //sacar el elemento dos porque la url se parte en 3 partes y la n°2 tiene el nombre

        //Sacar la extensión del archivo (.jpg)

        var extension_split = file_name.split('\.'); //el punto es el separador para conocer la extension
        var file_ext = extension_split[1]; // [1] es la posicion de la extension

        //Comprobar la extensión - solo imagenes, si no es valido borrar el fichero
        if (file_ext != "jpg" && file_ext != "png" && file_ext != "jpeg" && file_ext != "gif") {
            // Borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extension de la imagen no es valida!'
                });
            });
        } else {
            //Si todo es valido 
            //obtener url
            var articleId = req.params.id;

            if(articleId){
                // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
            Article.findOneAndUpdate({ _id: articleId }, { image: file_name }, { new: true }, (err, articleUpdated) => {
                //error o no llega el articulo actualizado
                if (err || !articleUpdated) {
                    return res.status(200).send({
                        status: 'error',
                        message: 'Error al guardar la imagen del artículo!'

                    });
                }

                //el articulo se actualizo
                return res.status(200).send({
                    status: 'success',
                    articleUpdated


                });
            });
        }else{
            return res.status(200).send({
                    status: 'success',
                     image: file_name 
                    

                });
        }

            

        }

    }, //end upload file

    //Metodo para sacar la imagen del API
    getImage: (req, res) => {
        //Sacar el nombre de la imagen en el backend
        var file = req.params.image;

        //Sacar la ruta ccompleta de la imagen
        var path_file = './upload/articles/' + file;

        // Comprobar si existe con el metodo fs
        //sendFile --> metodo de express //resolve()--> resuelve una ruta y saca el archivo como tal
        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'

                });
            }
        });

    }, //end get image

    //metodo search
    search: (req, res) => {
        //Sacar el string a buscar
        var searchString = req.params.search;

        //Find or (hacer varias condiciones para sacar el articulo de la DB) 
        Article.find({
                "$or": [
                    { "title": { "$regex": searchString, "$options": "i" } },
                    //si search string esta dentro del titulo saca el articulo
                    { "content": { "$regex": searchString, "$options": "i" } }
                    //si search string esta dentro del contenido saca el articulo
                ]
            })
            //ordenar los articulos [['date', 'descending']] ordena por fecha
            .sort([
                ['date', 'descending']
            ])

        //ejecutar la query para sacar el articulo de la base de datos
        .exec((err, articles) => {
            //si da error
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la busqueda'

                });
            }

            // si no existe el articulo
            if (!articles || articles.length <= 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'El artículo no existe'

                });
            }

            // si es positivo
            return res.status(200).send({
                status: 'success',
                articles

            });
        });

    }


}; //end controller



module.exports = controller;