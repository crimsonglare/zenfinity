# Battery Analytics Dashboard

A comprehensive battery analytics dashboard built with React, TypeScript, and Material-UI for visualizing battery cycle data from the Zenfinity Energy API.

## Features

- **Cycle Navigation**: Interactive slider to navigate through different battery cycles
- **Cycle Statistics**: Key metrics including cycle number, duration, start/end times, and SOH drop
- **Performance Metrics**: Visualizations for average speed, total distance, and max speed
- **Temperature Distribution**: Interactive histogram with toggleable sampling rates (5°, 10°, 15°, 20°)
- **Battery Health**: SOC gauge chart and SOH degradation visualizations
- **Alerts & Safety**: Display of warnings and protection events
- **Charging Insights**: Charging event statistics and patterns
- **Long-term Trends**: Multi-cycle trend analysis for SOH, SOC, temperature, distance, and speed

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **D3.js** - Data visualization
- **Zustand** - State management
- **Axios** - HTTP client
- **date-fns** - Date formatting

## Prerequisites

- Node.js 18+ and npm
- Access to the Zenfinity Energy API

## Installation

1. Clone the repository:
```bash
git clone https://github.com/crimsonglare/zenfinity.git
cd zenfinity
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, API URL is already configured):
```bash
VITE_API_BASE_URL=https://zenfinity-intern-api-104290304048.europe-west1.run.app
```

## Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building for Production

Build the project:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Deployment on Vercel

### Option 1: Deploy via Vercel Dashboard

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository: `crimsonglare/zenfinity`
4. Vercel will auto-detect the Vite framework
5. Click "Deploy" (no additional configuration needed)

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. For production deployment:
```bash
vercel --prod
```

### Environment Variables (Optional)

If you need to change the API URL, add it in Vercel:
- Go to Project Settings → Environment Variables
- Add `VITE_API_BASE_URL` with your API URL

## Project Structure

```
zenfinity/
├── src/
│   ├── components/
│   │   ├── charts/          # Chart components
│   │   ├── common/          # Reusable components
│   │   └── dashboard/       # Dashboard-specific components
│   ├── services/            # API services
│   ├── store/               # Zustand state management
│   ├── theme/               # Material-UI theme
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Root component
│   ├── Dashboard.tsx        # Main dashboard component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── vercel.json              # Vercel configuration
├── vite.config.ts           # Vite configuration
└── package.json             # Dependencies
```

## API Endpoints

The dashboard uses the following API endpoints:

- `GET /api/snapshots/summary` - Get battery summary
- `GET /api/snapshots` - Get cycle snapshots (with pagination)
- `GET /api/snapshots/{imei}/latest` - Get latest cycle
- `GET /api/snapshots/{imei}/cycles/{cycle_number}` - Get specific cycle details

## Authorized IMEIs

- `865044073967657`
- `865044073949366`

## License

This project is part of the Zenfinity Energy internship assessment.

## Author

Created as part of the Zenfinity Energy Frontend Intern Assignment.

