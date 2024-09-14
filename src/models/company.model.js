import mongoose, { Schema } from 'mongoose';

const companySchema = new Schema(
    {}
)    


export const Company = mongoose.model('Company', companySchema);