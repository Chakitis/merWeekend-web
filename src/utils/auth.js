
export const isAuthenticated = () => {
    return true;
  };

// const jwt = require('jsonwebtoken');
// const Token = require('../models/Token');

// const authMiddleware = async (req, res, next) => {
//   const token = req.headers['authorization'];

//   if (!token) {
//     return res.status(401).json({ message: 'Přístup odepřen. Žádný token nebyl poskytnut.' });
//   }

//   try {
//     const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
//     const storedToken = await Token.findOne({ token: token.split(' ')[1] });

//     if (!storedToken) {
//       return res.status(401).json({ message: 'Neplatný token.' });
//     }

//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Neplatný token.' });
//   }
// };

// module.exports = authMiddleware;