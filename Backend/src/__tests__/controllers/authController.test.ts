import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../server';
import User from '../../models/User';
import { generateToken } from '../../utils/jwtUtils';

describe('Auth Controller Tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('email', 'test@example.com');
      expect(res.body).toHaveProperty('token');
      expect(res.body).not.toHaveProperty('password');
    });

    it('should fail to register with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Email and password are required');
    });

    it('should fail to register with existing email', async () => {
      // First create a user
      await User.create({
        email: 'test@example.com',
        password: 'password123',
      });

      // Try to register with same email
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('message', 'User already exists with this email');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await User.create({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('email', 'test@example.com');
      expect(res.body).toHaveProperty('token');
      expect(res.body).not.toHaveProperty('password');
    });

    it('should fail to login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should fail to login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Invalid email or password');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get user profile with valid token', async () => {
      // Create a test user
      const user = await User.create({
        email: 'test@example.com',
        password: 'password123',
      });

      const token = generateToken(user._id.toString());

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', user._id.toString());
      expect(res.body).toHaveProperty('email', 'test@example.com');
      expect(res.body).not.toHaveProperty('password');
    });

    it('should fail to get profile without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.status).toBe(401);
    });

    it('should fail to get profile with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.status).toBe(401);
    });
  });
}); 