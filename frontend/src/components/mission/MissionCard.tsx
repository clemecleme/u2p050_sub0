import { Link } from 'react-router-dom'
import { Mission } from '../../types'
import { useApp } from '../../contexts/AppContext'

interface MissionCardProps {
  mission: Mission
  onRegister?: (missionId: string) => void
}

const MissionCard = ({ mission, onRegister }: MissionCardProps) => {
  const { user } = useApp()
  
  const isRegistered = user?.registeredMissions?.includes(mission.id) || false
  const canRegister = mission.status === 'upcoming' && !isRegistered
  const canAccess = mission.status === 'active' && isRegistered

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-GB').replace(/\//g, '-')
  }

  // For upcoming missions, hide title and description until registered
  const displayTitle = mission.status === 'upcoming' && !isRegistered 
    ? '█████████ ████████' 
    : mission.title

  const displayDescription = mission.status === 'upcoming' && !isRegistered
    ? 'Register to unlock mission details'
    : mission.status === 'upcoming' && isRegistered
    ? 'Mission details will be revealed when it starts'
    : mission.description

  return (
    <div className="landing-window mission-card-window">
      {/* Node header */}
      <div className="node-header">
        <button className="node-close-button" onClick={(e) => e.preventDefault()}>×</button>
        <div className="node-title">{mission.status.toUpperCase()}</div>
        {isRegistered && mission.status === 'active' && (
          <div className="mission-registered">✓</div>
        )}
      </div>

      {/* Node content */}
      <div className="node-content">
        <h3 className="text-xl font-bold mb-3" style={{ color: '#fff' }}>{displayTitle}</h3>
        <p className="text-sm mb-4" style={{ color: '#b0b0b0', lineHeight: '1.5' }}>{displayDescription}</p>

        <div className="space-y-1 mb-4 text-xs" style={{ color: '#808080' }}>
          <div>Start: {formatDate(mission.startTime)}</div>
          <div>End: {formatDate(mission.endTime)}</div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {canRegister && (
            <button
              onClick={() => onRegister?.(mission.id)}
              className="mission-btn mission-btn-primary"
            >
              Register
            </button>
          )}

          {isRegistered && mission.status === 'upcoming' && (
            <div className="text-center text-sm" style={{ color: '#5a7fa3' }}>
              Registered
            </div>
          )}

          {canAccess && (
            <Link to={`/mission/${mission.id}`} className="mission-btn mission-btn-primary">
              See Mission Details
            </Link>
          )}

          {mission.status === 'ended' && (
            <Link to={`/mission/${mission.id}/results`} className="mission-btn mission-btn-secondary">
              View Results
            </Link>
          )}

          {!isRegistered && mission.status === 'active' && (
            <div className="text-center text-sm" style={{ color: '#ff0040' }}>
              Registration closed
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MissionCard
