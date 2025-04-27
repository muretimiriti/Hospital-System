import mongoose from 'mongoose';
import User, { IUser } from '../../models/User';

describe('User Model Test', () => {
  it('should create & save user successfully', async () => {
    const validUser = new User({
      email: 'test@example.com',
      password: 'password123',
    });
    const savedUser = await validUser.save();
    
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(validUser.email);
    
    // When creating a new user, the password will be present but hashed
    expect(savedUser.password).toBeDefined();
    expect(savedUser.password).not.toBe('password123'); // Should be hashed
    
    // When fetching the user, password should not be returned by default
    const fetchedUser = await User.findById(savedUser._id);
    expect(fetchedUser?.password).toBeUndefined();
    
    // Verify password is hashed when explicitly selected
    const userWithPassword = await User.findById(savedUser._id).select('+password');
    expect(userWithPassword?.password).toBeDefined();
    expect(userWithPassword?.password).not.toBe('password123'); // Should be hashed
  });

  it('should fail to save user without required fields', async () => {
    const userWithoutRequiredField = new User({});
    let err: any;
    
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should fail to save user with invalid email', async () => {
    const userWithInvalidEmail = new User({
      email: 'invalid-email',
      password: 'password123',
    });
    let err: any;
    
    try {
      await userWithInvalidEmail.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should fail to save user with password less than 6 characters', async () => {
    const userWithShortPassword = new User({
      email: 'test@example.com',
      password: '12345',
    });
    let err: any;
    
    try {
      await userWithShortPassword.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should successfully compare passwords', async () => {
    const user = new User({
      email: 'test@example.com',
      password: 'password123',
    });
    await user.save();
    
    // Need to explicitly select password for comparison
    const userWithPassword = await User.findById(user._id).select('+password');
    const isMatch = await userWithPassword?.comparePassword('password123');
    
    expect(isMatch).toBe(true);
  });

  it('should fail to compare incorrect password', async () => {
    const user = new User({
      email: 'test@example.com',
      password: 'password123',
    });
    await user.save();
    
    const userWithPassword = await User.findById(user._id).select('+password');
    const isMatch = await userWithPassword?.comparePassword('wrongpassword');
    
    expect(isMatch).toBe(false);
  });
}); 