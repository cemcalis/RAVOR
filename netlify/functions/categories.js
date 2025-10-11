const db = require('./lib/db');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    await db.initializeDatabase();

    const path = event.path.replace('/.netlify/functions/categories', '');
    const { httpMethod } = event;

    // GET /categories
    if (httpMethod === 'GET' && !path) {
      const categories = await db.getCategories();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(categories)
      };
    }

    // GET /categories/:slug
    if (httpMethod === 'GET' && path) {
      const slug = path.replace('/', '');
      const category = await db.getCategoryBySlug(slug);
      
      if (!category) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Kategori bulunamadı' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(category)
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
