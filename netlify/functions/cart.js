const db = require('./lib/db');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    await db.initializeDatabase();

    const path = event.path.replace('/.netlify/functions/cart', '');
    const { httpMethod } = event;
    const pathParts = path.split('/').filter(p => p);

    // GET /cart/:sessionId
    if (httpMethod === 'GET' && pathParts.length === 1) {
      const sessionId = pathParts[0];
      const cart = await db.getCart(sessionId);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cart)
      };
    }

    // POST /cart/:sessionId/add
    if (httpMethod === 'POST' && pathParts.length === 2 && pathParts[1] === 'add') {
      const sessionId = pathParts[0];
      const { productId, quantity, size, color } = JSON.parse(event.body);

      const cart = await db.getCart(sessionId);
      const product = await db.getProductBySlug(productId);

      if (!product) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Ürün bulunamadı' })
        };
      }

      const existingItem = cart.items.find(
        item => item.product_id === product.id && item.size === size && item.color === color
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          product_id: product.id,
          product_slug: product.slug,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          quantity,
          size,
          color
        });
      }

      cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      await db.updateCart(sessionId, cart);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cart)
      };
    }

    // DELETE /cart/:sessionId/remove/:productId
    if (httpMethod === 'DELETE' && pathParts.length === 3 && pathParts[1] === 'remove') {
      const sessionId = pathParts[0];
      const productId = parseInt(pathParts[2]);

      const cart = await db.getCart(sessionId);
      cart.items = cart.items.filter(item => item.product_id !== productId);
      cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      await db.updateCart(sessionId, cart);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cart)
      };
    }

    // DELETE /cart/:sessionId (clear cart)
    if (httpMethod === 'DELETE' && pathParts.length === 1) {
      const sessionId = pathParts[0];
      await db.clearCart(sessionId);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Sepet temizlendi' })
      };
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
