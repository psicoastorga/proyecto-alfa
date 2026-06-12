const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      error: 'No autenticado'
    });
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch {

    res.status(401).json({
      error: 'Token inválido'
    });
  }
};

module.exports = auth;
