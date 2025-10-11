const db = require('./lib/db');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Initialize database on first request
    await db.initializeDatabase();

    const path = event.path.replace('/.netlify/functions/products', '');
    const { httpMethod, queryStringParameters } = event;

    // GET /products or /products?filters
    if (httpMethod === 'GET' && !path) {
      const filters = {
        category: queryStringParameters?.category,
        featured: queryStringParameters?.featured === 'true',
        new_arrivals: queryStringParameters?.new_arrivals === 'true',
        search: queryStringParameters?.search,
        sort: queryStringParameters?.sort
      };

      const products = await db.getProducts(filters);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(products)
      };
    }

    // GET /products/:slug
    if (httpMethod === 'GET' && path) {
      const slug = path.replace('/', '');
      const product = await db.getProductBySlug(slug);
      
      if (!product) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Ürün bulunamadı' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(product)
      };
    }

    // POST /products
    if (httpMethod === 'POST') {
      const productData = JSON.parse(event.body);
      const newProduct = await db.createProduct(productData);
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newProduct)
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
