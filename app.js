const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/User');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config();

app.use(cookieParser());

mongoose.connect('mongodb://localhost/techgames', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB', err));
  
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

const indexRoutes = require('./routes/index');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart');
const newsRoutes = require('./routes/news');

app.use((req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener el usuario y establecerlo en res.locals.user
      User.findById(decoded.userId)
        .select('-password') // Excluir la contraseña
        .then(user => {
          res.locals.user = user;
          req.user = decoded; // Establecer req.user para uso en las rutas
          next();
        })
        .catch(err => {
          console.error(err);
          res.locals.user = null;
          req.user = null;
          next();
        });
    } catch (err) {
      console.error('Token inválido:', err);
      res.locals.user = null;
      req.user = null;
      res.clearCookie('token');
      next();
    }
  } else {
    res.locals.user = null;
    req.user = null;
    next();
  }
});

app.use('/', indexRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/cart', cartRoutes);
app.use('/news', newsRoutes);

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).render('404', { title: 'Página no encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
