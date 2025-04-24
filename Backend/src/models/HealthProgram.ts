import mongoose, { Schema, Document } from 'mongoose';

export interface IHealthProgram extends Document {
  name: string;
  description: string;
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
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const HealthProgram = mongoose.model<IHealthProgram>('HealthProgram', HealthProgramSchema);

export default HealthProgram; 