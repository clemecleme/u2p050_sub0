// User interface
export interface User {
  address: string
  registeredConspiracies: string[]
}

// Conspiracy interface (formerly Mission) - Matches Arkiv structure
export interface Conspiracy {
  mystery_id: string
  conspiracy_name: string
  world: string
  difficulty: number
  conspiracy_type: string
  total_documents: number
  premise: string
  created_at: string
  environment?: string
  status: 'upcoming' | 'active' | 'ended'
  image?: string
}

// Legacy Mission type for backward compatibility during transition
export type Mission = Conspiracy

// Document types - All Arkiv document types
export type DocumentType = 
  // Communication documents
  | 'email'
  | 'internal_memo'
  | 'witness_statement'
  | 'diary'
  // Law enforcement
  | 'police_report'
  // Technical logs
  | 'badge_log'
  | 'login_history'
  | 'server_log'
  | 'firewall_log'
  | 'network_log'
  | 'access_control'
  | 'vpn_log'
  | 'door_access_log'
  | 'surveillance_log'
  // IT & Assets
  | 'it_inventory'
  | 'security_scan'
  | 'device_registry'
  | 'asset_database'
  // Financial
  | 'bank_statement'
  | 'receipt'
  // Telecommunications
  | 'phone_record'
  // Media
  | 'newspaper'
  | 'article'
  | 'image'
  // Legacy types
  | 'badge'
  | 'medical_record'
  | 'terminal'

export type DocumentState = 'unopened' | 'onBoard'

// Cipher info structure (for encrypted documents)
export interface CipherInfo {
  encrypted: boolean
  cipher_type: 'vigenere' | 'caesar' | string
  encrypted_sections?: string[]
  hint?: string
  key_hint?: string
  key_location?: string
}

// Document content interface - Matches Arkiv's structure exactly
export interface DocumentContent {
  // Common fields
  document_id?: string
  document_type?: string
  
  // EMAIL fields (Arkiv structure)
  from?: string
  to?: string | string[]
  subject?: string
  body?: string
  date?: string
  timestamp?: string
  attachments?: string[]
  
  // INTERNAL_MEMO fields (Arkiv structure - pure narrative)
  content?: string
  classification?: string
  cipher_info?: CipherInfo
  
  // DIARY fields (Arkiv structure - pure narrative)
  author?: string
  mood?: string
  entry_text?: string
  
  // WITNESS_STATEMENT fields
  witness_name?: string
  statement_date?: string
  interviewer?: string
  location?: string
  statement?: string
  statement_text?: string
  details?: Array<{
    question: string
    answer: string | any[]
  }>
  
  // POLICE_REPORT fields
  case_number?: string
  officer?: string
  officer_name?: string
  report_date?: string
  incident_date?: string
  incident_location?: string
  incident_description?: string
  report?: string
  evidence_noted?: string[]
  witnesses?: Array<{
    name: string
    role?: string
    statement?: string
    statement_summary?: string
  }>
  evidence_list?: Array<{
    evidence_id: string
    type: string
    description: string
  }>
  status?: string
  has_red_herring?: boolean
  red_herring_type?: string
  
  // BADGE_LOG fields
  facility?: string
  facility_name?: string
  log_date?: string
  log_period?: string
  system_version?: string
  entries?: Array<{
    timestamp?: string
    badge_id?: string
    badge_number?: string
    user?: string
    name?: string
    location?: string
    entry_time?: string
    event?: string
    status?: string
    [key: string]: any
  }>
  
  // LOGIN_HISTORY fields
  system?: string
  log_period_start?: string
  log_period_end?: string
  authentication_events?: Array<{
    timestamp: string
    user_id: string
    username: string
    ip_address: string
    device: string
    event: string
    status: string
    notes?: string
  }>
  
  // SERVER_LOG fields
  server_name?: string
  log_level?: string
  
  // FIREWALL_LOG fields
  firewall_id?: string
  
  // NETWORK_LOG fields
  network_segment?: string
  
  // ACCESS_CONTROL fields
  clearance_level?: string
  zone?: string
  door?: string
  result?: string
  system_events?: Array<{
    timestamp: string
    event: string
  }>
  
  // VPN_LOG fields
  vpn_gateway?: string
  
  // DOOR_ACCESS_LOG fields
  
