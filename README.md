# Employee Dashboard

A React + TypeScript + Electron dashboard for employee time tracking and project allocation visualization.

## Setup

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Package for distribution
npm run dist
```

## API Configuration

The app fetches data from a REST API. To configure the API endpoint:

1. **Default configuration**: Edit `src/App.tsx`
   ```typescript
   const API_BASE_URL = 'https://api.dummy.in-lotion.de';
   const API_ENDPOINT = `${API_BASE_URL}/api/time-changes`;
   ```

2. **Alternative**: Use the API client in `src/api/client.ts`
   ```typescript
   export async function getTimeChanges(): Promise<TimeChanges[]> {
     const res = await axios.get("YOUR_API_ENDPOINT_HERE");
     return res.data as TimeChanges[];
   }
   ```

## Features

- Real-time employee time tracking data
- Project allocation visualization
- Daily work statistics
- Responsive dashboard interface

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Desktop**: Electron
- **Styling**: Tailwind CSS
- **API**: Axios for HTTP requests