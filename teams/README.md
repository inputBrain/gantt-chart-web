# Microsoft Teams Integration

This directory contains files needed for Microsoft Teams app integration.

## Setup Instructions

### 1. Create Azure AD App Registration

1. Go to [Azure Portal](https://portal.azure.com) → Azure Active Directory → App registrations
2. Click "New registration"
3. Configure:
   - Name: `Planify Teams App`
   - Supported account types: `Accounts in any organizational directory`
   - Redirect URI: `Single-page application (SPA)` → `https://YOUR_DOMAIN/auth/callback`
4. After creation, note down:
   - **Application (client) ID** → Use as `AZURE_AD_CLIENT_ID`
   - **Directory (tenant) ID** → Use as `AZURE_AD_TENANT_ID`

### 2. Configure API Permissions

In your Azure AD App Registration:

1. Go to "API permissions"
2. Add these Microsoft Graph permissions:
   - `User.Read` (Delegated)
   - `Team.ReadBasic.All` (Delegated) - optional, for team info
   - `offline_access` (Delegated) - for refresh tokens

### 3. Configure Authentication

1. Go to "Authentication"
2. Add platform: "Single-page application"
3. Add redirect URIs:
   - `https://YOUR_DOMAIN/auth/callback`
   - `https://YOUR_DOMAIN/blank-auth-end.html`
4. Enable "Access tokens" and "ID tokens" under Implicit grant

### 4. Expose an API (for SSO)

1. Go to "Expose an API"
2. Set Application ID URI: `api://YOUR_DOMAIN/CLIENT_ID`
3. Add scope:
   - Scope name: `access_as_user`
   - Who can consent: Admins and users
   - Admin consent display name: `Access Planify`
   - Admin consent description: `Allow the app to access Planify on behalf of the signed-in user`

### 5. Update manifest.json

Replace these placeholders in `manifest.json`:

```
{{TEAMS_APP_ID}}      → Generate new GUID (e.g., from https://www.guidgenerator.com)
{{YOUR_DOMAIN}}       → Your app domain (e.g., planify.example.com)
{{AZURE_AD_CLIENT_ID}}→ Azure AD Application (client) ID
```

### 6. Create App Package

```bash
cd teams
zip -r planify-teams-app.zip manifest.json color.png outline.png
```

### 7. Upload to Teams

**For testing (sideload):**
1. Open Microsoft Teams
2. Go to Apps → Manage your apps → Upload an app
3. Select "Upload a custom app"
4. Choose `planify-teams-app.zip`

**For organization:**
1. Go to Teams Admin Center
2. Teams apps → Manage apps → Upload
3. Upload the zip file

**For AppSource (public):**
1. Go to Microsoft Partner Center
2. Create new Teams app offer
3. Follow the submission process

## Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=your-client-id
NEXT_PUBLIC_AZURE_AD_TENANT_ID=your-tenant-id
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Icons

The Teams app requires two icons:

- `color.png` - 192x192 pixels, full color
- `outline.png` - 32x32 pixels, white with transparent background

## Testing Locally

1. Install [Teams Toolkit](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-toolkit) VS Code extension
2. Or use ngrok for HTTPS tunnel: `ngrok http 3000`
3. Update manifest.json with ngrok URL
4. Sideload the app in Teams

## Troubleshooting

**App doesn't load in Teams:**
- Ensure HTTPS is used
- Check browser console for errors
- Verify domain is in `validDomains` in manifest

**Authentication fails:**
- Verify Azure AD app configuration
- Check redirect URIs match exactly
- Ensure `webApplicationInfo` in manifest is correct

**Theme doesn't match Teams:**
- Check TeamsContext is properly initialized
- Verify theme change handler is registered
