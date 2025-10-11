const db = require('./lib/db');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    await db.initializeDatabase();

    const path = event.path.replace('/.netlify/functions/orders', '');
    const { httpMethod, queryStringParameters } = event;

    // POST /orders
    if (httpMethod === 'POST' && !path) {
      const orderData = JSON.parse(event.body);
      
      // Validate required fields
      if (!orderData.customer_name || !orderData.customer_email || !orderData.items) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Eksik bilgi' })
        };
      }

      const order = await db.createOrder({
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        customer_address: orderData.customer_address,
        items: JSON.stringify(orderData.items),
        total: orderData.total,
        status: 'pending',
        payment_method: orderData.payment_method || 'credit_card'
      });

      // Clear cart after order
      if (orderData.sessionId) {
        await db.clearCart(orderData.sessionId);
      }

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(order)
      };
    }

    // GET /orders/:id
    if (httpMethod === 'GET' && path) {
      const orderId = path.replace('/', '');
      
      // Check if it's a query for user orders
      if (queryStringParameters?.email) {
        const orders = await db.getOrdersByEmail(queryStringParameters.email);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(orders)
        };
      }

      const order = await db.getOrderById(orderId);
      
      if (!order) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Sipariş bulunamadı' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(order)
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
