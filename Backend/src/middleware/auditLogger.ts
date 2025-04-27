import { Request, Response, NextFunction } from 'express';
import { createAuditLog } from '../services/auditLogService';

/**
 * Middleware factory that creates an audit logger for a specific entity type
 * @param {('client'|'program'|'enrollment')} entityType - The type of entity being audited
 * @returns {Function} Express middleware function that logs actions
 */
export const auditLogger = (entityType: 'client' | 'program' | 'enrollment') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Store the original res.json method to preserve its functionality
    const originalJson = res.json;

    // Override res.json method to intercept the response
    res.json = function (body: any) {
      // Call the original method to send the response
      const result = originalJson.call(this, body);

      // Log the action after the response is sent
      const user = (req as any).user;
      if (user) {
        // Determine the action type based on the HTTP method
        const action = req.method === 'GET' ? 'view' : 
                      req.method === 'POST' ? 'create' : 
                      req.method === 'PUT' ? 'update' : 
                      req.method === 'DELETE' ? 'delete' : 'view';
        
        // Get the entity ID from params or response body
        const entityId = req.params.id || body.id || 'unknown';
        // Create a detailed log message
        const details = `${req.method} ${req.originalUrl}`;

        // Create an audit log entry
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