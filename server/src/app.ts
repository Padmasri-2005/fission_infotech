import express, { Express, Request, Response } from 'express';
import cors from 'cors';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Route
app.get('/', (req: Request, res: Response) => {
    res.send('Mini Event Platform API is running');
});

import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';

// Routes will be added here
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

export default app;
