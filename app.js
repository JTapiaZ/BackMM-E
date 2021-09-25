console.clear();
require('dotenv').config()

// ---------------------------------- //
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

// Database Connection
mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('¡Connection Successfully!')
    });


// Initialize the application
const app = express();

// Middlewares
app.use('/static', express.static(__dirname + '/reportes'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.set('trust proxy', true);

// Cors
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const whitelist = ['IP'];
const corsOptions = {
    origin: (origin, callback) => {

        const existe = whitelist.some(dominio => dominio === origin);

        if (existe) {
            callback(null, true)
        } else {
            callback(new Error('No tienes permitido ingresar'))
        }
    }
}

// Esta limita el acceso
// app.use(cors(corsOptions));

// Esta es abierta para todo el mundo.
app.use(cors());


//Routes
app.use('/admin', require('./src/Routes/adminRoutes')); 

// Run the server
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});