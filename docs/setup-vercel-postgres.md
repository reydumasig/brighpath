# Database Setup Guide (Neon Postgres)

This guide will help you set up a PostgreSQL database (Neon) for the BrightPath Ops Dashboard to enable multi-user RACI table editing.

## Prerequisites

- A Neon account (or any PostgreSQL database)
- A deployed Next.js project on Vercel (or local development environment)

## Step 1: Create Neon Database

1. Go to [Neon Console](https://console.neon.tech) (or your PostgreSQL provider)
2. Create a new project
3. Copy your connection string (it will look like: `postgresql://user:password@host/database?sslmode=require`)

**Alternative: Using Vercel Postgres**
- If you prefer Vercel Postgres, go to Vercel Dashboard → Storage → Create Database → Postgres
- Copy the connection string from the `.env.local` tab

## Step 2: Get Database Connection String

Your connection string should be in this format:
```
postgresql://username:password@host/database?sslmode=require
```

Or for Neon:
```
postgresql://neondb_owner:password@ep-xxx-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
```

## Step 3: Configure Environment Variables

### For Local Development

Create a `.env.local` file in the root of your project:

```bash
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
```

**Important:** Never commit `.env.local` to git. It's already in `.gitignore`.

### For Vercel Deployment

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:
   - `DATABASE_URL` - Your PostgreSQL connection string

4. Make sure to add it for all environments (Production, Preview, Development)

**Example:**
```
DATABASE_URL=postgresql://neondb_owner:password@ep-xxx-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
```

## Step 4: Initialize the Database

After setting up environment variables, you need to initialize the database schema:

### Option 1: Via API Endpoint (Recommended)

1. Deploy your project to Vercel (or run locally)
2. Visit: `https://your-domain.vercel.app/api/init-db` (or `http://localhost:3000/api/init-db` locally)
3. Or use curl:
   ```bash
   curl -X POST https://your-domain.vercel.app/api/init-db
   ```

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Link your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run the initialization script (you may need to create a script for this)
```

## Step 5: Verify Setup

1. Open your dashboard in the browser
2. Navigate to the **RACI Matrix** section
3. Try downloading a table as Excel
4. Edit the Excel file (change some values)
5. Upload it back
6. Refresh the page - your changes should persist!

## Troubleshooting

### Error: "Failed to fetch table data"

- Check that `DATABASE_URL` environment variable is set correctly
- Verify the database is created and active
- Check browser console for detailed error messages
- Ensure the connection string includes `?sslmode=require` if using SSL

### Error: "Failed to initialize database"

- Ensure you've run the `/api/init-db` endpoint
- Check that `DATABASE_URL` is correctly set
- Verify database permissions
- For Neon, ensure you're using the connection pooler URL if available

### Database Connection Issues

- Make sure your Vercel Postgres database is in the same region as your deployment
- Check Vercel dashboard for any database status issues
- Verify environment variables are set for the correct environment (Production vs Preview)

## Database Schema

The application creates the following table:

```sql
CREATE TABLE raci_tables (
  id SERIAL PRIMARY KEY,
  section_id VARCHAR(255) UNIQUE NOT NULL,
  headers JSONB NOT NULL,
  rows JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

- `GET /api/raci-tables` - Get all table data or specific section
- `POST /api/raci-tables` - Create or update table data
- `DELETE /api/raci-tables?sectionId=xxx` - Reset table to original
- `POST /api/init-db` - Initialize database schema (run once)

## Security Notes

- The current implementation allows any user to update tables
- For production, consider adding authentication/authorization
- Consider rate limiting for API endpoints
- Review Vercel Postgres security best practices

## Cost Considerations

### Neon
- **Free Tier**: 0.5 GB storage, suitable for development
- **Pro Plan**: Starts at $19/month, includes more storage and better performance
- Monitor your database usage in the Neon console

### Vercel Postgres
- **Hobby Plan (Free)**: 256 MB storage
- **Pro Plan**: Starts at $20/month

## Next Steps

- Consider adding user authentication
- Add audit logging for table changes
- Implement version history for tables
- Add export/import functionality for all tables at once

