// Function to scan followed accounts' posts
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  // This function will be triggered by a scheduled event (Netlify cron)
  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Get all active users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, x_access_token')
      .not('x_access_token', 'is', null);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch users' }) };
    }

    // Process each user's followed accounts
    for (const user of users) {
      // Get user's reply settings
      const { data: settings, error: settingsError } = await supabase
        .from('reply_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (settingsError) {
        console.error(`Error fetching settings for user ${user.id}:`, settingsError);
        continue;
      }

      if (!settings) {
        console.log(`No reply settings found for user ${user.id}`);
        continue;
      }

      // Get followed accounts from settings
      const accounts = settings.followed_accounts || [];
      
      // Check if daily reply limit is reached
      const today = new Date().toISOString().split('T')[0];
      const { count, error: countError } = await supabase
        .from('reply_log')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .gte('created_at', `${today}T00:00:00Z`)
        .lt('created_at', `${today}T23:59:59Z`);
      
      if (countError) {
        console.error(`Error counting today's replies for user ${user.id}:`, countError);
        continue;
      }
      
      // Skip if daily limit reached (20 replies/day)
      if (count >= 20) {
        console.log(`User ${user.id} has reached their daily reply limit`);
        continue;
      }

      // For each account, fetch recent posts
      for (const account of accounts) {
        try {
          // In a real implementation, this would call the X API
          // const response = await fetch(`https://api.x.com/2/users/by/username/${account}/tweets`, {
          //   headers: { Authorization: `Bearer ${user.x_access_token}` },
          // });
          // const posts = await response.json();
          
          // For now, we'll mock the response
          const posts = [
            { id: '123456', text: 'Sample post about #tech and #AI innovations', author_id: account },
            { id: '123457', text: 'Another sample post about software development', author_id: account }
          ];

          // Filter posts by keywords from settings
          const keywords = settings.content_keywords || [];
          const filteredPosts = posts.filter(post => {
            return keywords.some(keyword => 
              post.text.toLowerCase().includes(keyword.toLowerCase())
            );
          });

          // For each filtered post, check if a reply already exists
          for (const post of filteredPosts) {
            const { data: existingReply } = await supabase
              .from('reply_log')
              .select('id')
              .eq('user_id', user.id)
              .eq('post_id', post.id)
              .single();

            if (!existingReply) {
              // If no reply exists, call generate-reply function
              // In a real implementation, this would be an API call to another function
              console.log(`Generating reply for user ${user.id} to post ${post.id}`);
              
              // TODO: Call generate-reply function
              // await fetch('/.netlify/functions/generate-reply', {
              //   method: 'POST',
              //   body: JSON.stringify({ userId: user.id, post, settings }),
              // });
            }
          }
        } catch (error) {
          console.error(`Error processing account ${account} for user ${user.id}:`, error);
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Posts scanned successfully' })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}; 