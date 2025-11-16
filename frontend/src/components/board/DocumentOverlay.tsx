import { DocumentNode as DocumentNodeType } from '../../types'

interface DocumentOverlayProps {
  document: DocumentNodeType | null
  onClose: () => void
}

const DocumentOverlay = ({ document, onClose }: DocumentOverlayProps) => {
  if (!document) return null

  const content = document.data.content || {}
  const nodeType = document.type

  // Get type display name
  const getTypeName = (t: string) => {
    const names: Record<string, string> = {
      email: 'EMAIL',
      diary: 'DIARY ENTRY',
      police_report: 'POLICE REPORT',
      badge: 'ID BADGE',
      badge_log: 'BADGE LOG',
      witness_statement: 'WITNESS STATEMENT',
      bank_statement: 'BANK STATEMENT',
      newspaper: 'NEWSPAPER',
      internal_memo: 'INTERNAL MEMO',
      phone_record: 'PHONE RECORD',
      receipt: 'RECEIPT',
      surveillance_log: 'SURVEILLANCE LOG',
      medical_record: 'MEDICAL RECORD',
      article: 'ARTICLE',
      terminal: 'TERMINAL',
      image: 'IMAGE',
      // New Arkiv types
      login_history: 'LOGIN HISTORY',
      server_log: 'SERVER LOG',
      firewall_log: 'FIREWALL LOG',
      network_log: 'NETWORK LOG',
      access_control: 'ACCESS CONTROL',
      vpn_log: 'VPN LOG',
      door_access_log: 'DOOR ACCESS LOG',
      it_inventory: 'IT INVENTORY',
      security_scan: 'SECURITY SCAN',
      device_registry: 'DEVICE REGISTRY',
      asset_database: 'ASSET DATABASE',
    }
    return names[t] || t.toUpperCase().replace(/_/g, ' ')
  }

  // Render content based on type
  const renderContent = () => {
    switch (nodeType) {
      case 'email':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">FROM:</span> {content.from || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">TO:</span> {Array.isArray(content.to) ? content.to.join(', ') : content.to || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">SUBJECT:</span> {content.subject || 'No Subject'}</div>
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.date || content.timestamp || content.emailDate || 'Unknown'}</div>
            {content.attachments && content.attachments.length > 0 && (
              <div className="terminal-line"><span className="terminal-label">ATTACHMENTS:</span> {content.attachments.join(', ')}</div>
            )}
            <div className="terminal-separator">---</div>
            <div className="terminal-body">{content.body || 'No content'}</div>
          </div>
        )
      
      case 'diary':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.date || content.diaryDate || 'Unknown'}</div>
            {content.author && <div className="terminal-line"><span className="terminal-label">AUTHOR:</span> {content.author}</div>}
            {content.mood && <div className="terminal-line"><span className="terminal-label">MOOD:</span> {content.mood}</div>}
            <div className="terminal-separator">---</div>
            <div className="terminal-body">{content.content || content.entry_text || content.diaryEntry || 'No entry'}</div>
          </div>
        )
      
      case 'police_report':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">CASE #:</span> {content.case_number || content.caseNumber || 'N/A'}</div>
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.report_date || content.reportDate || content.date || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">OFFICER:</span> {content.officer || content.officer_name || 'Unknown'}</div>
            {content.incident_location && <div className="terminal-line"><span className="terminal-label">LOCATION:</span> {content.incident_location}</div>}
            <div className="terminal-separator">---</div>
            <div className="terminal-body">{content.report || content.incident_description || content.reportSummary || 'No report'}</div>
            {content.witnesses && content.witnesses.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-label">WITNESSES:</div>
                {content.witnesses.map((w: any, i: number) => (
                  <div key={i} className="terminal-line-small">
                    • {w.name} {w.role && `(${w.role})`}
                    {w.statement && <div className="terminal-line-small">  "{w.statement}"</div>}
                  </div>
                ))}
              </>
            )}
            {content.evidence_noted && content.evidence_noted.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-label">EVIDENCE:</div>
                {content.evidence_noted.map((e: string, i: number) => (
                  <div key={i} className="terminal-line-small">• {e}</div>
                ))}
              </>
            )}
          </div>
        )
      
      case 'badge':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">BADGE ID:</span> {content.badgeId || 'N/A'}</div>
            <div className="terminal-line"><span className="terminal-label">NAME:</span> {content.employeeName || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">DEPARTMENT:</span> {content.department || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">POSITION:</span> {content.position || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">ISSUED:</span> {content.issueDate || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">EXPIRES:</span> {content.expiryDate || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">ACCESS LEVEL:</span> {content.accessLevel || 'N/A'}</div>
          </div>
        )
      
      case 'badge_log':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">FACILITY:</span> {content.facility || content.facility_name || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.log_date || content.log_period || 'Unknown'}</div>
            {content.system_version && <div className="terminal-line"><span className="terminal-label">SYSTEM:</span> {content.system_version}</div>}
            <div className="terminal-line"><span className="terminal-label">ENTRIES:</span> {content.entries?.length || 0}</div>
            {content.entries && content.entries.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  TIMESTAMP           | BADGE  | USER              | LOCATION        | STATUS
                </div>
                {content.entries.map((entry: any, i: number) => {
                  const timestamp = (entry.timestamp || entry.entry_time || '??:??:??').padEnd(19)
                  const badge = (entry.badge_id || entry.badge_number || '?').toString().padEnd(6)
                  const user = (entry.user || entry.name || '?').substring(0, 17).padEnd(17)
                  const location = (entry.location || '?').substring(0, 15).padEnd(15)
                  const status = entry.status || '?'
                  return (
                    <div key={i} className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {timestamp} | {badge} | {user} | {location} | {status}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )
      
      case 'witness_statement':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">WITNESS:</span> {content.witness_name || content.witnessName || 'Anonymous'}</div>
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.statement_date || content.statementDate || content.date || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">INTERVIEWER:</span> {content.interviewer || content.interviewedBy || 'Unknown'}</div>
            {content.location && <div className="terminal-line"><span className="terminal-label">LOCATION:</span> {content.location}</div>}
            <div className="terminal-separator">---</div>
            <div className="terminal-body">{content.statement || content.statement_text || content.statementText || 'No statement'}</div>
            {content.details && content.details.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-label">Q&A:</div>
                {content.details.map((detail: any, i: number) => (
                  <div key={i} className="terminal-log-entry">
                    <div className="terminal-line-small"><strong>Q:</strong> {detail.question}</div>
                    <div className="terminal-line-small"><strong>A:</strong> {typeof detail.answer === 'string' ? detail.answer : JSON.stringify(detail.answer)}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        )
      
      case 'bank_statement':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">ACCOUNT:</span> {content.account_number || content.accountNumber || 'N/A'}</div>
            <div className="terminal-line"><span className="terminal-label">HOLDER:</span> {content.account_holder || content.accountHolder || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">PERIOD:</span> {content.period || content.statementPeriod || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">OPENING:</span> ${content.opening_balance || content.openingBalance || 'N/A'}</div>
            <div className="terminal-line"><span className="terminal-label">CLOSING:</span> ${content.closing_balance || content.closingBalance || 'N/A'}</div>
            {content.transactions && content.transactions.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-label">TRANSACTIONS:</div>
                {content.transactions.map((t: any, i: number) => (
                  <div key={i} className="terminal-line-small">
                    {t.date}: {t.description} - ${t.amount} (Balance: ${t.balance})
                  </div>
                ))}
              </>
            )}
          </div>
        )
      
      case 'internal_memo':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">TO:</span> {Array.isArray(content.to) ? content.to.join(', ') : content.to || content.memoTo || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">FROM:</span> {content.from || content.memoFrom || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.date || content.memoDate || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">SUBJECT:</span> {content.subject || content.memoSubject || 'No Subject'}</div>
            {(content.classification || content.confidential) && <div className="terminal-alert">[{content.classification || 'CONFIDENTIAL'}]</div>}
            <div className="terminal-separator">---</div>
            <div className="terminal-body">{content.content || content.memoBody || 'No content'}</div>
          </div>
        )
      
      case 'surveillance_log':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">LOCATION:</span> {content.location || content.surveillanceLocation || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.date || content.surveillanceDate || content.log_date || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">OPERATOR:</span> {content.operator || 'Unknown'}</div>
            {(content.entries || content.logEntries) && (content.entries || content.logEntries).length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-label">LOG ENTRIES:</div>
                {(content.entries || content.logEntries).map((entry: any, i: number) => (
                  <div key={i} className="terminal-log-entry">
                    <div className="terminal-line-small">[{entry.time}] {entry.observation || entry.activity}</div>
                    {(entry.action_taken || entry.notes) && (
                      <div className="terminal-line-small">  └─ Action: {entry.action_taken || entry.notes}</div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )
      
      case 'receipt':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">MERCHANT:</span> {content.merchant || content.storeName || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.date || content.receiptDate || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">TIME:</span> {content.time || content.receiptTime || 'Unknown'}</div>
            {content.transaction_id && <div className="terminal-line"><span className="terminal-label">TXN ID:</span> {content.transaction_id || content.receiptNumber}</div>}
            {content.items && content.items.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-label">ITEMS:</div>
                {content.items.map((item: any, i: number) => (
                  <div key={i} className="terminal-line-small">
                    {item.item || item.name} x{item.quantity} - ${item.price}
                  </div>
                ))}
                <div className="terminal-separator">---</div>
                <div className="terminal-line"><span className="terminal-label">TOTAL:</span> ${content.total || content.totalAmount || 'N/A'}</div>
                {content.payment_method && <div className="terminal-line-small">Payment: {content.payment_method}</div>}
              </>
            )}
          </div>
        )

      case 'phone_record':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.record_date || content.callDate || 'Unknown'}</div>
            {(content.calls || content.callRecords) && (content.calls || content.callRecords).length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-label">CALL HISTORY:</div>
                {(content.calls || content.callRecords).map((call: any, i: number) => (
                  <div key={i} className="terminal-log-entry">
                    <div className="terminal-line-small">[{call.timestamp || call.time}]</div>
                    <div className="terminal-line-small">  From: {call.caller || 'Unknown'}</div>
                    <div className="terminal-line-small">  To: {call.recipient || call.number || 'Unknown'}</div>
                    <div className="terminal-line-small">  Duration: {call.duration}</div>
                    <div className="terminal-line-small">  Type: {call.call_type || call.type}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        )

      case 'article':
      case 'newspaper':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-headline">{content.heading || content.headline || document.data.title}</div>
            {content.subheadline && <div className="terminal-subheadline">{content.subheadline}</div>}
            {(content.source || content.newspaperName) && <div className="terminal-line"><span className="terminal-label">SOURCE:</span> {content.source || content.newspaperName}</div>}
            {content.date && <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.date}</div>}
            <div className="terminal-separator">---</div>
            <div className="terminal-body">{content.previewText || content.articleText || content.mainArticle || 'No content'}</div>
          </div>
        )
      
      case 'medical_record':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">PATIENT:</span> {content.patientName || 'REDACTED'}</div>
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.medicalDate || content.date || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">DOCTOR:</span> {content.doctorName || 'Unknown'}</div>
            <div className="terminal-separator">---</div>
            <div className="terminal-body">{content.diagnosis || content.notes || 'No information'}</div>
          </div>
        )
      
      case 'image':
        return (
          <div className="terminal-doc-content">
            {content.imageUrl && (
              <img src={content.imageUrl} alt={content.caption || document.data.title} className="terminal-image" style={{ maxWidth: '100%', height: 'auto' }} />
            )}
            {content.caption && <div className="terminal-caption" style={{ marginTop: '1rem' }}>{content.caption}</div>}
          </div>
        )
      
      // === NEW ARKIV DOCUMENT TYPES ===
      
      case 'login_history':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">SYSTEM:</span> {content.system || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">PERIOD START:</span> {content.log_period_start || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">PERIOD END:</span> {content.log_period_end || 'Unknown'}</div>
            {content.authentication_events && content.authentication_events.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-label">AUTHENTICATION EVENTS:</div>
                {content.authentication_events.map((event: any, i: number) => (
                  <div key={i} className="terminal-log-entry">
                    <div className="terminal-line-small">[{event.timestamp}]</div>
                    <div className="terminal-line-small">  User: {event.username} (ID: {event.user_id})</div>
                    <div className="terminal-line-small">  Event: {event.event}</div>
                    <div className="terminal-line-small">  Status: {event.status}</div>
                    <div className="terminal-line-small">  IP: {event.ip_address}</div>
                    <div className="terminal-line-small">  Device: {event.device}</div>
                    {event.notes && <div className="terminal-line-small">  Notes: {event.notes}</div>}
                  </div>
                ))}
              </>
            )}
          </div>
        )
      
      case 'server_log':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">SERVER:</span> {content.server_name || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.log_date || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">LOG LEVEL:</span> {content.log_level || 'INFO'}</div>
            {content.entries && content.entries.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-label">LOG ENTRIES:</div>
                {content.entries.map((entry: any, i: number) => (
                  <div key={i} className="terminal-log-entry">
                    <div className="terminal-line-small">[{entry.timestamp}] [{entry.level}] {entry.service}</div>
                    <div className="terminal-line-small">  {entry.message}</div>
                    {entry.details && <div className="terminal-line-small">  Details: {entry.details}</div>}
                  </div>
                ))}
              </>
            )}
          </div>
        )
      
      case 'firewall_log':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">FIREWALL ID:</span> {content.firewall_id || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.log_date || 'Unknown'}</div>
            {content.entries && content.entries.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-label">FIREWALL EVENTS:</div>
                {content.entries.map((entry: any, i: number) => (
                  <div key={i} className="terminal-log-entry">
                    <div className="terminal-line-small">[{entry.timestamp}]</div>
                    <div className="terminal-line-small">  Source: {entry.source_ip}:{entry.source_port}</div>
                    <div className="terminal-line-small">  Dest: {entry.dest_ip}:{entry.dest_port}</div>
                    <div className="terminal-line-small">  Protocol: {entry.protocol}</div>
                    <div className="terminal-line-small">  Action: {entry.action}</div>
                    <div className="terminal-line-small">  Rule: {entry.rule}</div>
                    {entry.bytes && <div className="terminal-line-small">  Bytes: {entry.bytes}</div>}
                  </div>
                ))}
              </>
            )}
          </div>
        )
      
      case 'network_log':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">NETWORK SEGMENT:</span> {content.network_segment || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.log_date || 'Unknown'}</div>
            {content.entries && content.entries.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-label">NETWORK ACTIVITY:</div>
                {content.entries.map((entry: any, i: number) => (
                  <div key={i} className="terminal-log-entry">
                    <div className="terminal-line-small">[{entry.timestamp}]</div>
                    <div className="terminal-line-small">  {entry.source} → {entry.destination}</div>
                    <div className="terminal-line-small">  Protocol: {entry.protocol}</div>
                    <div className="terminal-line-small">  Sent: {entry.bytes_sent} | Received: {entry.bytes_received}</div>
                    <div className="terminal-line-small">  Status: {entry.status}</div>
                    <div className="terminal-line-small">  Connection ID: {entry.connection_id}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        )
      
      case 'access_control':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">FACILITY:</span> {content.facility || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.log_date || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">SYSTEM VERSION:</span> {content.system_version || 'Unknown'}</div>
            {content.entries && content.entries.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-label">ACCESS CONTROL EVENTS:</div>
                {content.entries.map((entry: any, i: number) => (
                  <div key={i} className="terminal-log-entry">
                    <div className="terminal-line-small">[{entry.timestamp}] {entry.event_type}</div>
                    <div className="terminal-line-small">  User: {entry.user} (Badge: {entry.badge_id})</div>
                    <div className="terminal-line-small">  Clearance Level: {entry.clearance_level}</div>
                    <div className="terminal-line-small">  Zone: {entry.zone} | Door: {entry.door}</div>
                    <div className="terminal-line-small">  Result: {entry.result}</div>
                    {entry.notes && <div className="terminal-line-small">  Notes: {entry.notes}</div>}
                  </div>
                ))}
              </>
            )}
          </div>
        )
      
      case 'vpn_log':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">VPN GATEWAY:</span> {content.vpn_gateway || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.log_date || 'Unknown'}</div>
            {content.entries && content.entries.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-label">VPN EVENTS:</div>
                {content.entries.map((entry: any, i: number) => (
                  <div key={i} className="terminal-log-entry">
                    <div className="terminal-line-small">[{entry.timestamp}] {entry.event}</div>
                    <div className="terminal-line-small">  User: {entry.user_id}</div>
                    <div className="terminal-line-small">  Client IP: {entry.client_ip}</div>
                    <div className="terminal-line-small">  Server IP: {entry.server_ip}</div>
                    <div className="terminal-line-small">  Protocol: {entry.protocol}</div>
                    <div className="terminal-line-small">  Encryption: {entry.encryption}</div>
                    {entry.bytes_transferred && <div className="terminal-line-small">  Bytes: {entry.bytes_transferred}</div>}
                    {entry.duration && <div className="terminal-line-small">  Duration: {entry.duration}s</div>}
                  </div>
                ))}
              </>
            )}
          </div>
        )
      
      case 'door_access_log':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">FACILITY:</span> {content.facility || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.log_date || 'Unknown'}</div>
            {content.entries && content.entries.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-label">DOOR ACCESS EVENTS:</div>
                {content.entries.map((entry: any, i: number) => (
                  <div key={i} className="terminal-log-entry">
                    <div className="terminal-line-small">[{entry.timestamp}]</div>
                    <div className="terminal-line-small">  Door: {entry.door_id}</div>
                    <div className="terminal-line-small">  Badge: {entry.badge_id}</div>
                    <div className="terminal-line-small">  User: {entry.user}</div>
                    <div className="terminal-line-small">  Action: {entry.action}</div>
                    {entry.duration_open && <div className="terminal-line-small">  Duration Open: {entry.duration_open}</div>}
                    {entry.sensor_status && <div className="terminal-line-small">  Sensor: {entry.sensor_status}</div>}
                  </div>
                ))}
              </>
            )}
          </div>
        )
      
      case 'it_inventory':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">DEPARTMENT:</span> {content.department || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">INVENTORY DATE:</span> {content.inventory_date || 'Unknown'}</div>
            {content.items && content.items.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-label">INVENTORY ITEMS:</div>
                {content.items.map((item: any, i: number) => (
                  <div key={i} className="terminal-log-entry">
                    <div className="terminal-line-small">Asset ID: {item.asset_id}</div>
                    <div className="terminal-line-small">  Type: {item.device_type}</div>
                    <div className="terminal-line-small">  Assigned To: {item.assigned_to}</div>
                    <div className="terminal-line-small">  Location: {item.location}</div>
                    <div className="terminal-line-small">  Serial: {item.serial_number}</div>
                    <div className="terminal-line-small">  Status: {item.status}</div>
                    {item.notes && <div className="terminal-line-small">  Notes: {item.notes}</div>}
                  </div>
                ))}
              </>
            )}
          </div>
        )
      
      case 'security_scan':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">SCAN ID:</span> {content.scan_id || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">SCAN DATE:</span> {content.scan_date || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">SCAN TYPE:</span> {content.scan_type || 'Unknown'}</div>
            {content.results && content.results.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-label">SCAN RESULTS:</div>
                {content.results.map((result: any, i: number) => (
                  <div key={i} className="terminal-log-entry">
                    <div className="terminal-line-small">[{result.timestamp}] [{result.severity}]</div>
                    <div className="terminal-line-small">  Target: {result.target}</div>
                    <div className="terminal-line-small">  Finding: {result.finding}</div>
                    <div className="terminal-line-small">  Description: {result.description}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        )
      
      case 'device_registry':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">REGISTRY DATE:</span> {content.registry_date || 'Unknown'}</div>
            {content.devices && content.devices.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-label">REGISTERED DEVICES:</div>
                {content.devices.map((device: any, i: number) => (
                  <div key={i} className="terminal-log-entry">
                    <div className="terminal-line-small">Device ID: {device.device_id}</div>
                    <div className="terminal-line-small">  Name: {device.device_name}</div>
                    <div className="terminal-line-small">  Type: {device.device_type}</div>
                    <div className="terminal-line-small">  MAC: {device.mac_address}</div>
                    <div className="terminal-line-small">  IP: {device.ip_address}</div>
                    <div className="terminal-line-small">  Owner: {device.owner}</div>
                    <div className="terminal-line-small">  Location: {device.location}</div>
                    <div className="terminal-line-small">  Last Seen: {device.last_seen}</div>
                    <div className="terminal-line-small">  Status: {device.status}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        )
      
      case 'asset_database':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">DATABASE:</span> {content.database || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">QUERY DATE:</span> {content.query_date || 'Unknown'}</div>
            {content.records && content.records.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-label">ASSET RECORDS:</div>
                {content.records.map((record: any, i: number) => (
                  <div key={i} className="terminal-log-entry">
                    <div className="terminal-line-small">Asset ID: {record.asset_id}</div>
                    <div className="terminal-line-small">  Type: {record.asset_type}</div>
                    <div className="terminal-line-small">  Owner: {record.owner}</div>
                    <div className="terminal-line-small">  Location: {record.location}</div>
                    {record.value && <div className="terminal-line-small">  Value: ${record.value}</div>}
                    <div className="terminal-line-small">  Status: {record.status}</div>
                    <div className="terminal-line-small">  Acquired: {record.acquisition_date}</div>
                    {record.notes && <div className="terminal-line-small">  Notes: {record.notes}</div>}
                  </div>
                ))}
              </>
            )}
          </div>
        )
      
      default:
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line">
              <span className="terminal-prompt">$</span>
              <span className="terminal-text">{content.terminalText || document.data.title}</span>
              <span className="terminal-cursor">_</span>
            </div>
          </div>
        )
    }
  }

  return (
    <>
      {/* Backdrop blur layer */}
      <div 
        className="document-overlay-backdrop"
        onClick={onClose}
      />
      
      {/* Overlay window */}
      <div className="document-overlay-container">
        <div 
          className="landing-window overlay-window"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="node-header">
            <button className="node-close-button" onClick={onClose}>×</button>
            <div className="node-title">
              {getTypeName(nodeType)} - {document.data.title}
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="node-content overlay-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  )
}

export default DocumentOverlay
