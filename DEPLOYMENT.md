# DEPLOYMENT.md

## Pre-Deploy Checks

Run:

```bash
npm run lint
npm run test -- --run
npm run build
```

## Required Environment Variables

Set these in Vercel or Netlify if you want live backend behavior:

- `ANTHROPIC_API_KEY`
- `ANTHROPIC_MODEL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

## Database Setup

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Confirm the `audits`, `leads`, and `shared_audits` tables exist.

## Vercel

1. Import the GitHub repository into Vercel.
2. Choose the `Vite` framework preset.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add the environment variables above.
6. Deploy.

`vercel.json` already includes the SPA rewrite rule.

## Netlify

1. Import the GitHub repository into Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add the environment variables above.
5. Deploy.

`netlify.toml` and `public/_redirects` already handle SPA routing.

## Live Smoke Test

After deployment, verify:

1. The landing page loads.
2. `Start Free Audit` opens the form.
3. Submitting the form shows results.
4. The executive summary renders.
5. Saving the audit succeeds with real environment variables.
6. The confirmation email arrives if Resend is configured.
7. Creating a share link works across devices.
8. Printing the results page produces a usable PDF.
9. A direct refresh on a shared URL still loads.
10. Lighthouse meets the target thresholds on the live URL.
