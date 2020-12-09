//import des différents packages node.js
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')

//import des routes sauces et user
const sauceRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user')

//import des packages de sécurité
const dotenv = require('dotenv').config()
const helmet = require('helmet')


mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}.nvtky.mongodb.net/test?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(helmet())

//headers CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json()) //utilisation de body-parser pour analyser les données du corps de la requête

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/api/sauces', sauceRoutes) //appelle le router sauceRoute pour la route /api/sauces
app.use('/api/auth', userRoutes) //appelle le router userRoutes pour la route /api/auth


module.exports = app;