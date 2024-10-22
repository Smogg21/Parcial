const express = require('express');
const router = express.Router();
const Product = require('../models/Product');


// Listado de productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products', { title: 'Productos', products: products });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener los productos');
  }
});

// Detalle de producto
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('product-detail', { title: 'Detalle del Producto', product: product });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener el producto');
  }
});


module.exports = router;

