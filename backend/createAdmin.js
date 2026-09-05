require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const username = 'santhosh'; // change if you'd like a different username
  const plainPassword = 'Santhosh2@.in'; // change this to your own password

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log('Admin already exists!');
    process.exit();
  }

  const admin = new Admin({ username, password: hashedPassword });
  await admin.save();
  console.log('Admin created successfully:', username);
  process.exit();
}

createAdmin();