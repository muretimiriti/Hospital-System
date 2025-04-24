import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  userId: string;
  userEmail: string;
  action: string;
  entityType: 'client' | 'program' | 'enrollment';
  entityId: string;
  details: string;
  createdAt: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
    },
    userEmail: {
      type: String,
      required: [true, 'User email is required'],
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      enum: ['create', 'update', 'delete', 'view'],
    },
    entityType: {
      type: String,
      required: [true, 'Entity type is required'],
      enum: ['client', 'program', 'enrollment'],
    },
    entityId: {
      type: String,
      required: [true, 'Entity ID is required'],
    },
    details: {
      type: String,
      required: [true, 'Details are required'],
    },
  },
  {
    timestamps: true,
  }
);

const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog; 