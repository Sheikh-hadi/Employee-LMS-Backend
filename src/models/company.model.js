import mongoose, { Schema } from 'mongoose';

const companySchema = new Schema(
    {
        
    },
    {
        timestamps: true
    }
)    


export const Company = mongoose.model('Company', companySchema);