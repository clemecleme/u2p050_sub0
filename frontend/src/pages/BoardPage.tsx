import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  NodeTypes,
  EdgeTypes,
  Connection,
  ReactFlowInstance,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useApp } from '../contexts/AppContext'
import DocumentNode from '../components/board/DocumentNode'
import DocumentOverlay from '../components/board/DocumentOverlay'
import AnswerSubmission from '../components/board/AnswerSubmission'
import SagEdge from '../components/board/SagEdge'
import SagConnectionLine from '../components/board/SagConnectionLine'
import { Document, DocumentNode as DocumentNodeType } from '../types'
import { getMissionById, getDocumentsForMission } from '../utils/mockData'

const nodeTypes: NodeTypes = {
  email: DocumentNode,
  diary: DocumentNode,
  police_report: DocumentNode,
  badge: DocumentNode,
  witness_statement: DocumentNode,
  bank_statement: DocumentNode,
  newspaper: DocumentNode,
  internal_memo: DocumentNode,
  phone_record: DocumentNode,
  receipt: DocumentNode,
  surveillance_log: DocumentNode,
  medical_record: DocumentNode,
  article: DocumentNode,
  terminal: DocumentNode,
  image: DocumentNode,
}

const edgeTypes: EdgeTypes = {
  sag: SagEdge,
}

const BoardPage = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useApp()
  const navigate = useNavigate()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [mission, setMission] = useState<any>(null)
  const [selectedDocument, setSelectedDocument] = useState<DocumentNodeType | null>(null)
  const [accessDenied, setAccessDenied] = useState(false)
  const [showSubmissionOverlay, setShowSubmissionOverlay] = useState(false)

  useEffect(() => {
    if (!user || !id) {
      navigate('/')
      return
    }

    // Load mission and check access
    const missionData = getMissionById(id)
    if (!missionData) {
      navigate('/missions')
      return
    }

    // Check if mission is active and user is not registered
    const isActive = missionData.status === 'active'
    const isRegistered = user.registeredMissions?.includes(id)
    
    // Check simulated registration from localStorage
    const simulatedRegistration = localStorage.getItem(`simulated-registration-${id}`) === 'true'
    
    if (isActive && !isRegistered && !simulatedRegistration) {
      setAccessDenied(true)
      return
    }

    setMission(missionData)

    // Load documents
    const docs = getDocumentsForMission(id)
    setDocuments(docs)

    // Automatically place all documents on the board with random positions
    const initialNodes: Node[] = docs.map((doc, index) => {
      // Create a grid-like layout with some randomness
      const gridSize = Math.ceil(Math.sqrt(docs.length))
      const row = Math.floor(index / gridSize)
      const col = index % gridSize
      
      // Add randomness to positions
      const baseX = col * 400 + Math.random() * 100
      const baseY = row * 300 + Math.random() * 100
      
      return {
        id: `node-${doc.id}`,
        type: doc.type,
        position: { x: baseX, y: baseY },
        data: {
          title: doc.name,
          content: doc.content,
        },
      }
    })

    setNodes(initialNodes)
  }, [id, user, navigate, setNodes])

  // Handle node double click to open overlay
  const onNodeDoubleClick = useCallback((_event: React.MouseEvent, node: Node) => {
    const doc: DocumentNodeType = {
      id: node.id,
      type: node.type as any,
      position: node.position,
      data: node.data as any,
    }
    setSelectedDocument(doc)
  }, [])

  // Handle edge creation
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => {
        const newEdge: Edge = {
          id: `edge-${connection.source}-${connection.target}`,
          source: connection.source!,
          target: connection.target!,
          type: 'sag',
        }
        return eds.concat(newEdge)
      })
    },
    [setEdges]
  )

  // Handle edge deletion (right-click)
  const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.preventDefault()
    if (window.confirm('Delete this connection?')) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id))
    }
  }, [setEdges])

  if (accessDenied) {
    return (
      <div className="h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">
            You must register for this mission before it starts to gain access.
          </p>
          <button onClick={() => navigate('/missions')} className="btn-primary">
            Back to Missions
          </button>
        </div>
      </div>
    )
  }

  if (!mission) {
    return (
      <div className="h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-2xl text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-dark-950 flex flex-col board-page">
      {/* Board Header */}
      <div className="board-header">
        <div className="board-header-left">
          <h1 className="board-title">{mission.title}</h1>
          {mission.mainQuestion && (
            <p className="board-question">{mission.mainQuestion}</p>
          )}
        </div>

        <button className="btn-primary" onClick={() => setShowSubmissionOverlay(true)}>
          Submit Answer
        </button>
      </div>

      {/* React Flow Board */}
      <div ref={reactFlowWrapper} className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDoubleClick={onNodeDoubleClick}
          onConnect={onConnect}
          onEdgeContextMenu={onEdgeContextMenu}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineComponent={SagConnectionLine}
          fitView
          deleteKeyCode={null}
          connectionMode="loose"
          minZoom={0.1}
          maxZoom={2}
        >
          <Background color="#374151" gap={16} />
          <Controls />
          <MiniMap 
            style={{ 
              width: '120px', 
              height: '80px' 
            }}
            nodeColor="var(--board-accent)"
            maskColor="rgba(0, 0, 0, 0.6)"
          />
        </ReactFlow>
      </div>

      {/* Document Overlay */}
      <DocumentOverlay
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />

      {/* Answer Submission Overlay */}
      <AnswerSubmission
        missionId={id!}
        isOpen={showSubmissionOverlay}
        onClose={() => setShowSubmissionOverlay(false)}
      />
    </div>
  )
}

export default BoardPage
