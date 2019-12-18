'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ExerciseSchema = Schema({
    title: String,
    description: String,
    date: {type: Date, default: Date.now},
    image: String,
    leftColor: String,
    rightColor: String
});
module.exports = mongoose.model('Exercise', ExerciseSchema);
/*Mongoose convierte nuestro Exercise en plural y minusculas (exercises) los guarda usando el modelo ExerciseSchema */