// routes/cart.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Cart = require('../models/Cart'); // Importar el modelo Cart
const isAuthenticated = require('../middleware/auth');

// Añadir al carrito (protegido)
router.post('/add', isAuthenticated, async (req, res) => {
  const productId = req.body.productId;
  const userId = req.user.userId; // Usar req.user establecido por el middleware

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Verificar si el producto ya está en el carrito
    const existingItemIndex = cart.items.findIndex(item => item.productId.equals(productId));

    if (existingItemIndex >= 0) {
      // Incrementar la cantidad
      cart.items[existingItemIndex].quantity += 1;
    } else {
      // Agregar nuevo producto al carrito
      cart.items.push({ productId, quantity: 1 });
    }

    await cart.save();

    res.redirect('/cart');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al añadir al carrito');
  }
});

// Mostrar el carrito (protegido)
router.get('/', isAuthenticated, async (req, res) => {
  const userId = req.user.userId;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.render('cart', { title: 'Carrito de Compras', cartItems: [], total: 0 });
    }

    const cartItems = cart.items.map(item => {
      const product = item.productId;
      return {
        product,
        quantity: item.quantity,
        totalPrice: product.price * item.quantity
      };
    });

    const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

    res.render('cart', { title: 'Carrito de Compras', cartItems: cartItems, total: total });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al mostrar el carrito');
  }
});

// Eliminar un producto del carrito
router.post('/remove', isAuthenticated, async (req, res) => {
  const productId = req.body.productId;
  const userId = req.user.userId;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.redirect('/cart');
    }

    // Eliminar el producto del carrito
    cart.items = cart.items.filter(item => !item.productId.equals(productId));

    await cart.save();

    res.redirect('/cart');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar del carrito');
  }
});

module.exports = router;
