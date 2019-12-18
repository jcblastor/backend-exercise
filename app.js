'use strict'

//cargar modulos de node
var express = require('express');
var bodyParser = require('body-parser');

//ejecutar expres(http)
var app = express();

//cargar ficheros rutas
var exercise_routes = require('./routes/routes');

//cargar middlawares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//activar CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//añadir prefijos a rutas/cargar rutas
app.use('/api', exercise_routes);


//exportar modulo(fichero actual)
module.exports = app;