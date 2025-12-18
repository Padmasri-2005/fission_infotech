import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdEvents: mongoose.Types.ObjectId[];
    joinedEvents: mongoose.Types.ObjectId[];
    matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        createdEvents: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Event',
            },
        ],
        joinedEvents: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Event',
            },
        ],
    },
    {
        timestamps: true,
    }
);

userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
