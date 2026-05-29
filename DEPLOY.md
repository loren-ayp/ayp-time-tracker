# AYP Time Tracker — Deploy to Netlify

## What's in this folder

```
ayp-netlify/
  netlify.toml              ← tells Netlify how to build & route
  public/
    index.html              ← the app
  netlify/
    functions/
      toggl.js              ← serverless proxy (solves CORS)
```

## Deploy steps (one-time, ~5 minutes)

### 1. Create a free Netlify account
Go to https://netlify.com and sign up with your Google or email account.

### 2. Deploy by drag and drop
- In Netlify, click **"Add new site" → "Deploy manually"**
- Drag the entire **ayp-netlify** folder onto the upload area
- Netlify will give you a URL like `https://cheerful-sundae-abc123.netlify.app`

### 3. (Optional) Rename the site
In Netlify → Site settings → Site details → Change site name
e.g. `ayp-time-tracker` → `https://ayp-time-tracker.netlify.app`

### 4. Share the URL
Send it to anyone on your team. No login required — just the URL.

## Updating the app
If you get a new version of the files, just drag the folder onto Netlify again. It redeploys in seconds.

## Security note
The app stores your Toggl API token in your browser's local storage only.
It is never sent anywhere except to Toggl's API (via the Netlify proxy function).
Each person on your team uses their own Toggl token.
