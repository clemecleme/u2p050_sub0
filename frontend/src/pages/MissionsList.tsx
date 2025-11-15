import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import MissionCard from '../components/mission/MissionCard'
import { Mission } from '../types'
import { getAllMissions } from '../utils/mockData'

const MissionsList = () => {
  const { user, setUser } = useApp()
  const navigate = useNavigate()
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'upcoming' | 'active' | 'ended'>('upcoming')

  const clearSimulations = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('simulated-registration-')) {
        localStorage.removeItem(key)
      }
    })
    window.location.reload()
  }

  useEffect(() => {
    // Fetch missions
    const loadMissions = async () => {
      try {
        const data = getAllMissions()
        setMissions(data)
      } catch (error) {
        console.error('Error loading missions:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMissions()
  }, [user, navigate])

  const handleRegister = (missionId: string) => {
    if (!user) return
    
    setUser({
      ...user,
      registeredMissions: [...(user.registeredMissions || []), missionId]
    })
  }

  const filteredMissions = missions.filter(m => m.status === filter)

  if (loading) {
    return (
      <div className="missions-page">
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl" style={{ color: '#5a7fa3' }}>Loading missions...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="missions-page landing-page">
      <div className="container mx-auto px-4 py-8">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Back button */}
            <Link 
              to="/" 
              style={{
                fontSize: '2rem',
                color: '#5a7fa3',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#00ff41'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#5a7fa3'}
            >
              ←
            </Link>
            <h1 className="text-4xl font-bold" style={{ color: '#5a7fa3' }}>Available Missions</h1>
          </div>
          
          {/* Clear Simulations Button */}
          <button
            onClick={clearSimulations}
            style={{
              fontSize: '0.7rem',
              padding: '0.5rem 1rem',
              background: 'rgba(255, 0, 64, 0.1)',
              border: '1px solid #ff0040',
              color: '#ff0040',
              cursor: 'pointer',
              fontFamily: 'Courier Prime, monospace'
            }}
          >
            🔄 RESET SIMULATIONS
          </button>
        </div>

        {/* Filter Tabs - TSUKI Style */}
        <div className="tab-navigation mb-8">
          <button
            className={`tab-button ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            UPCOMING
          </button>
          <button
            className={`tab-button ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            ACTIVE
          </button>
          <button
            className={`tab-button ${filter === 'ended' ? 'active' : ''}`}
            onClick={() => setFilter('ended')}
          >
            ENDED
          </button>
        </div>

        {/* Registration notice for upcoming missions */}
        {filter === 'upcoming' && (
          <div style={{
            fontSize: '0.75rem',
            color: '#fff',
            fontFamily: 'Courier Prime, monospace',
            letterSpacing: '0.05em',
            marginTop: '-1.5rem',
            marginBottom: '1.5rem',
            paddingLeft: '0.5rem',
            borderLeft: '2px solid #5a7fa3'
          }}>
            REGISTRATION CLOSES AT MISSION START
          </div>
        )}

        {/* Missions Grid */}
        <div className="missions-grid">
          {filteredMissions.map((mission) => (
            <MissionCard 
              key={mission.id} 
              mission={mission}
              onRegister={handleRegister}
            />
          ))}
        </div>

        {filteredMissions.length === 0 && (
          <div className="text-center py-12" style={{ color: '#5a7fa3' }}>
            No {filter} missions available.
          </div>
        )}
      </div>
    </div>
  )
}

export default MissionsList
