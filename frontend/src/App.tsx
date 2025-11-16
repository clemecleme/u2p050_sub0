import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import Landing from './pages/Landing'
import ConspiracyList from './pages/ConspiracyList'
import MissionDetail from './pages/MissionDetail'
import BoardPage from './pages/BoardPage'

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          {/* New conspiracy routes */}
          <Route path="/conspiracies" element={<ConspiracyList />} />
          <Route path="/conspiracy/:id" element={<MissionDetail />} />
          <Route path="/conspiracy/:id/board" element={<BoardPage />} />
          {/* Legacy mission routes for backward compatibility */}
          <Route path="/missions" element={<ConspiracyList />} />
          <Route path="/mission/:id" element={<MissionDetail />} />
          <Route path="/mission/:id/board" element={<BoardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  )
}

export default App
