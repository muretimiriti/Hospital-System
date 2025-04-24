import { Request, Response } from 'express';
import HealthProgram, { IHealthProgram } from '../models/HealthProgram';
import { handleMongooseError } from '../utils/errorHandler';

// Controller function to create a new health program
export const createProgram = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    // Basic validation
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const newProgram = new HealthProgram({ name, description });
    await newProgram.save();

    res.status(201).json(newProgram);
  } catch (error: any) {
    handleMongooseError(error, res);
  }
};

// Controller function to get all health programs
export const getAllPrograms = async (req: Request, res: Response) => {
  try {
    const programs = await HealthProgram.find().sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json(programs);
  } catch (error: any) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: 'Server error fetching programs' });
  }
};

// Controller function to get a single health program by ID
export const getProgramById = async (req: Request, res: Response) => {
  try {
    const program = await HealthProgram.findById(req.params.id);

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.status(200).json(program);
  } catch (error: any) {
    console.error('Error fetching program by ID:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Program ID format' });
    }
    res.status(500).json({ message: 'Server error fetching program' });
  }
};

// Controller function to update a health program by ID
export const updateProgram = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const programId = req.params.id;

    // Basic validation
    if (!name && !description) {
      return res.status(400).json({ message: 'At least name or description must be provided for update' });
    }

    const updatedProgram = await HealthProgram.findByIdAndUpdate(
      programId,
      { $set: { name, description } }, // Use $set to update only provided fields
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    if (!updatedProgram) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.status(200).json(updatedProgram);
  } catch (error: any) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Program ID format' });
    }
    handleMongooseError(error, res);
  }
};

// Controller function to delete a health program by ID
export const deleteProgram = async (req: Request, res: Response) => {
  try {
    const programId = req.params.id;
    const deletedProgram = await HealthProgram.findByIdAndDelete(programId);

    if (!deletedProgram) {
      return res.status(404).json({ message: 'Program not found' });
    }

    // Optionally: Add logic to handle enrollments associated with this program
    // e.g., remove clients from the program or mark enrollments as inactive.

    res.status(200).json({ message: 'Program deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting program:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Program ID format' });
    }
    res.status(500).json({ message: 'Server error deleting program' });
  }
}; 