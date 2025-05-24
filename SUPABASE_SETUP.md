# Supabase X OAuth Setup Guide

## Environment Variables

Make sure the following environment variables are set in your Netlify deployment:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://dapxfjkdfrcwxfqrdvga.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Step-by-Step Configuration

### 1. Supabase Dashboard Configuration

**Authentication > URL Configuration:**
- Site URL: `https://x-automation.netlify.app`
- Redirect URLs: `https://x-automation.netlify.app/**`

**Authentication > Providers > Twitter:**
- Enable Twitter provider
- Add your Twitter OAuth 2.0 credentials (Client ID and Client Secret)
- The callback URL is automatically: `https://dapxfjkdfrcwxfqrdvga.supabase.co/auth/v1/callback`

### 2. Twitter Developer Portal Configuration

**IMPORTANT:** Create a Twitter OAuth 2.0 app (not OAuth 1.0a)

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new project/app
3. In your app settings, go to "User authentication settings"
4. Set up OAuth 2.0:
   - App permissions: Read and write
   - Type of App: Web App
   - Website URL: `https://x-automation.netlify.app`
   - Callback URLs: `https://dapxfjkdfrcwxfqrdvga.supabase.co/auth/v1/callback`
   - Privacy Policy URL: `https://x-automation.netlify.app` (optional)
   - Terms of Service URL: `https://x-automation.netlify.app` (optional)

5. Save your Client ID and Client Secret
6. Add them to Supabase Twitter provider settings

### 3. Authentication Flow

The authentication now works as follows:
1. User clicks "Connect X Account" → redirects to Twitter
2. User authorizes on Twitter → Twitter redirects to Supabase callback
3. Supabase processes auth → redirects to `/auth/callback` page
4. Callback page handles the OAuth code exchange → redirects to `/profile`
5. Profile page shows success/error message

### 4. Common Issues & Troubleshooting

**"requested path is invalid" error:**
- Ensure you're using OAuth 2.0 (not 1.0a) in Twitter Developer Portal
- Verify callback URL in Twitter app matches Supabase exactly
- Check that Site URL in Supabase matches your Netlify domain exactly
- Ensure Twitter app has "Read and write" permissions
- **UPDATE:** Make sure all URLs use the new domain: `https://x-automation.netlify.app`

**React Error #418 (Hydration mismatch):**
- This is now fixed with client-side rendering guards
- Disable ad blockers if they're interfering with the auth flow
- Clear browser cache and reload the page

**Session not being established:**
- Check browser console for detailed error logs
- Verify environment variables are properly set in Netlify
- Use the debug component on profile page to see detailed auth state

**Testing checklist:**
1. Twitter app is OAuth 2.0 ✓
2. Callback URL: `https://dapxfjkdfrcwxfqrdvga.supabase.co/auth/v1/callback` ✓
3. Website URL: `https://x-automation.netlify.app` ✓
4. Site URL in Supabase: `https://x-automation.netlify.app` ✓
5. Redirect URLs in Supabase: `https://x-automation.netlify.app/**` ✓
6. Environment variables set in Netlify ✓

## Important Notes

- **DO NOT** modify Supabase's default callback URL
- Use OAuth 2.0 (not OAuth 1.0a) in Twitter Developer Portal
- Make sure all URLs match exactly (including https://)
- **CRITICAL:** Update all URLs to use `https://x-automation.netlify.app`
- After making changes, wait a few minutes for Twitter changes to propagate
- Check browser console for detailed error logs during authentication

## Features Implemented

- ✅ X account authentication via Supabase OAuth
- ✅ Profile page with connection status
- ✅ Connect/disconnect functionality
- ✅ User profile information display
- ✅ Loading states and error handling
- ✅ Automatic session management
- ✅ Protected routes for scheduler and reply settings
- ✅ Enhanced error logging and debugging
- ✅ Proper OAuth callback handling
- ✅ Hydration issue fixes
- ✅ Success/error message display

## Usage

Users can now:
1. Visit the Profile page
2. Click "Connect X Account" to authenticate
3. Complete OAuth flow through X (handled by Supabase)
4. Go through callback page for proper session establishment
5. Automatically redirected back to the Profile page with success message
6. View their connected account information
7. Access protected features (scheduler, reply settings)
8. Disconnect their account if needed

The authentication state is managed globally and will persist across page reloads. 