// routes/cart.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const isAuthenticated = require('../middleware/auth'); // Importar el middleware

// Añadir al carrito (protegido)
router.post('/add', isAuthenticated, async (req, res) => { // Aplicar middleware
  const productId = req.body.productId;

  try {
    const product = await Product.findById(productId);

    if (!req.session.cart) {
      req.session.cart = [];
    }

    // Verificar si el producto ya está en el carrito
    const existingProductIndex = req.session.cart.findIndex(item => item.productId == productId);

    if (existingProductIndex >= 0) {
      // Incrementar la cantidad
      req.session.cart[existingProductIndex].quantity += 1;
    } else {
      // Agregar nuevo producto al carrito
      req.session.cart.push({ productId: productId, quantity: 1 });
    }

    res.redirect('/cart');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al añadir al carrito');
  }
});

// Nueva Ruta para eliminar un producto del carrito
router.post('/remove', isAuthenticated, (req, res) => {
  const productId = req.body.productId;

  if (!req.session.cart) {
    return res.redirect('/cart');
  }

  // Filtrar el carrito para eliminar el producto con el productId proporcionado
  req.session.cart = req.session.cart.filter(item => item.productId !== productId);

  res.redirect('/cart');
});

// Mostrar el carrito (protegido)
router.get('/', isAuthenticated, async (req, res) => { // Aplicar middleware
  if (!req.session.cart) {
    return res.render('cart', { title: 'Carrito de Compras', cartItems: [], total: 0 });
  }

  try {
    const cartItems = [];

    for (const item of req.session.cart) {
      const product = await Product.findById(item.productId);
      cartItems.push({
        product: product,
        quantity: item.quantity,
        totalPrice: product.price * item.quantity
      });
    }

    const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

    res.render('cart', { title: 'Carrito de Compras', cartItems: cartItems, total: total });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al mostrar el carrito');
  }
});

module.exports = router;
