const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



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

    // Generar el token JWT
    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true });
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

    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // El token expirará en 1 hora
    );

    // res.json({ token: token });

    res.cookie('token', token, { httpOnly: true });

    // Establecer la sesión del usuario

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('login', { title: 'Iniciar Sesión', error: 'Error al iniciar sesión. Inténtalo de nuevo.' });
  }
});

// Ruta de la cuenta de usuario
router.get('/account', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.render('account', { title: 'Mi Cuenta', user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener información de la cuenta');
  }
});


// Ruta de cierre de sesión
// Ruta de cierre de sesión
router.get('/logout', (req, res) => {
  // Limpiar la cookie 'token'
  res.clearCookie('token');
  // Redirigir al usuario a la página de inicio de sesión
  res.redirect('/users/login');
});

module.exports = router;
