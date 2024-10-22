// routes/news.js
const express = require('express');
const router = express.Router();
const News = require('../models/News');

// Ruta para listar todas las noticias
router.get('/', async (req, res) => {
  try {
    const allNews = await News.find().sort({ date: -1 }); // Ordenar por fecha descendente
    res.render('news', { title: 'Noticias', news: allNews });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener las noticias');
  }
});

// Ruta para ver el detalle de una noticia
router.get('/:id', async (req, res) => {
  const newsId = req.params.id;
  try {
    const singleNews = await News.findById(newsId);
    if (!singleNews) {
      return res.status(404).render('404', { title: 'Noticia no encontrada' });
    }
    res.render('news-detail', { title: singleNews.title, news: singleNews });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener la noticia');
  }
});


module.exports = router;
