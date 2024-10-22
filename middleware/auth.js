const jwt = require('jsonwebtoken');

function isAuthenticated(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/users/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Añadimos la información del usuario a la solicitud
    next();
  } catch (err) {
    res.clearCookie('token');
    res.redirect('/users/login');
  }
}

module.exports = isAuthenticated;
