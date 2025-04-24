import { Request, Response, NextFunction } from 'express';
import { createAuditLog } from '../services/auditLogService';

export const auditLogger = (entityType: 'client' | 'program' | 'enrollment') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Store the original res.json method
    const originalJson = res.json;

    // Override res.json method
    res.json = function (body: any) {
      // Call the original method
      const result = originalJson.call(this, body);

      // Log the action after the response is sent
      const user = (req as any).user;
      if (user) {
        const action = req.method === 'GET' ? 'view' : 
                      req.method === 'POST' ? 'create' : 
                      req.method === 'PUT' ? 'update' : 
                      req.method === 'DELETE' ? 'delete' : 'view';
        
        const entityId = req.params.id || body.id || 'unknown';
        const details = `${req.method} ${req.originalUrl}`;

        createAuditLog({
          userId: user.id,
          userEmail: user.email,
          action,
          entityType,
          entityId,
          details
        }).catch(err => console.error('Error creating audit log:', err));
      }

      return result;
    };

    next();
  };
}; 