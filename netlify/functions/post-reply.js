// Function to post approved replies to X
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
    const { replyId } = JSON.parse(event.body);

    if (!replyId) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Missing reply ID' }) 
      };
    }

    // Get the reply from Supabase
    const { data: reply, error: replyError } = await supabase
      .from('reply_log')
      .select('*, users(x_access_token)')
      .eq('id', replyId)
      .single();

    if (replyError) {
      console.error('Error fetching reply:', replyError);
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Failed to retrieve reply' }) 
      };
    }

    if (!reply) {
      return { 
        statusCode: 404, 
        body: JSON.stringify({ error: 'Reply not found' }) 
      };
    }

    // Only proceed if the reply is in 'approved' status
    if (reply.status !== 'approved') {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Reply not approved' }) 
      };
    }

    // Get the X API token
    const xToken = reply.users?.x_access_token;

    if (!xToken) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'X API token not found' }) 
      };
    }

    // In a real implementation, this would post to the X API
    // const response = await fetch('https://api.x.com/2/tweets', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${xToken}`
    //   },
    //   body: JSON.stringify({
    //     text: reply.reply_text,
    //     in_reply_to_tweet_id: reply.post_id
    //   })
    // });
    // const result = await response.json();
    
    // Mock successful posting to X
    const mockXResponse = { 
      data: { id: '987654321' },
      success: true 
    };

    // Update the reply status in Supabase
    const { error: updateError } = await supabase
      .from('reply_log')
      .update({ 
        status: 'posted',
        x_reply_id: mockXResponse.data.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', replyId);

    if (updateError) {
      console.error('Error updating reply status:', updateError);
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Failed to update reply status' }) 
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        message: 'Reply posted successfully',
        x_reply_id: mockXResponse.data.id
      })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}; 