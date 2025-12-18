import express from 'express';
import {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    joinEvent,
    leaveEvent,
} from '../controllers/eventController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../config/cloudinary';

const router = express.Router();

router.route('/')
    .get(getEvents)
    .post(protect, upload.single('image'), createEvent);

router.route('/:id')
    .get(getEventById)
    .put(protect, upload.single('image'), updateEvent)
    .delete(protect, deleteEvent);

router.post('/:id/join', protect, joinEvent);
router.post('/:id/leave', protect, leaveEvent);

export default router;
