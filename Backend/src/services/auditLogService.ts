import AuditLog, { IAuditLog } from '../models/AuditLog';

interface LogEntry {
  userId: string;
  userEmail: string;
  action: 'create' | 'update' | 'delete' | 'view';
  entityType: 'client' | 'program' | 'enrollment';
  entityId: string;
  details: string;
}

export const createAuditLog = async (logEntry: LogEntry): Promise<IAuditLog> => {
  try {
    const auditLog = new AuditLog(logEntry);
    await auditLog.save();
    
    // Also print to console for immediate visibility
    console.log(`[AUDIT] ${new Date().toISOString()} - ${logEntry.userEmail} ${logEntry.action}ed ${logEntry.entityType} ${logEntry.entityId}: ${logEntry.details}`);
    
    return auditLog;
  } catch (error) {
    console.error('Error creating audit log:', error);
    throw error;
  }
};

export const getAuditLogs = async (filters: Partial<LogEntry> = {}): Promise<IAuditLog[]> => {
  try {
    return await AuditLog.find(filters).sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
}; 