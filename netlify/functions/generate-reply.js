// Function to generate AI-powered replies
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
    const { userId, post, settings } = JSON.parse(event.body);

    if (!userId || !post || !settings) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Missing required parameters' }) 
      };
    }

    // Check daily reply limit
    const today = new Date().toISOString().split('T')[0];
    const { count, error: countError } = await supabase
      .from('reply_log')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00Z`)
      .lt('created_at', `${today}T23:59:59Z`);
    
    if (countError) {
      console.error('Error counting replies:', countError);
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Failed to check daily limit' }) 
      };
    }
    
    // Enforce daily limit (20 replies/day)
    if (count >= 20) {
      return { 
        statusCode: 429, 
        body: JSON.stringify({ error: 'Daily reply limit reached' }) 
      };
    }

    // Prepare the prompt for AI
    const tone = settings.tone || 'casual';
    const styleExamples = (settings.style_samples || []).join('\n');
    const keywords = (settings.content_keywords || []).join(', ');
    
    const prompt = `System: You are an AI assistant tasked with generating a reply to an X post. 
    Use the user's tone (${tone}), mimic their style based on provided samples:
    
    ${styleExamples}
    
    Incorporate keywords (${keywords}) if relevant. Keep the reply concise, engaging, and 
    compliant with X's rules (no spam, no duplicates, max 280 chars).
    
    Post to reply to: "${post.text}"`;

    // In a real implementation, this would call the DeepSeek or OpenRouter API
    // const response = await fetch('https://api.deepseek.com/v1/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     prompt: prompt,
    //     max_tokens: 100,
    //     temperature: 0.7
    //   })
    // });
    // const result = await response.json();
    // const replyText = result.choices[0].text;
    
    // For now, we'll mock the AI response
    const replyText = `Great insights on #tech and #AI! I've been exploring similar innovations lately. What's your take on the latest neural network advancements?`;

    // Save the generated reply to Supabase
    const { data, error } = await supabase
      .from('reply_log')
      .insert({
        user_id: userId,
        post_id: post.id,
        reply_text: replyText,
        status: settings.auto_approve ? 'approved' : 'pending',
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Supabase error:', error);
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Failed to save reply' }) 
      };
    }

    // If auto-approve is enabled, post the reply immediately
    if (settings.auto_approve) {
      // In a real implementation, this would call the post-reply function
      // await fetch('/.netlify/functions/post-reply', {
      //   method: 'POST',
      //   body: JSON.stringify({ replyId: data[0].id }),
      // });
      console.log(`Auto-approved reply to post ${post.id}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        reply: replyText,
        status: settings.auto_approve ? 'approved' : 'pending'
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