import { Request, Response } from 'express';
import { getAuditLogs } from '../services/auditLogService';

export const getLogs = async (req: Request, res: Response) => {
  try {
    const { entityType, action, userId, startDate, endDate } = req.query;
    
    const filters: any = {};
    
    if (entityType) filters.entityType = entityType;
    if (action) filters.action = action;
    if (userId) filters.userId = userId;
    
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate as string);
      if (endDate) filters.createdAt.$lte = new Date(endDate as string);
    }
    
    const logs = await getAuditLogs(filters);
    
    res.json({
      data: logs
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({
      message: 'Failed to fetch audit logs',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 