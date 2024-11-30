const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

// Připojení k MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Funkce pro vytvoření administrátorského účtu
const createAdmin = async () => {
  const username = 'adminTest';
  const password = 'adminTESTpassword';

  try {
    // Zkontroluj, jestli uživatel neexistuje
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('Admin account already exists');
      process.exit(0);
    }

    // Vytvoř nového uživatele
    const newUser = new User({ username, password });

    // Ulož uživatele do databáze
    await newUser.save();

    console.log('Admin account created');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin account:', error);
    process.exit(1);
  }
};

createAdmin();