# TravelBharat – Explore India State by State

A comprehensive tourism web application for exploring Indian destinations.

## Quick Start

### Backend
```bash
cd travelbharat/backend
npm install
# Set MONGODB_URI in .env
npm run seed   # Seed sample data
npm run dev   # Start on port 5000
```

### Frontend
```bash
cd travelbharat/frontend
npm install
npm run dev   # Start on port 3000
```

## Environment

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/travelbharat
JWT_SECRET=your_secret
PORT=5000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Frontend (production)
```
NEXT_PUBLIC_API_URL=/_/backend/api
```

If the frontend and backend are deployed together on Vercel, `/_/backend/api` keeps requests on the same origin and avoids browser blocks against `localhost`.

## Admin
- Username: `admin`
- Password: `travelbharat2024`

## Pages
- `/` - Homepage
- `/states` - All States
- `/states/[slug]` - State Detail
- `/cities/[slug]` - City Detail
- `/place/[slug]` - Place Detail
- `/search` - Search
- `/categories/[category]` - Category View
- `/admin/login` - Admin
- `/admin/dashboard` - Dashboard
