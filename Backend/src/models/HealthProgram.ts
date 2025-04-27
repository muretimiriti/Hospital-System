import mongoose, { Schema, Document } from 'mongoose';

export interface IHealthProgram extends Document {
  name: string;
  description: string;
  duration: number;
  cost: number;
  maxParticipants: number;
  currentParticipants: number;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const HealthProgramSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Program name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Program description is required'],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'Program duration is required'],
      min: [1, 'Duration must be at least 1'],
    },
    cost: {
      type: Number,
      required: [true, 'Program cost is required'],
      min: [0, 'Cost cannot be negative'],
    },
    maxParticipants: {
      type: Number,
      required: [true, 'Maximum participants is required'],
      min: [1, 'Maximum participants must be at least 1'],
    },
    currentParticipants: {
      type: Number,
      default: 0,
      min: [0, 'Current participants cannot be negative'],
    },
    startDate: {
      type: Date,
      required: [true, 'Program start date is required'],
    },
    endDate: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const HealthProgram = mongoose.model<IHealthProgram>('HealthProgram', HealthProgramSchema);

export default HealthProgram; 