import { Request, Response } from 'express';
import Enrollment, { IEnrollment } from '../models/Enrollment';
import Client from '../models/Client';
import HealthProgram from '../models/HealthProgram';
import { handleMongooseError } from '../utils/errorHandler';
import mongoose, { Types } from 'mongoose';

// Helper function to validate ObjectId
const isValidObjectId = (id: string): boolean => mongoose.Types.ObjectId.isValid(id);

// Controller function to create a new enrollment
export const createEnrollment = async (req: Request, res: Response) => {
  try {
    const { clientId, programId, notes } = req.body;

    // Validate IDs
    if (!isValidObjectId(clientId) || !isValidObjectId(programId)) {
      return res.status(400).json({ message: 'Invalid Client or Program ID format' });
    }

    // Check if client and program exist
    const clientExists = await Client.findById(clientId);
    const programExists = await HealthProgram.findById(programId);

    if (!clientExists) {
      return res.status(404).json({ message: 'Client not found' });
    }
    if (!programExists) {
      return res.status(404).json({ message: 'Health program not found' });
    }

    // Create and save the new enrollment
    const newEnrollment = new Enrollment({ client: clientId, program: programId, notes });
    await newEnrollment.save();

    // Add enrollment reference to the client document
    clientExists.enrolledPrograms.push(newEnrollment._id! as Types.ObjectId);
    await clientExists.save();

    res.status(201).json(newEnrollment);
  } catch (error: any) {
    // Handle potential duplicate key error (client already enrolled in program)
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Client is already enrolled in this program' });
    }
    handleMongooseError(error, res);
  }
};

// Controller function to get all enrollments (potentially with filters)
export const getAllEnrollments = async (req: Request, res: Response) => {
  try {
    // TODO: Add filtering capabilities (e.g., by client, program, status)
    const enrollments = await Enrollment.find()
      .populate('client', 'firstName lastName email') // Populate client fields
      .populate('program', 'name') // Populate program name
      .sort({ createdAt: -1 });

    res.status(200).json(enrollments);
  } catch (error: any) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ message: 'Server error fetching enrollments' });
  }
};

// Controller function to get enrollments for a specific client
export const getClientEnrollments = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;

    if (!isValidObjectId(clientId)) {
      return res.status(400).json({ message: 'Invalid Client ID format' });
    }

    const enrollments = await Enrollment.find({ client: clientId })
      .populate('program', 'name description') // Populate program details
      .sort({ createdAt: -1 });

    if (!enrollments) {
      return res.status(404).json({ message: 'No enrollments found for this client' });
    }

    res.status(200).json(enrollments);
  } catch (error: any) {
    console.error('Error fetching client enrollments:', error);
    res.status(500).json({ message: 'Server error fetching client enrollments' });
  }
};

// Controller function to get a single enrollment by ID
export const getEnrollmentById = async (req: Request, res: Response) => {
  try {
    const enrollmentId = req.params.id;

    if (!isValidObjectId(enrollmentId)) {
      return res.status(400).json({ message: 'Invalid Enrollment ID format' });
    }

    const enrollment = await Enrollment.findById(enrollmentId)
      .populate('client', 'firstName lastName email')
      .populate('program', 'name description');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.status(200).json(enrollment);
  } catch (error: any) {
    console.error('Error fetching enrollment by ID:', error);
    res.status(500).json({ message: 'Server error fetching enrollment' });
  }
};

// Controller function to update an enrollment by ID (e.g., status, notes)
export const updateEnrollment = async (req: Request, res: Response) => {
  try {
    const enrollmentId = req.params.id;
    const { status, notes } = req.body;

    if (!isValidObjectId(enrollmentId)) {
      return res.status(400).json({ message: 'Invalid Enrollment ID format' });
    }

    // Basic validation
    if (!status && notes === undefined) {
      return res.status(400).json({ message: 'At least status or notes must be provided for update' });
    }

    const updateData: Partial<IEnrollment> = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      enrollmentId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('client', 'firstName lastName email')
      .populate('program', 'name description');

    if (!updatedEnrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.status(200).json(updatedEnrollment);
  } catch (error: any) {
    handleMongooseError(error, res);
  }
};

// Controller function to delete an enrollment by ID
export const deleteEnrollment = async (req: Request, res: Response) => {
  try {
    const enrollmentId = req.params.id;

    if (!isValidObjectId(enrollmentId)) {
      return res.status(400).json({ message: 'Invalid Enrollment ID format' });
    }

    const deletedEnrollment = await Enrollment.findByIdAndDelete(enrollmentId);

    if (!deletedEnrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Remove enrollment reference from the corresponding client
    await Client.updateOne(
      { _id: deletedEnrollment.client },
      { $pull: { enrolledPrograms: enrollmentId } }
    );

    res.status(200).json({ message: 'Enrollment deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting enrollment:', error);
    res.status(500).json({ message: 'Server error deleting enrollment' });
  }
}; 