  // IT_INVENTORY fields
  department?: string
  inventory_date?: string
  items?: Array<{
    asset_id: string
    device_type: string
    assigned_to: string
    location: string
    serial_number: string
    status: string
    notes?: string
  }>
  
  // SECURITY_SCAN fields
  scan_id?: string
  scan_date?: string
  scan_type?: string
  results?: Array<{
    timestamp: string
    target: string
    finding: string
    severity: string
    description: string
  }>
  
  // DEVICE_REGISTRY fields
  registry_date?: string
  devices?: Array<{
    device_id: string
    device_name: string
    device_type: string
    mac_address: string
    ip_address: string
    owner: string
    location: string
    last_seen: string
    status: string
  }>
  
  // ASSET_DATABASE fields
  database?: string
  query_date?: string
  records?: Array<{
    asset_id: string
    asset_type: string
    owner: string
    location: string
    value?: string | number
    status: string
    acquisition_date: string
    notes?: string
  }>
  
  // SURVEILLANCE_LOG fields
  operator?: string
  surveillanceDate?: string
  surveillanceLocation?: string
  logEntries?: Array<{
    time: string
    camera_id?: string
    observation: string
    action_taken: string
    activity?: string
    notes?: string
  }>
  
  // BANK_STATEMENT fields
  account_holder?: string
  account_number?: string
  period?: string
  opening_balance?: number
  closing_balance?: number
  transactions?: Array<{
    date: string
    description: string
    amount: number
    balance: number
  }>
  
  // RECEIPT fields
  merchant?: string
  time?: string
  transaction_id?: string
  total?: number
  payment_method?: string
  
  // PHONE_RECORD fields
  record_date?: string
  calls?: Array<{
    timestamp: string
    caller: string
    recipient: string
    duration: string | number
    call_type: string
    notes?: string
  }>
  
  // Legacy/additional fields for backward compatibility
  title?: string
  description?: string
  
  // NEWSPAPER/ARTICLE fields
  newspaperName?: string
  volume?: string
  issue?: string
  price?: string
  headline?: string
  heading?: string
  subheadline?: string
  mainArticle?: string
  articleText?: string
  photoUrl?: string
  photoCaption?: string
  source?: string
  previewText?: string
  
  // Old phone record fields
  phoneNumber?: string
  callDuration?: string
  callDate?: string
  callTime?: string
  callType?: string
  callRecords?: Array<{
    time: string
    number: string
    duration: string
    type: string
  }>
  
  // MEDICAL_RECORD fields (legacy)
  patientName?: string
  medicalDate?: string
  doctorName?: string
  diagnosis?: string
  notes?: string
  
  // Old article fields
  articleImage?: string
  
  // TERMINAL fields (legacy)
  terminalText?: string
  
  // IMAGE fields
  imageUrl?: string
  caption?: string
  
  // Old badge fields
  badgeId?: string
  employeeName?: string
  position?: string
  issueDate?: string
  expiryDate?: string
  accessLevel?: string
  
  // Old memo fields
  memoTo?: string
  memoFrom?: string
  memoDate?: string
  memoSubject?: string
  memoBody?: string
  priority?: string
  confidential?: boolean
  
  // Old diary fields
  diaryDate?: string
  diaryEntry?: string
  
  // Old police report fields
  caseNumber?: string
  reportDate?: string
  reportTime?: string
  badge?: string
  incidentType?: string
  reportSummary?: string
  
  // Old bank statement fields
  statementPeriod?: string
  
  // Old receipt fields
  storeName?: string
  storeAddress?: string
  receiptNumber?: string
  receiptDate?: string
  receiptTime?: string
  totalAmount?: string
  
  // Old witness statement fields
  witnessAddress?: string
  statementTime?: string
  interviewedBy?: string
  signed?: boolean
  
  // Old email fields
  emailDate?: string
  emailTime?: string
}

// Document in sidebar
export interface Document {
  id: string
  name: string
  type: DocumentType
  icon: string
  state: DocumentState
  content: DocumentContent
}

// Document node on the board (React Flow node)
export interface DocumentNode {
  id: string
  type: DocumentType
  position: { x: number; y: number }
  data: {
    title: string
    content: DocumentContent
  }
}

// Document edge (connection between nodes)
export interface DocumentEdge {
  id: string
  source: string
  target: string
  type?: string
}
