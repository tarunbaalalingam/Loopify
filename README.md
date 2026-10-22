# LOOPIFY Netlify + Neon Deployment Kit

This package contains a branded static landing page, a login/registration demo with role-specific admin/seller/buyer workspaces, the supplied logo images, a Netlify Function to test a Neon connection, and a starter PostgreSQL schema.

## Important scope note
This is a deployment starter kit, not a merge of your complete Enhanced Prototype login/marketplace. The original Enhanced Prototype's full marketplace screens could not be merged in this run. This package now includes a simple demo login/registration and role-specific workspace shell, but its account data is stored in localStorage and is NOT secure. The existing full seller/buyer/admin marketplace workflows still need to be merged and connected to protected API functions.

## 1. Local requirements
- Node.js LTS: https://nodejs.org/
- Git: https://git-scm.com/downloads (recommended)
- A GitHub account, Netlify account, and Neon account.

## Demo login accounts\n- Admin: `admin@loopify.demo` / `LoopifyAdmin123!`\n- Seller: `seller@loopify.demo` / `SellerDemo123!`\n- Buyer: `buyer@loopify.demo` / `BuyerDemo123!`\n\nThese credentials are demo-only and browser-local. Never use them as production credentials.\n\n## 2. Run locally
Open PowerShell in this folder:
```powershell
npm install
npx netlify dev
```
Open the local URL printed by Netlify CLI. Without DATABASE_URL, the website will render but the health function will return a configuration error.

To test locally, create a `.env` file (do not commit it) containing:
```text
DATABASE_URL=YOUR_NEON_POSTGRES_CONNECTION_STRING
```
Netlify CLI reads local environment variables in supported setups; if not, set it in the CLI environment before starting. Keep the connection string private.

## 3. Create Neon database
1. Go to https://console.neon.tech/ and create a project called `loopify`.
2. Open SQL Editor.
3. Paste and run `database/schema.sql`.
4. Select Connect and copy the connection string. Use the pooled connection option if appropriate for serverless.
5. Treat the connection string as a password. Do not place it in frontend JavaScript or commit it to Git.

## 4. Deploy with Netlify + GitHub
1. Create a **private** GitHub repository, for example `loopify`.
2. Upload the files in this folder. Do not upload `.env` or `node_modules`.
3. In https://app.netlify.com/ choose Add new site/project and import the Git repository.
4. Netlify reads `netlify.toml`: publish directory is `.` and functions directory is `netlify/functions`.
5. In your Netlify site's environment variable settings, add:
   - Key: `DATABASE_URL`
   - Value: your full Neon connection string
   Make sure it is available to Functions, then trigger a new deploy.
6. Visit `https://YOUR-SITE.netlify.app/.netlify/functions/health`.
   - Success response: `{"ok":true,"message":"Loopify can connect to Neon",...}`
   - If it fails, check Netlify Function logs and confirm the secret is configured correctly.

## 5. Test logo assets
- `/assets/loopify-icon.jpeg` is the mark-only logo and browser tab icon.
- `/assets/loopify-wordmark.jpeg` is the full symbol + wordmark used in the hero/social preview.
The provided source images have off-white backgrounds. A transparent PNG/SVG would look cleaner on colored surfaces.

## 6. Security before real users
The schema is only a starting point. Do not implement login by reading/writing users directly from browser JavaScript. Before real deployment:
- Implement server-side registration and login with a strong password-hashing library.
- Use secure, HttpOnly, SameSite cookies or a reviewed session mechanism.
- Validate and authorize every API request server-side.
- Never let public registration assign `admin` role; create admin users via a private server-side process.
- Add rate limiting, validation, error handling, backups and privacy terms.
- Connect the existing front end to API functions for users, listings, orders, transport, sales and expenses.
- Do not store production passwords in localStorage.
