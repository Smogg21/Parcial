// models/News.js
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: String, // Ruta a la imagen de la noticia (opcional)
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('News', newsSchema);
