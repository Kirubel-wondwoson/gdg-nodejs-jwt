const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

exports.SignUp = async (req, res) => {
  const { fullName, email, password, role } = req.body;
  try {
    if (!email || !password) return res.status(400).json({ message: 'Please fill in all required fields' })

    const existingUser = await User.findOne({ email: email });
    if(existingUser){
      return res.status(400).json({message: 'User already exists'})
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role
    })

    const token = jwt.sign({role: role}, process.env.JWT_SECRET, {expiresIn: '1h'});
    
    res.status(201).json({
      message: 'Signup successful!',
      user: newUser,
      token: token
    })

  } catch (error) {
    console.error('Error during signup:', error)
    res.status(500).json({ message: 'Internal Server Error', error: error.message })
  }
}
exports.Login = async (req, res) => {
  const {email, password} = req.body;
  try {
    if(!email || !password) return res.status(400).json({message: 'Please fill in all required fields'});
    const existingUser = await User.findOne({ email: email })
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isMatch = await bcrypt.compare(password, existingUser.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect Password. Please try again' })
    }

    const token = jwt.sign({role: existingUser.role}, process.env.JWT_SECRET, {expiresIn: '15s'});
    res.status(201).json({
      message: 'Logged in successfully!',
      user: existingUser,
      token: token
    })
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ message: 'Internal Server Error', error: error.message })
  }
}
exports.Protected = async (req, res) => {
  try {
    if (req.user.role !== 'SuperAdmin'){
      return res.status(403).json({message: 'Only SuperAdmins can access this endpoint'})
    }
    res.status(200).json({message: 'Authorized'})
  } catch (error) {
    console.error('Error during accessing protected endpoint:', error)
    res.status(500).json({ message: 'Internal Server Error', error: error.message })
  }
}