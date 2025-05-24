# Supabase X OAuth Setup Guide

## Environment Variables

Make sure the following environment variables are set in your Netlify deployment:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Supabase Configuration

1. **Enable Twitter OAuth in Supabase Dashboard:**
   - Go to Authentication > Providers
   - Enable Twitter provider
   - Add your Twitter OAuth credentials (API Key and API Secret)
   - The callback URL is automatically set to: `https://your-project-id.supabase.co/auth/v1/callback` (DO NOT CHANGE THIS)

2. **Set Site URL in Supabase:**
   - Go to Authentication > URL Configuration
   - Set Site URL to: `https://your-netlify-domain.app`
   - Set redirect URLs to: `https://your-netlify-domain.app/**` (allows all paths)

3. **Twitter Developer Account Setup:**
   - Create a Twitter Developer account
   - Create a new app in the Twitter Developer Portal
   - Configure OAuth 2.0 settings
   - Add Supabase's callback URL to allowed callback URLs: `https://your-project-id.supabase.co/auth/v1/callback`
   - Add your site URL: `https://your-netlify-domain.app`

## Important Notes

- **DO NOT** modify Supabase's default callback URL (`https://your-project-id.supabase.co/auth/v1/callback`)
- Supabase handles the OAuth flow automatically and redirects users back to your site
- After successful authentication, users will be redirected to `/profile`

## Features Implemented

- ✅ X account authentication via Supabase OAuth
- ✅ Profile page with connection status
- ✅ Connect/disconnect functionality
- ✅ User profile information display
- ✅ Loading states and error handling
- ✅ Automatic session management
- ✅ Protected routes for scheduler and reply settings

## Usage

Users can now:
1. Visit the Profile page
2. Click "Connect X Account" to authenticate
3. Complete OAuth flow through X (handled by Supabase)
4. Automatically redirected back to the Profile page
5. View their connected account information
6. Access protected features (scheduler, reply settings)
7. Disconnect their account if needed

The authentication state is managed globally and will persist across page reloads. 