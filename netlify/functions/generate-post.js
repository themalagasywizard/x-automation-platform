// Function to generate AI-powered scheduled posts
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
    const { userId, subject, scheduledAt, settings } = JSON.parse(event.body);

    if (!userId || !subject || !scheduledAt) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Missing required parameters' }) 
      };
    }

    // Get user's reply settings if not provided
    let userSettings = settings;
    if (!userSettings) {
      const { data, error } = await supabase
        .from('reply_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user settings:', error);
        return { 
          statusCode: 500, 
          body: JSON.stringify({ error: 'Failed to fetch user settings' }) 
        };
      }
      
      userSettings = data || { tone: 'casual', style_samples: [], content_keywords: [] };
    }

    // Prepare the prompt for AI
    const tone = userSettings.tone || 'casual';
    const styleExamples = (userSettings.style_samples || []).join('\n');
    const keywords = (userSettings.content_keywords || []).join(', ');
    
    const prompt = `System: Generate a single X post on the subject "${subject}". 
    Use the user's tone (${tone}), mimic their style based on provided samples:
    
    ${styleExamples}
    
    Incorporate keywords (${keywords}) if relevant. Keep the post engaging, 
    concise, and compliant with X's rules (max 280 chars).`;

    // In a real implementation, this would call the DeepSeek or OpenRouter API
    // const response = await fetch('https://api.openrouter.ai/v1/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     prompt: prompt,
    //     max_tokens: 100,
    //     temperature: 0.7
    //   })
    // });
    // const result = await response.json();
    // const postText = result.choices[0].text;
    
    // For now, we'll mock the AI response
    const postText = `Just explored some fascinating #${subject} innovations today! The way technology is evolving is mind-blowing. What are your thoughts on how these advancements will shape our future? #tech #innovation`;

    // Save the scheduled post to Supabase
    const { data, error } = await supabase
      .from('post_schedule')
      .insert({
        user_id: userId,
        post_text: postText,
        subject: subject,
        scheduled_at: scheduledAt,
        status: 'pending',
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Supabase error:', error);
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Failed to save scheduled post' }) 
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        post: postText,
        scheduled_at: scheduledAt
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