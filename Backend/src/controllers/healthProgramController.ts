import { Request, Response } from 'express';
import HealthProgram, { IHealthProgram } from '../models/HealthProgram';
import { handleMongooseError } from '../utils/errorHandler';
import { getPaginationParams, getPaginationResponse } from '../utils/pagination';

// Controller function to create a new health program
export const createProgram = async (req: Request, res: Response) => {
  try {
    const { name, description, duration, cost, maxParticipants, startDate, endDate } = req.body;

    // Basic validation
    if (!name || !description || !duration || !cost || !maxParticipants || !startDate) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['name', 'description', 'duration', 'cost', 'maxParticipants', 'startDate']
      });
    }

    // Check if program with same name already exists
    const existingProgram = await HealthProgram.findOne({ name });
    if (existingProgram) {
      return res.status(409).json({ 
        message: 'A program with this name already exists',
        existingProgram: {
          id: existingProgram._id,
          name: existingProgram.name
        }
      });
    }

    // Create program data object
    const programData: Partial<IHealthProgram> = {
      name,
      description,
      duration: Number(duration),
      cost: Number(cost),
      maxParticipants: Number(maxParticipants),
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined
    };

    const newProgram = new HealthProgram(programData);
    await newProgram.save();

    res.status(201).json(newProgram);
  } catch (error: any) {
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      return res.status(409).json({ 
        message: 'A program with this name already exists',
        field: 'name'
      });
    }
    handleMongooseError(error, res);
  }
};

// Controller function to get all health programs
export const getPrograms = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    
    // Build query
    const query: any = {};
    if (name) {
      query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }
    
    // Get pagination params
    const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(req);
    
    // Build sort object
    const sort: { [key: string]: 1 | -1 } = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get total count
    const total = await HealthProgram.countDocuments(query);

    // Get paginated and sorted programs
    const programs = await HealthProgram.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json(getPaginationResponse(programs, total, page, limit));
  } catch (error) {
    console.error('Error fetching health programs:', error);
    res.status(500).json({
      message: 'Failed to fetch health programs',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
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
    const { name, description, duration, cost, maxParticipants, startDate, endDate } = req.body;
    const programId = req.params.id;

    // Get the current program
    const currentProgram = await HealthProgram.findById(programId);
    if (!currentProgram) {
      return res.status(404).json({ message: 'Program not found' });
    }

    // If name is being updated, check if it already exists
    if (name && name !== currentProgram.name) {
      const existingProgram = await HealthProgram.findOne({ 
        name, 
        _id: { $ne: programId } // Exclude current program
      });
      if (existingProgram) {
        return res.status(409).json({ 
          message: 'A program with this name already exists',
          existingProgram: {
            id: existingProgram._id,
            name: existingProgram.name
          }
        });
      }
    }

    // Create update data object with only provided fields
    const updateData: Partial<IHealthProgram> = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (duration) updateData.duration = Number(duration);
    if (cost) updateData.cost = Number(cost);
    if (maxParticipants) updateData.maxParticipants = Number(maxParticipants);
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);

    // Basic validation
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'At least one field must be provided for update' });
    }

    const updatedProgram = await HealthProgram.findByIdAndUpdate(
      programId,
      { $set: updateData },
      { new: true, runValidators: true }
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