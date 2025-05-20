# X Automation Platform

A SaaS platform that automates X (formerly Twitter) interactions, enabling users to:
- Link their X account via OAuth
- Configure AI to generate up to 20 replies/day in their voice and style
- Schedule posts on user-selected subjects
- Maintain a consistent brand voice across all automated interactions

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Shadcn UI components
- **Backend**: Supabase (PostgreSQL, Auth), Netlify Functions
- **AI**: DeepSeek and OpenRouter APIs
- **Deployment**: Netlify

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- npm or pnpm
- Supabase account
- Netlify account
- X Developer account (for API access)
- DeepSeek/OpenRouter API keys

### Local Development

1. Clone the repository
```
git clone https://github.com/yourusername/x-automation-platform.git
cd x-automation-platform
```

2. Install dependencies
```
npm install
# or
pnpm install
```

3. Create `.env.local` file with the following variables:
```
# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key

# X API configuration
X_API_KEY=your-x-api-key
X_API_SECRET=your-x-api-secret
X_BEARER_TOKEN=your-x-bearer-token

# AI APIs configuration
DEEPSEEK_API_KEY=your-deepseek-api-key
OPENROUTER_API_KEY=your-openrouter-api-key
```

4. Start the development server
```
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Supabase Setup

1. Create a new Supabase project
2. Initialize the database with the following schema:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  x_access_token TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Reply settings
CREATE TABLE reply_settings (
  user_id UUID REFERENCES users(id),
  tone VARCHAR(50),
  followed_accounts TEXT[],
  content_keywords TEXT[],
  style_samples TEXT[],
  auto_approve BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Reply log
CREATE TABLE reply_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  post_id TEXT,
  reply_text TEXT,
  status VARCHAR(20), -- 'pending', 'approved', 'posted', 'rejected'
  x_reply_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Post schedule
CREATE TABLE post_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  post_text TEXT,
  subject TEXT,
  scheduled_at TIMESTAMP,
  status VARCHAR(20), -- 'pending', 'posted'
  x_post_id TEXT,
  posted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. Enable Row Level Security (RLS) on all tables
4. Configure X OAuth provider in Supabase Auth settings

### Netlify Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Configure environment variables in Netlify dashboard
4. Deploy your site

## Features

- X account linking via OAuth
- AI-powered reply generation (up to 20/day) in user's voice and style
- Post scheduling (1/day) on user-selected subjects
- Dashboard with metrics and activity tracking
- Reply review and approval
- Tone and style customization

## License

MIT 