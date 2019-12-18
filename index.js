'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var host = process.env.DB_URL || '0.0.0.0';
var port = process.env.DB_URL || 3900;

//importar variables de entorno locales
require('dotenv').config({ path: 'variables.env' });


mongoose.set('useFindAndModify', false);

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL,
{useNewUrlParser: true}).then(() =>{
    console.log('Conexión a la base de datos exitosa!!!');
    //crear servidor y escuchar peticiones
    app.listen(port, host, () => {
        console.log('Servidor funcionando correctamente!!!');
    });
});
