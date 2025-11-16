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
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useApp } from '../contexts/AppContext'
import DocumentNode from '../components/board/DocumentNode'
import DocumentOverlay from '../components/board/DocumentOverlay'
import AnswerSubmission from '../components/board/AnswerSubmission'
import SagEdge from '../components/board/SagEdge'
import SagConnectionLine from '../components/board/SagConnectionLine'
import { DocumentNode as DocumentNodeType } from '../types'
import { getFullConspiracy } from '../services/arkiv'

const nodeTypes: NodeTypes = {
  email: DocumentNode,
  diary: DocumentNode,
  police_report: DocumentNode,
  badge: DocumentNode,
  badge_log: DocumentNode,
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
  // New Arkiv document types
  login_history: DocumentNode,
  server_log: DocumentNode,
  firewall_log: DocumentNode,
  network_log: DocumentNode,
  access_control: DocumentNode,
  vpn_log: DocumentNode,
  door_access_log: DocumentNode,
  it_inventory: DocumentNode,
  security_scan: DocumentNode,
  device_registry: DocumentNode,
  asset_database: DocumentNode,
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
  const [conspiracy, setConspiracy] = useState<any>(null)
  const [selectedDocument, setSelectedDocument] = useState<DocumentNodeType | null>(null)
  const [accessDenied, setAccessDenied] = useState(false)
  const [showSubmissionOverlay, setShowSubmissionOverlay] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      navigate('/')
      return
    }

    const loadConspiracy = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load conspiracy data from Arkiv
        const data = await getFullConspiracy(id)
        
        if (!data.metadata) {
          navigate('/conspiracies')
          return
        }

        // TODO: Re-enable access control later
        // For now, allow access without registration for development/testing

        setConspiracy(data.metadata)

        // Create nodes from documents
        const documentNodes: Node[] = data.documents.map((doc, index) => {
          // Create a grid-like layout with better spacing
          const gridSize = Math.ceil(Math.sqrt(data.documents.length + data.images.length))
          const row = Math.floor(index / gridSize)
          const col = index % gridSize
          
          // More organic distribution with increased randomness
          const baseX = col * 700 + (Math.random() - 0.5) * 300
          const baseY = row * 600 + (Math.random() - 0.5) * 250
          
          return {
            id: `node-${doc.document_id}`,
            type: doc.document_type,
            position: { x: baseX, y: baseY },
            data: {
              title: doc.document_id,
              content: doc.fields,
            },
          }
        })

        // Create nodes from images
        const imageNodes: Node[] = data.images.map((img, index) => {
          const totalDocs = data.documents.length
          const gridSize = Math.ceil(Math.sqrt(data.documents.length + data.images.length))
          const absoluteIndex = totalDocs + index
          const row = Math.floor(absoluteIndex / gridSize)
          const col = absoluteIndex % gridSize
          
          // More organic distribution with increased randomness
          const baseX = col * 700 + (Math.random() - 0.5) * 300
          const baseY = row * 600 + (Math.random() - 0.5) * 250
          
          // Convert image bytes to blob URL
          const blob = new Blob([img.imageData], { type: 'image/png' })
          const imageUrl = URL.createObjectURL(blob)
          
          return {
            id: `node-image-${img.image_id}`,
            type: 'image',
            position: { x: baseX, y: baseY },
            data: {
              title: img.image_id,
              content: {
                imageUrl,
                caption: `Image: ${img.image_id}`,
              },
            },
          }
        })

        setNodes([...documentNodes, ...imageNodes])
        setLoading(false)
      } catch (err) {
        console.error('Error loading conspiracy from Arkiv:', err)
        setError('Failed to load conspiracy data from Arkiv')
        setLoading(false)
      }
    }

    loadConspiracy()
  }, [id, navigate, setNodes])

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
            You must register for this conspiracy before it starts to gain access.
          </p>
          <button onClick={() => navigate('/conspiracies')} className="btn-primary">
            Back to Conspiracies
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-2xl text-white">Loading conspiracy from Arkiv...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-red-500 mb-4">{error}</div>
          <button onClick={() => navigate('/conspiracies')} className="btn-primary">
            Back to Conspiracies
          </button>
        </div>
      </div>
    )
  }

  if (!conspiracy) {
    return (
      <div className="h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-2xl text-white">Conspiracy not found</div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-dark-950 flex flex-col board-page">
      {/* Board Header */}
      <div className="board-header">
        <div className="board-header-left">
          <h1 className="board-title">{conspiracy.conspiracy_name}</h1>
          {conspiracy.premise && (
            <p className="board-question">{conspiracy.premise}</p>
          )}
          <div style={{ 
            fontSize: '0.75rem', 
            color: '#5a7fa3',
            marginTop: '0.25rem',
            fontFamily: 'Courier Prime, monospace'
          }}>
            🌍 {conspiracy.world} | Difficulty: {conspiracy.difficulty}/10 | Type: {conspiracy.conspiracy_type}
          </div>
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
