import { Request, Response } from 'express';
import Enrollment, { IEnrollment } from '../models/Enrollment';
import Client, { IClient } from '../models/Client';
import HealthProgram, { IHealthProgram } from '../models/HealthProgram';
import { handleMongooseError } from '../utils/errorHandler';
import mongoose, { Types } from 'mongoose';

// Helper function to validate ObjectId
const isValidObjectId = (id: string): boolean => mongoose.Types.ObjectId.isValid(id);

// Type for populated enrollment
interface PopulatedEnrollment extends Omit<IEnrollment, 'client' | 'program'> {
  client: IClient | null;
  program: IHealthProgram | null;
}

// Controller function to create a new enrollment
export const createEnrollment = async (req: Request, res: Response) => {
  try {
    const { clientId, programId, startDate, endDate, status, notes } = req.body;

    // Validate required fields
    if (!clientId || !programId) {
      return res.status(400).json({ message: 'Client ID and Program ID are required' });
    }

    // Create enrollment data object
    const enrollmentData: Partial<IEnrollment> = { 
      notes,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      status: status || 'active'
    };

    // Validate client ID
    if (!isValidObjectId(clientId)) {
      return res.status(400).json({ message: 'Invalid Client ID format' });
    }
    const clientExists = await Client.findById(clientId);
    if (!clientExists) {
      return res.status(404).json({ message: 'Client not found' });
    }
    enrollmentData.client = new Types.ObjectId(clientId);

    // Validate program ID
    if (!isValidObjectId(programId)) {
      return res.status(400).json({ message: 'Invalid Program ID format' });
    }
    const programExists = await HealthProgram.findById(programId);
    if (!programExists) {
      return res.status(404).json({ message: 'Health program not found' });
    }
    enrollmentData.program = new Types.ObjectId(programId);

    // Create and save the new enrollment
    const newEnrollment = new Enrollment(enrollmentData);
    await newEnrollment.save();

    // Add enrollment reference to the client document if client exists
    if (clientId) {
      const clientExists = await Client.findById(clientId);
      if (clientExists) {
        // Get the enrollment ID and create a new ObjectId
        const enrollmentId = newEnrollment._id as unknown as Types.ObjectId;
        clientExists.enrolledPrograms.push(enrollmentId);
        await clientExists.save();
      }
    }

    // Populate the response with client and program details
    const populatedEnrollment = await Enrollment.findById(newEnrollment._id)
      .populate<{ program: IHealthProgram; client: IClient }>({
        path: 'program',
        select: 'name description duration cost startDate endDate'
      })
      .populate({
        path: 'client',
        select: 'firstName lastName email'
      }) as PopulatedEnrollment | null;

    if (!populatedEnrollment) {
      return res.status(404).json({ message: 'Enrollment not found after creation' });
    }

    // Transform the data to match the expected structure
    const transformedEnrollment = {
      id: populatedEnrollment._id,
      program: populatedEnrollment.program ? {
        id: populatedEnrollment.program._id,
        name: populatedEnrollment.program.name,
        description: populatedEnrollment.program.description,
        duration: populatedEnrollment.program.duration,
        cost: populatedEnrollment.program.cost,
        startDate: populatedEnrollment.program.startDate,
        endDate: populatedEnrollment.program.endDate
      } : null,
      client: populatedEnrollment.client ? {
        id: populatedEnrollment.client._id,
        firstName: populatedEnrollment.client.firstName,
        lastName: populatedEnrollment.client.lastName
      } : null,
      status: populatedEnrollment.status,
      startDate: populatedEnrollment.startDate,
      endDate: populatedEnrollment.endDate
    };

    res.status(201).json(transformedEnrollment);
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
      .populate<{ client: IClient }>('client', 'firstName lastName email')
      .populate<{ program: IHealthProgram }>('program', 'name')
      .sort({ createdAt: -1 }) as PopulatedEnrollment[];

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
      .populate<{ program: IHealthProgram }>({
        path: 'program',
        select: 'name description duration cost startDate endDate'
      })
      .populate<{ client: IClient }>({
        path: 'client',
        select: 'firstName lastName email'
      })
      .sort({ createdAt: -1 }) as PopulatedEnrollment[];

    if (!enrollments) {
      return res.status(404).json({ message: 'No enrollments found for this client' });
    }

    // Transform the data to match the expected structure
    const transformedEnrollments = enrollments.map(enrollment => ({
      id: enrollment._id,
      program: enrollment.program ? {
        id: enrollment.program._id,
        name: enrollment.program.name,
        description: enrollment.program.description,
        duration: enrollment.program.duration,
        cost: enrollment.program.cost,
        startDate: enrollment.program.startDate,
        endDate: enrollment.program.endDate
      } : null,
      client: enrollment.client ? {
        id: enrollment.client._id,
        firstName: enrollment.client.firstName,
        lastName: enrollment.client.lastName
      } : null,
      status: enrollment.status,
      startDate: enrollment.startDate,
      endDate: enrollment.endDate
    }));

    res.status(200).json(transformedEnrollments);
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
      .populate<{ client: IClient }>('client', 'firstName lastName email')
      .populate<{ program: IHealthProgram }>('program', 'name description') as PopulatedEnrollment | null;

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
    );

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

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Remove enrollment reference from client's enrolledPrograms array
    if (enrollment.client) {
      const client = await Client.findById(enrollment.client);
      if (client) {
        client.enrolledPrograms = client.enrolledPrograms.filter(
          id => id.toString() !== enrollmentId
        );
        await client.save();
      }
    }

    await enrollment.deleteOne();
    res.status(200).json({ message: 'Enrollment deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting enrollment:', error);
    res.status(500).json({ message: 'Server error deleting enrollment' });
  }
}; 