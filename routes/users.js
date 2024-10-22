const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcrypt');



// Registro de usuario
router.get('/register', (req, res) => {
  res.render('register', { title: 'Registro' });
});


// Ruta de registro
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', { title: 'Registro', error: 'El correo electrónico ya está en uso.' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear y guardar el nuevo usuario
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Establecer la sesión del usuario
    req.session.userId = user._id;

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('register', { title: 'Registro', error: 'Error al registrarse. Inténtalo de nuevo.' });
  }
});


// Inicio de sesión
router.get('/login', (req, res) => {
  res.render('login', { title: 'Iniciar Sesión' });
});

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Encontrar el usuario por correo electrónico
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', { title: 'Iniciar Sesión', error: 'Correo o contraseña incorrectos.' });
    }

    // Comparar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { title: 'Iniciar Sesión', error: 'Correo o contraseña incorrectos.' });
    }

    // Establecer la sesión del usuario
    req.session.userId = user._id;

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('login', { title: 'Iniciar Sesión', error: 'Error al iniciar sesión. Inténtalo de nuevo.' });
  }
});

// routes/users.js
router.get('/account', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    res.render('account', { title: 'Mi Cuenta', user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener información de la cuenta');
  }
});

// Ruta de cierre de sesión
router.get('/logout', (req, res) => {
  // Destruir la sesión del usuario
  req.session.destroy(err => {
    if (err) {
      console.error('Error al destruir la sesión:', err);
      return res.redirect('/');
    }
    // Limpiar la cookie de sesión en el cliente
    res.clearCookie('connect.sid', { path: '/' });
    // Redirigir al usuario a la página de inicio de sesión
    res.redirect('/users/login');
  });
});

module.exports = router;
