import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Event from '../models/Event';
import User from '../models/User';
import { cloudinary } from '../config/cloudinary';
import { Readable } from 'stream';

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (buffer: Buffer): Promise<string> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'mini-event-platform' },
            (error, result) => {
                if (error) return reject(error);
                if (result) return resolve(result.secure_url);
                reject(new Error('Cloudinary upload failed'));
            }
        );
        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);
        readable.pipe(stream);
    });
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req: Request, res: Response) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req: Request, res: Response) => {
    try {
        const event = await Event.findById(req.params.id).populate('creator', 'name email');
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ message: 'Not authorized' });
        return;
    }

    const { title, description, date, location, capacity } = req.body;

    let imageUrl = '';

    try {
        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer);
        }

        const event = await Event.create({
            title,
            description,
            date,
            location,
            capacity,
            imageUrl,
            creator: req.user._id,
        });

        // Add to user's createdEvents
        await User.findByIdAndUpdate(req.user._id, {
            $push: { createdEvents: event._id },
        });

        res.status(201).json(event);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
export const updateEvent = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ message: 'Not authorized' });
        return;
    }

    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            if (event.creator.toString() !== req.user._id.toString()) {
                res.status(401).json({ message: 'Not authorized to update this event' });
                return;
            }

            event.title = req.body.title || event.title;
            event.description = req.body.description || event.description;
            event.date = req.body.date || event.date;
            event.location = req.body.location || event.location;
            event.capacity = req.body.capacity || event.capacity;

            if (req.file) {
                event.imageUrl = await uploadToCloudinary(req.file.buffer);
            }

            const updatedEvent = await event.save();
            res.json(updatedEvent);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
export const deleteEvent = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ message: 'Not authorized' });
        return;
    }

    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            if (event.creator.toString() !== req.user._id.toString()) {
                res.status(401).json({ message: 'Not authorized to delete this event' });
                return;
            }

            await Event.deleteOne({ _id: event._id });

            // Remove from creator's list
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { createdEvents: event._id }
            });

            res.json({ message: 'Event removed' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Join event (RSVP)
// @route   POST /api/events/:id/join
// @access  Private
export const joinEvent = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ message: 'Not authorized' });
        return;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const event = await Event.findById(req.params.id).session(session);

        if (!event) {
            await session.abortTransaction();
            session.endSession();
            res.status(404).json({ message: 'Event not found' });
            return;
        }

        // Check if already joined
        const isJoined = event.attendees.some(
            (id) => id.toString() === req.user!._id.toString()
        );

        if (isJoined) {
            await session.abortTransaction();
            session.endSession();
            res.status(400).json({ message: 'You have already joined this event' });
            return;
        }

        if (event.attendees.length >= event.capacity) {
            await session.abortTransaction();
            session.endSession();
            res.status(400).json({ message: 'Event is full' });
            return;
        }

        // Atomic update within transaction
        event.attendees.push(req.user._id);
        await event.save({ session });

        // Add to user's joinedEvents
        await User.findByIdAndUpdate(
            req.user._id,
            { $push: { joinedEvents: event._id } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.json({ message: 'Successfully joined event' });
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
};

// @desc    Leave event
// @route   POST /api/events/:id/leave
// @access  Private
export const leaveEvent = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ message: 'Not authorized' });
        return;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const event = await Event.findById(req.params.id).session(session);

        if (!event) {
            await session.abortTransaction();
            session.endSession();
            res.status(404).json({ message: 'Event not found' });
            return;
        }

        const isJoined = event.attendees.some(
            (id) => id.toString() === req.user!._id.toString()
        );

        if (!isJoined) {
            await session.abortTransaction();
            session.endSession();
            res.status(400).json({ message: 'You have not joined this event' });
            return;
        }

        // Atomic update within transaction
        event.attendees = event.attendees.filter(
            (id) => id.toString() !== req.user!._id.toString()
        );
        await event.save({ session });

        // Remove from user's joinedEvents
        await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { joinedEvents: event._id } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.json({ message: 'Successfully left event' });
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
};
