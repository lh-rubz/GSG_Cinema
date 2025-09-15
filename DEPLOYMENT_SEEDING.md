# Database Seeding After Deployment

After deploying your application to Vercel, you'll need to populate your database with initial data. Here's how to do it:

## Setup

1. **Add Environment Variable in Vercel:**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add a new variable:
     - Name: `SEED_SECRET`
     - Value: A secure random string (e.g., use a password generator)
   - Redeploy your application after adding the environment variable

## Seeding the Database

1. **Using the API Endpoint:**
   ```bash
   # Replace YOUR_DOMAIN with your actual Vercel domain
   # Replace YOUR_SECRET with the SEED_SECRET you set in Vercel
   curl -X POST https://YOUR_DOMAIN.vercel.app/api/seed \
     -H "Content-Type: application/json" \
     -d '{"secret": "YOUR_SECRET"}'
   ```

2. **Using a web browser:**
   - Navigate to: `https://YOUR_DOMAIN.vercel.app/api/seed`
   - Check the current seeding status
   - Use a tool like Postman to make a POST request with the secret

3. **What gets seeded:**
   - Directors (10 directors)
   - Cast members (20 cast members)
   - Movies (10 movies with cast assignments)
   - Users (5 sample users)
   - Cinema screens (3 screens)
   - Promotions (3 sample promotions)
   - Showtimes (multiple showtimes for each movie)
   - Reviews (sample reviews for movies)
   - Replies (sample replies to reviews)

## Verification

After seeding, you can verify the data was inserted by:
- Checking your database directly
- Visiting your application and browsing movies, showtimes, etc.
- Making a GET request to `/api/seed` to see the seeding status

## Security Notes

- The seeding endpoint is protected by a secret key
- Only use this endpoint once per deployment
- Keep your `SEED_SECRET` secure and don't share it publicly
- Consider removing or disabling the seed endpoint in production after initial seeding

## Alternative Seeding Methods

If you prefer not to use the API endpoint, you can also:

1. **Run seeds locally then backup/restore:**
   ```bash
   # Run seeds locally
   npm run seed
   
   # Create a database backup
   pg_dump your_database > backup.sql
   
   # Restore to production database
   psql your_production_database < backup.sql
   ```

2. **Use Prisma Studio:**
   - Connect Prisma Studio to your production database
   - Manually add the required data

## Troubleshooting

- **"Unauthorized" error:** Check that your `SEED_SECRET` matches exactly
- **Database connection errors:** Verify your `DATABASE_URL` is correct in Vercel
- **Foreign key constraint errors:** The seeding happens in the correct order, but if you have existing data, you may need to clear it first
