![Landing Page](frontend/public/images/landing-page.png)

# 48_REDACTED

A blockchain-based investigation game where players solve mysteries by analyzing evidence documents stored on Arxiv.

## Overview

**48_REDACTED** is a detective game built for the Polkadot Sub0 Hackathon 2025. Players connect their wallet, register for time-limited investigation missions, explore evidence documents on an interactive board, and submit encrypted answers to solve conspiracies.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: React Flow for interactive board
- **Authentication**: MetaMask (Ethereum wallet)
- **Blockchain**: Kusama (game logic and transactions)
- **Storage**: Arxiv (temporary document storage)

## Prerequisites

- Node.js 18+
- MetaMask browser extension
- npm or yarn

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd PolkadotHackathon

# Install dependencies
cd frontend
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

## Environment Setup

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Features

### Implemented
- MetaMask wallet authentication
- Mission browsing and filtering (upcoming/active/ended)
- Time-limited missions with countdown timers
- Mission registration system
- Interactive investigation board with React Flow
- Document viewer with multiple evidence types
- 4-part answer submission system
- Sub0 jury demo mode

### Document Types
- Email, Internal Memo, Badge Log
- Surveillance Log, Police Report
- Diary, Bank Statement, Receipt
- Witness Statement

### Ready for Backend Integration
- Kusama blockchain integration for game transactions
- Arxiv integration for document retrieval
- Encrypted answer submission

## API Endpoints

All endpoints are defined in `frontend/src/services/api.ts`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/wallet` | POST | Authenticate MetaMask wallet |
| `/missions` | GET | List all missions |
| `/mission/:id` | GET | Get mission details |
| `/mission/:id/register` | POST | Register for mission (Kusama tx) |
| `/mission/:id/board` | GET | Get board data from Arxiv |
| `/mission/:id/answer` | POST | Submit encrypted answer (Kusama tx) |

See `BACKEND_INTEGRATION.md` for detailed API documentation.

## Architecture

1. **Authentication**: User connects via MetaMask (Ethereum address)
2. **Game Logic**: All game transactions happen on Kusama blockchain
3. **Storage**: Documents are temporarily stored on Arxiv
4. **Frontend**: React app communicates with backend API

## Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Main pages (Landing, Missions, Board)
│   ├── contexts/       # React Context for global state
│   ├── services/       # API integration layer
│   ├── utils/          # Mock data and helpers
│   └── types.ts        # TypeScript interfaces
└── package.json
```

## Development

```bash
cd frontend
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

## Documentation

- **README.md** - This file
- **BACKEND_INTEGRATION.md** - Detailed backend integration guide
- **PROJECT_STATUS.md** - Current project status
- **frontend/README.md** - Frontend-specific documentation

## For Backend Team

The frontend is fully functional with mock data and ready for integration. Key points:

1. **Authentication**: MetaMask wallet address is sent in `X-Wallet-Address` header
2. **Kusama Transactions**: Registration and answer submission need blockchain integration
3. **Arxiv**: Document retrieval from decentralized storage
4. **Data Format**: All TypeScript interfaces are defined in `frontend/src/types.ts`

See `BACKEND_INTEGRATION.md` for complete integration guide.

## License

MIT

---

**Built for Polkadot Sub0 Hackathon 2025**
