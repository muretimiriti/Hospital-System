import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Note: This is a simple User model. Add more fields as needed (e.g., role, name).
export interface IUser extends Document {
  email: string;
  password?: string; // Password will be selected: false in schema
  createdAt: Date;
  updatedAt: Date;
  // Method to compare passwords
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password by default
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare candidate password with the user's password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  // 'this.password' is available because we explicitly selected it or it's a new document
  return await bcrypt.compare(candidatePassword, this.password || '');
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User; 