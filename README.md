# BrightPath Ops Dashboard

A Next.js dashboard for BrightPath's current-state analysis and centralization plan, featuring interactive RACI matrices with Excel import/export functionality.

## Features

- **Interactive RACI Matrix**: View responsibility matrices across all systems
- **Excel Export**: Download tables as Excel files for offline editing and sharing
- **SUMMIT360 Branding**: Custom color scheme and typography

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Vercel account (for database setup)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/reydumasig/brighpath.git
cd brightpath
```

2. Install dependencies:
```bash
npm install
```


4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser


## Project Structure

```
brightpath/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── raci-tables/   # RACI table CRUD endpoints
│   │   └── init-db/       # Database initialization
│   ├── globals.css        # Global styles with brand colors
│   └── layout.tsx         # Root layout
├── components/
│   └── BrightPathDashboard.tsx  # Main dashboard component
├── lib/
│   └── db.ts              # Database utility functions
└── docs/
    ├── branding-guidelines.md    # Brand guidelines
    └── setup-vercel-postgres.md  # Database setup guide
```

## Usage

### RACI Matrix Tables

1. Navigate to **RACI Matrix** section
2. Click **📥 Download Excel** to export any table as an Excel file
3. Use the downloaded file for offline editing, sharing, or documentation

## Deploy on Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new):

1. Push your code to GitHub
2. Import the repository in Vercel
3. Set up Vercel Postgres (see setup guide)
4. Add environment variables
5. Deploy!

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
