import axios from 'axios'

// API base URL (for future backend integration)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Set wallet address for auth
export const setAuthToken = (walletAddress: string | null) => {
  if (walletAddress) {
    apiClient.defaults.headers.common['X-Wallet-Address'] = walletAddress
  } else {
    delete apiClient.defaults.headers.common['X-Wallet-Address']
  }
}

// Authenticate wallet (Ethereum address)
export const authenticateWallet = async (walletAddress: string) => {
  // TODO: Backend integration - POST /auth/wallet
  return {
    success: true,
    user: {
      address: walletAddress,
      registeredConspiracies: [],
    },
  }
}

// Get conspiracy board (returns empty - populated from Arkiv)
export const getConspiracyBoard = async (conspiracyId: string) => {
  // TODO: Backend integration - GET /conspiracy/:id/board
  // Note: Board data now comes directly from Arkiv, this may be deprecated
  return []
}

// Submit answer (will be connected to blockchain later)
export const submitAnswer = async (conspiracyId: string, answer: string) => {
  // TODO: Backend integration - POST /conspiracy/:id/answer
  // Will send encrypted answer to blockchain smart contract
  // const response = await apiClient.post(`/conspiracies/${conspiracyId}/answer`, { answer })
  
  return {
    success: true,
    message: 'Answer submitted successfully',
  }
}
