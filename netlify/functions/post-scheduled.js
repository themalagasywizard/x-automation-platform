// Function to post scheduled content
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  // This function will be triggered by a scheduled event (Netlify cron)
  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Get all pending scheduled posts that are due or past due
    const now = new Date().toISOString();
    const { data: posts, error: postsError } = await supabase
      .from('post_schedule')
      .select('*, users(id, x_access_token)')
      .eq('status', 'pending')
      .lte('scheduled_at', now);

    if (postsError) {
      console.error('Error fetching scheduled posts:', postsError);
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Failed to fetch scheduled posts' }) 
      };
    }

    if (!posts || posts.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No scheduled posts due' })
      };
    }

    // Process each scheduled post
    const results = [];
    for (const post of posts) {
      try {
        // Get the X API token
        const xToken = post.users?.x_access_token;

        if (!xToken) {
          results.push({
            id: post.id,
            status: 'error',
            message: 'X API token not found'
          });
          continue;
        }

        // In a real implementation, this would post to the X API
        // const response = await fetch('https://api.x.com/2/tweets', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${xToken}`
        //   },
        //   body: JSON.stringify({
        //     text: post.post_text
        //   })
        // });
        // const result = await response.json();
        
        // Mock successful posting to X
        const mockXResponse = { 
          data: { id: `post-${post.id}` },
          success: true 
        };

        // Update the post status in Supabase
        const { error: updateError } = await supabase
          .from('post_schedule')
          .update({ 
            status: 'posted',
            x_post_id: mockXResponse.data.id,
            posted_at: now
          })
          .eq('id', post.id);

        if (updateError) {
          console.error(`Error updating post ${post.id}:`, updateError);
          results.push({
            id: post.id,
            status: 'error',
            message: 'Failed to update post status'
          });
        } else {
          results.push({
            id: post.id,
            status: 'success',
            x_post_id: mockXResponse.data.id
          });
        }
      } catch (error) {
        console.error(`Error processing post ${post.id}:`, error);
        results.push({
          id: post.id,
          status: 'error',
          message: error.message
        });
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        results: results
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