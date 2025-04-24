import { Request, Response } from 'express';
import Client, { IClient } from '../models/Client';
import Enrollment from '../models/Enrollment'; // Needed for cleanup on delete
import { handleMongooseError } from '../utils/errorHandler';

// Controller function to create a new client
export const createClient = async (req: Request, res: Response) => {
  try {
    const clientData: Partial<IClient> = req.body;

    // Basic validation (more detailed validation is in the Mongoose schema)
    if (!clientData.firstName || !clientData.lastName || !clientData.email) {
      return res.status(400).json({ message: 'First name, last name, and email are required' });
    }

    const newClient = new Client(clientData);
    await newClient.save();

    res.status(201).json(newClient);
  } catch (error: any) {
    handleMongooseError(error, res);
  }
};

// Controller function to get all clients
export const getAllClients = async (req: Request, res: Response) => {
  try {
    const clients = await Client.find()
      .select('-enrolledPrograms') // Exclude detailed enrollment refs by default
      .sort({ lastName: 1, firstName: 1 }); // Sort alphabetically
    res.status(200).json(clients);
  } catch (error: any) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Server error fetching clients' });
  }
};

// Controller function to get a single client by ID, populating enrolled programs
export const getClientById = async (req: Request, res: Response) => {
  try {
    const clientId = req.params.id;
    const client = await Client.findById(clientId).populate({
      path: 'enrolledPrograms',
      populate: {
        path: 'program',
        select: 'name description', // Select specific fields from HealthProgram
      },
    });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json(client);
  } catch (error: any) {
    console.error('Error fetching client by ID:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Client ID format' });
    }
    res.status(500).json({ message: 'Server error fetching client' });
  }
};

// Controller function to update a client by ID
export const updateClient = async (req: Request, res: Response) => {
  try {
    const clientId = req.params.id;
    const updateData: Partial<IClient> = req.body;

    // Prevent updating enrolledPrograms directly through this endpoint
    delete (updateData as any).enrolledPrograms;

    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json(updatedClient);
  } catch (error: any) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Client ID format' });
    }
    handleMongooseError(error, res);
  }
};

// Controller function to delete a client by ID
export const deleteClient = async (req: Request, res: Response) => {
  try {
    const clientId = req.params.id;
    const deletedClient = await Client.findByIdAndDelete(clientId);

    if (!deletedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Also delete any enrollments associated with this client
    await Enrollment.deleteMany({ client: clientId });

    res.status(200).json({ message: 'Client and associated enrollments deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting client:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Client ID format' });
    }
    res.status(500).json({ message: 'Server error deleting client' });
  }
};

// Controller function to search clients
export const searchClients = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ message: 'Search query parameter \'q\' is required' });
    }

    const searchRegex = new RegExp(query, 'i'); // Case-insensitive regex

    const clients = await Client.find({
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { contactNumber: searchRegex },
      ],
    })
      .select('-enrolledPrograms')
      .limit(20); // Limit results for performance

    res.status(200).json(clients);
  } catch (error: any) {
    console.error('Error searching clients:', error);
    res.status(500).json({ message: 'Server error searching clients' });
  }
}; 