const express = require('express');
const mongoose = require ('mongoose');

mongoose.connect('mongodb+srv://Teo:passe@cluster0.y776q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res) => {
    res.json({ message: 'Votre requête a bien éét reçue :' });
});

module.exports = app;