import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IClient extends Document {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  contactNumber: string;
  email: string;
  address: string;
  enrolledPrograms: Types.ObjectId[]; // References Enrollment documents
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, 'Gender is required'],
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
      // Add validation for phone number format if needed
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    enrolledPrograms: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Enrollment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.model<IClient>('Client', ClientSchema);

export default Client; 