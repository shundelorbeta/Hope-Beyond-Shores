# Hope Beyond Shores

A modern editorial website for island stories, faith, community, and life beyond the shore.

## Features

- Responsive public website with landing page, story archive, and individual story pages
- Secure owner dashboard for content management
- Story creation, editing, publishing, and deletion
- Landing page content management
- Visitor contact form with spam protection
- Image upload via Supabase Storage
- Search and filter stories by category and location

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js + Express.js
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Auth**: Supabase Authentication

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- npm or yarn

### Setup

1. Clone or download this project
2. Copy `.env.example` to `.env` and fill in your Supabase credentials
3. Run the Supabase schema from `supabase/schema.sql` in your Supabase SQL Editor
4. Install dependencies:

```bash
npm install
```

5. Start the server:

```bash
npm start
```

6. Open http://localhost:3000 in your browser

### Environment Variables

See `.env.example` for required variables.

## Project Structure

```
├── server/                 # Backend
│   ├── config/            # Supabase config
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Auth, security, validation
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Helpers
│   ├── validators/       # Joi schemas
│   └── index.js          # Server entry point
├── public/               # Frontend static files
│   ├── css/              # Stylesheets
│   ├── js/               # Frontend scripts
│   ├── dashboard/        # Owner dashboard pages
│   └── uploads/          # Temporary upload folder
├── supabase/
│   └── schema.sql        # Database schema
├── package.json
└── .env.example
```

## Security

- Helmet security headers
- CORS with allowlist
- Rate limiting (general, login, contact, upload)
- JWT-based authentication
- Server-side authorization for all dashboard routes
- Input sanitization and validation
- Honeypot and spam controls for contact form
- Supabase RLS policies with least-privilege access

## License

Private project - All rights reserved.
