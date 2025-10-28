require('dotenv').config({ path: '../.env' });
const jwt = require('jsonwebtoken');

const userId = process.argv[2] || 22;
const isAdmin = !!process.argv[3];

const token = jwt.sign({ userId: Number(userId), isAdmin }, process.env.JWT_SECRET, { expiresIn: '24h' });
console.log(token);
