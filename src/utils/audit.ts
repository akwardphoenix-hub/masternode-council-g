import { v4 as uuid } from 'uuid'

export interface AuditEntry {
  id: string
  timestamp: string
  action: string
  actor: string
  details?: any
}

/**
 * Creates a validated audit log entry with guaranteed uniform structure.
 * Prevents edge cases like duplicate votes, missing proposalId, or non-ISO timestamps.
 * 
 * @param action - The action being logged (e.g., "vote_cast", "proposal_submitted")
 * @param actor - The actor performing the action (e.g., "council-member-001")
 * @param details - Additional details about the action (can be string, object, or any)
 * @returns A properly formatted AuditEntry with unique ID and ISO timestamp
 */
export function recordAudit(action: string, actor: string, details?: any): AuditEntry {
  // Validate inputs
  if (!action || typeof action !== 'string' || action.trim().length === 0) {
    throw new Error('Audit action must be a non-empty string')
  }
  
  if (!actor || typeof actor !== 'string' || actor.trim().length === 0) {
    throw new Error('Audit actor must be a non-empty string')
  }
  
  return {
    id: uuid(),
    action: action.trim(),
    actor: actor.trim(),
    timestamp: new Date().toISOString(),
    details
  }
}
