import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
    title: string;
    description: string;
    date: Date;
    location: string;
    capacity: number;
    imageUrl: string;
    creator: mongoose.Types.ObjectId;
    attendees: mongoose.Types.ObjectId[];
}

const eventSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
            min: 1,
        },
        imageUrl: {
            type: String,
            default: '',
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        attendees: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Event = mongoose.model<IEvent>('Event', eventSchema);

export default Event;
