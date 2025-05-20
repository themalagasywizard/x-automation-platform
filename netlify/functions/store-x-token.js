// Function to store X OAuth tokens
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Parse the request body
    const { userId, token } = JSON.parse(event.body);

    if (!userId || !token) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Missing required parameters' }) 
      };
    }

    // Store the token in Supabase
    const { data, error } = await supabase
      .from('users')
      .upsert({ 
        id: userId, 
        x_access_token: token,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Supabase error:', error);
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Failed to store token' }) 
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}; 