import mongoose, { Schema } from 'mongoose';

const departmentSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        value: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            // required: true,
        },
    })

export const Department = mongoose.model('Department', departmentSchema);