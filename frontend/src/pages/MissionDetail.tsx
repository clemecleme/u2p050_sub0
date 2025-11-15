import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import Timer from '../components/mission/Timer'
import { Mission } from '../types'
import { getMissionById } from '../utils/mockData'

const MissionDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { user, setUser } = useApp()
  const navigate = useNavigate()
  
  const [mission, setMission] = useState<Mission | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }

    if (!id) return

    const data = getMissionById(id)
    if (!data) {
      navigate('/missions')
      return
    }
    
    setMission(data)
    setLoading(false)
  }, [id, user, navigate])

  const isRegistered = user?.registeredMissions?.includes(id || '') || false

  const handleRegister = () => {
    if (!user || !id) return
    
    setUser({
      ...user,
      registeredMissions: [...(user.registeredMissions || []), id]
    })
  }

  if (loading || !mission) {
    return (
      <div className="landing-page">
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl" style={{ color: '#5a7fa3' }}>Loading mission...</div>
        </div>
      </div>
    )
  }

  const canAccess = mission.status === 'active' && isRegistered

  return (
    <div className="landing-page">
      {/* Back button - top left */}
      <Link
        to="/missions"
        className="fixed top-8 left-8 z-50"
        style={{
          color: '#5a7fa3',
          fontSize: '0.9rem',
          textDecoration: 'none',
          fontFamily: 'Courier Prime, monospace'
        }}
      >
        ← Back to Missions
      </Link>

      {/* Central mission detail window */}
      <div className="landing-window landing-window-center" style={{ maxWidth: '800px' }}>
        <div className="node-header">
          <button className="node-close-button" onClick={() => navigate('/missions')}>×</button>
          <div className="node-title">MISSION BRIEFING</div>
        </div>

        <div className="node-content" style={{ padding: '2.5rem 2rem' }}>
          {/* Mission Status Badge */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              color: '#fff', 
              fontWeight: 'bold',
              margin: 0,
              fontFamily: 'VT323, monospace'
            }}>
              {mission.title}
            </h1>
            <span style={{
              padding: '0.5rem 1rem',
              border: mission.status === 'active' ? '2px solid #00ff41' : 
                      mission.status === 'upcoming' ? '2px solid #5a7fa3' : 
                      '2px solid #808080',
              color: mission.status === 'active' ? '#00ff41' : 
                     mission.status === 'upcoming' ? '#5a7fa3' : 
                     '#808080',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontFamily: 'Courier Prime, monospace',
              letterSpacing: '0.1em'
            }}>
              {mission.status}
            </span>
          </div>

          {/* Description */}
          <p style={{ 
            color: '#b0b0b0', 
            fontSize: '1.1rem', 
            lineHeight: '1.8',
            marginBottom: '2rem'
          }}>
            {mission.description}
          </p>

          {/* Main Question */}
          {mission.mainQuestion && (
            <div style={{
              background: 'rgba(90, 127, 163, 0.1)',
              border: '1px solid #5a7fa3',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#5a7fa3', 
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                Investigation Question:
              </div>
              <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 'bold' }}>
                {mission.mainQuestion}
              </div>
            </div>
          )}

          {/* Mission Timeline */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div>
              <div style={{ 
                fontSize: '0.7rem', 
                color: '#808080', 
                marginBottom: '0.5rem',
                textTransform: 'uppercase'
              }}>
                Start Time
              </div>
              <div style={{ color: '#fff', fontFamily: 'Courier Prime, monospace' }}>
                {new Date(mission.startTime).toLocaleString('en-GB').replace(/\//g, '-')}
              </div>
            </div>
            <div>
              <div style={{ 
                fontSize: '0.7rem', 
                color: '#808080', 
                marginBottom: '0.5rem',
                textTransform: 'uppercase'
              }}>
                End Time
              </div>
              <div style={{ color: '#fff', fontFamily: 'Courier Prime, monospace' }}>
                {new Date(mission.endTime).toLocaleString('en-GB').replace(/\//g, '-')}
              </div>
            </div>
          </div>

          {/* Timer */}
          {mission.status === 'active' && (
            <div style={{ marginBottom: '2rem' }}>
              <Timer targetDate={mission.endTime} label="Time Remaining" />
            </div>
          )}

          {mission.status === 'upcoming' && (
            <div style={{ marginBottom: '2rem' }}>
              <Timer targetDate={mission.startTime} label="Starts In" />
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* UPCOMING - Not registered */}
            {mission.status === 'upcoming' && !isRegistered && (
              <>
                <button onClick={handleRegister} className="btn-primary" style={{ width: '100%' }}>
                  Register for Mission
                </button>
                <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#808080' }}>
                  Register now to access when mission starts
                </div>
              </>
            )}

            {/* UPCOMING - Registered */}
            {mission.status === 'upcoming' && isRegistered && (
              <div style={{
                padding: '1rem',
                background: 'rgba(0, 255, 65, 0.1)',
                border: '1px solid #00ff41',
                textAlign: 'center',
                color: '#00ff41'
              }}>
                ✓ Registered - Mission will unlock when it starts
              </div>
            )}

            {/* ACTIVE - Can access */}
            {canAccess && (
              <>
                <Link 
                  to={`/mission/${id}/board`} 
                  className="btn-primary" 
                  style={{ 
                    width: '100%',
                    textDecoration: 'none',
                    display: 'block',
                    textAlign: 'center'
                  }}
                >
                  🔍 Enter the Mission Board
                </Link>
                <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#808080' }}>
                  Access the investigation board to analyze evidence
                </div>
              </>
            )}

            {/* ACTIVE - Not registered */}
            {mission.status === 'active' && !isRegistered && (
              <div style={{
                padding: '1rem',
                background: 'rgba(255, 0, 64, 0.1)',
                border: '1px solid #ff0040',
                textAlign: 'center',
                color: '#ff0040'
              }}>
                Access Denied - You must have registered before the mission started
              </div>
            )}

            {/* ENDED */}
            {mission.status === 'ended' && (
              <div style={{
                padding: '1rem',
                background: 'rgba(128, 128, 128, 0.1)',
                border: '1px solid #808080',
                textAlign: 'center',
                color: '#808080'
              }}>
                Mission Ended - Results Available Soon
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MissionDetail
