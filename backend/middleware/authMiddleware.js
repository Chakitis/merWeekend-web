const jwt = require('jsonwebtoken');
const Token = require('../models/Token');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Přístup odepřen. Žádný token nebyl poskytnut.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const storedToken = await Token.findOne({ token });

    if (!storedToken) {
      return res.status(401).json({ message: 'Neplatný token.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Neplatný token.' });
  }
};

module.exports = authMiddleware;