require('dotenv').config()
const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Database connected successfully!')
  } catch (error) {
    console.log('Database not connected!')
    process.exit(1);
  }
}

module.exports = connectDB; 