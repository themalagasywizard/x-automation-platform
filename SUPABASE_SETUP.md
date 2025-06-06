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
- **CRITICAL:** Ensure you're using OAuth 2.0 (not 1.0a) in Twitter Developer Portal
- Verify callback URL in Twitter app matches Supabase exactly: `https://dapxfjkdfrcwxfqrdvga.supabase.co/auth/v1/callback`
- Check that Website URL matches exactly: `https://x-automation.netlify.app`
- Ensure Twitter app has "Read and write" permissions
- **IMPORTANT:** App must be approved for production use if not in development
- Try recreating the Twitter app if all settings appear correct
- Wait 15-30 minutes after making changes for Twitter to propagate
- **Enhanced OAuth:** Now includes additional scopes and PKCE flow for better compatibility

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
- ✅ PKCE flow implementation for enhanced security
- ✅ Enhanced OAuth scopes for better Twitter compatibility
- ✅ Debug mode enabled for detailed troubleshooting

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

## Advanced Troubleshooting for "requested path is invalid"

If you're still getting this error after checking all configurations:

### 1. **Twitter App Recreation Method**
Sometimes Twitter apps get into a corrupted state. Try this:
1. Create a brand new Twitter OAuth 2.0 app
2. Use different app name than before
3. Copy the new Client ID and Secret to Supabase
4. Test immediately after creation

### 2. **Twitter App Status Check**
1. Go to Twitter Developer Portal
2. Check if your app status shows "Approved" or "In Review"
3. If "In Review", OAuth won't work until approved
4. If you need immediate testing, apply for Elevated access

### 3. **URL Validation**
Copy these exact URLs (no modifications):
- **Callback URL**: `https://dapxfjkdfrcwxfqrdvga.supabase.co/auth/v1/callback`
- **Website URL**: `https://x-automation.netlify.app`

### 4. **Browser Testing**
1. Clear all browser data for both x-automation.netlify.app and twitter.com
2. Try in incognito/private browsing mode
3. Disable any browser extensions temporarily
4. Try a different browser entirely

### 5. **Timing Issues**
- Wait 30 minutes after any Twitter Developer Portal changes
- Twitter's OAuth system can be slow to propagate changes
- Try the OAuth flow again after waiting

### 6. **Alternative Diagnostic**
Check the browser's Network tab during OAuth to see:
- What URL Twitter redirects to
- Any 400/401/403 errors from Twitter's servers
- Compare redirect URL with your configured callback

### 7. **Last Resort**
If nothing works:
1. Delete the Twitter app entirely
2. Wait 24 hours
3. Create new app with different name
4. Use OAuth 2.0 from the start (don't convert from 1.0a) 