import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IEnrollment extends Document {
  client: Types.ObjectId; // Reference to Client
  program: Types.ObjectId; // Reference to HealthProgram
  enrollmentDate: Date;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema: Schema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    program: {
      type: Schema.Types.ObjectId,
      ref: 'HealthProgram',
      required: true,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add a unique compound index to prevent duplicate enrollments for the same client and program
EnrollmentSchema.index({ client: 1, program: 1 }, { unique: true });

const Enrollment = mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);

export default Enrollment; 