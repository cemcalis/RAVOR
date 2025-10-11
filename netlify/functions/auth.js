const db = require('./lib/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    await db.initializeDatabase();

    const path = event.path.replace('/.netlify/functions/auth', '');
    const { httpMethod } = event;

    // POST /auth/register
    if (httpMethod === 'POST' && path === '/register') {
      const { email, password, name, phone, address } = JSON.parse(event.body);

      // Validate
      if (!email || !password || !name) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Email, şifre ve isim gereklidir' })
        };
      }

      // Check if user exists
      const existingUser = await db.getUserByEmail(email);
      if (existingUser) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Bu email zaten kayıtlı' })
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await db.createUser({
        email,
        password: hashedPassword,
        name,
        phone,
        address
      });

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            address: user.address
          },
          token
        })
      };
    }

    // POST /auth/login
    if (httpMethod === 'POST' && path === '/login') {
      const { email, password } = JSON.parse(event.body);

      // Validate
      if (!email || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Email ve şifre gereklidir' })
        };
      }

      // Find user
      const user = await db.getUserByEmail(email);
      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Email veya şifre hatalı' })
        };
      }

      // Check password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Email veya şifre hatalı' })
        };
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            address: user.address
          },
          token
        })
      };
    }

    // POST /auth/verify
    if (httpMethod === 'POST' && path === '/verify') {
      const { token } = JSON.parse(event.body);

      if (!token) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Token gereklidir' })
        };
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await db.getUserByEmail(decoded.email);

        if (!user) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Kullanıcı bulunamadı' })
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              phone: user.phone,
              address: user.address
            }
          })
        };
      } catch (error) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Geçersiz token' })
        };
      }
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};
