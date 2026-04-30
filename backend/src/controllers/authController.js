const { Admin } = require('../models');
const { generateToken } = require('../middleware/auth');

const authController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = generateToken(admin);
      res.json({ token, username: admin.username });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = authController;