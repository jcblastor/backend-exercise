'use strict'

var express = require('express');
var ExerciseController = require('../controllers/exercise');

var router = express.Router();
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './upload/exercises'});

//rutas para la aplicacion 
router.post('/save', ExerciseController.save);
router.get('/exercises', ExerciseController.getExercise);
router.delete('/exercises/:id', ExerciseController.delete);
router.post('/upload-image/:id', md_upload, ExerciseController.upload);
router.get('/get-image/:image', ExerciseController.getImage);

module.exports = router;