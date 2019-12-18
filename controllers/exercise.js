'use strict'

var validator = require('validator');
var Exercise = require('../models/exercise');
var fs = require('fs');
var path = require('path');

var controller = {

    save: (req, res) => {
        //recoger los parametros por post
        var params = req.body;
        //validar datos con validator
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_description = !validator.isEmpty(params.description);
            var validate_leftColor = !validator.isEmpty(params.leftColor);
            var validate_rightColor = !validator.isEmpty(params.rightColor);

        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar!!!'
            })
        }
        if (validate_title && validate_description && validate_leftColor && validate_rightColor) {

            //crear el objeto a guardar
            var exercise = new Exercise();
            //asignar valores
            exercise.title = params.title;
            exercise.description = params.description;
            exercise.image = null;
            exercise.leftColor = params.leftColor;
            exercise.rightColor = params.rightColor;

            //guardar el exercise
            exercise.save((err, exerciseStore) => {
                if (err || !exerciseStore) {
                    return res.status(200).send({
                        status: 'error',
                        message: 'El ejercicio no se guardo correctamente!!!'
                    })
                }
                //devolver respuesta
                return res.status(200).send({
                    status: 'success',
                    exercise: exerciseStore
                });
            })
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos!!!'
            })
        }
    },
    getExercise: (req, res) =>{
        //find
        Exercise.find({}).sort('-_id').exec((err, exercises) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los ejercicios guardados!!!'
                });
            }
            if(!exercises){
                return res.status(404).send({
                    status: 'error',
                    message:'No hay ejercicios para mostrar!!!'
                })
            }
            return res.status(200).send({
                status: 'success',
                exercises
            });
        });
    },
    delete: (req, res) =>{
        //recoger el id de la url
        var exerciseId = req.params.id;
        //find and delete
        Exercise.findOneAndDelete({_id: exerciseId},(err, exerciseRemoved) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar'
                });
            }
            if(!exerciseRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'El ejercicio que intentas eliminar no existe!!!'
                })
            }
            return res.status(200).send({
                status: 'success',
                exercise: exerciseRemoved
            })
        });
    },
    upload: (req, res) => {
        //configurar conect-multiparty(se configura en routes)
        //recoger fichero
        var file_name = 'No se pudo guardar la imagen...';

        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }        
        //conseguir nombre y extencion del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');
        //advertencia para linux/mac o subir al servidor
        //var file_split = file_path.split('/');

        //nopmbre del archivo
        var file_name = file_split[2];
        //extencion del fichero
        var exten_split = file_name.split('.');
        var file_ext = exten_split[1];

        //comprobar extencion y si no es valida borrar fichero
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif' && file_ext != 'svg'){
            //borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(404).send({
                    status: 'error',
                    message: 'La extencion de la image no es valida!!!'
                })
            })
        }else{
            //si todo es valido, sacar id de la url
            var exerciseId = req.params.id;
            //buscar exercise asignar imagen y actualizar
            Exercise.findOneAndUpdate({_id: exerciseId}, {image: file_name}, {new: true}, (err, exerciseUpdate) => {
                if(err || !exerciseUpdate){
                    return res.status(404).send({
                        status: 'error',
                        message: 'Error al guardar la imagen!!!'
                    })
                }

                return res.status(200).send({
                    status: 'success',
                    exercise: exerciseUpdate
                });
            });

            
        }        
    },// end upload
    getImage: (req, res) =>{
        var file = req.params.image;
        var path_file = './upload/exercises/'+file;

        fs.exists(path_file, (exists) => {

            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe!!!'
                }) 
            }
        });        
    }
}; //fin controller

module.exports = controller;