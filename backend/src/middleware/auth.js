const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'travelbharat_secret_key_2024';

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const generateToken = (admin) => {
  return jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: '7d' });
};

module.exports = { auth, generateToken, JWT_SECRET };