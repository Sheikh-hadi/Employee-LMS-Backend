import mongoose, { Schema } from 'mongoose';

const employeeSchema = new Schema(

    {
        id: {
            type: Number,
            required: true,
            trim: true,
            unique: true,
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            trim: true,
        },
        cnic: {
            type: Number,
            required: true,
            trim: true,
            unique: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        gender: {
            type: String,
            required: true,
            trim: true,
            enum: ['male', 'female', 'other'],
        },
        dateOfBirth: {
            type: String,
            required: true,
            trim: true,
        },
        designation: {
            type: String,
            required: true,
            trim: true,
        },
        salary: {
            type: Number,
            required: true,
            trim: true,
        },
        contract: {
            type: Boolean,
            required: true,
            trim: true,
        },
        bankName: {
            type: String,
            required: true,
            trim: true,
        },
        accountTitle: {
            type: String,
            required: true,
            trim: true,
        },
        accountNumber: {
            type: Number,
            required: true,
            trim: true,
            unique: true,
        },
        guardianName: {
            type: String,
            required: true,
            trim: true,
        },
        guardianPhoneNumber: {
            type: Number,
            required: true,
            trim: true,
        },
        guardianRelationship: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            // required: true,
        },
        status: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
    }
)

export const Employee = mongoose.model('Employee', employeeSchema);