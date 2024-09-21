import { Department } from "../models/dapartment.model.js";
import { AsyncHandler } from "../utilis/AsyncHandler.js";
import { ApiError } from "../utilis/ApiError.js";
import { ApiResponse } from "../utilis/ApiResponse.js";

const getDepartment = AsyncHandler(async (req, res, next) => {
    const department = await Department.find();
    if (!department.length === 0) {
        return res.status(404).json(new ApiError(404, "Not Record Found"));
    }
    return res
        .status(201)
        .json(new ApiResponse(200, department, "Department Fetch Data Successfully"));
});

const createDepartment = AsyncHandler(async (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json(new ApiError
            (400, "All fields are required"));
    }
    const checkDepartment = await Department.findOne({ name });
    // console.log("checkDepartment: ", checkDepartment)
    if (checkDepartment) {
        return res.status(400).json(new ApiError(400, "Department Already Exists"));
    }
    const allDepartment = await Department.countDocuments();
    // console.log("allDepartment: ", allDepartment)
    const id = allDepartment + 1;
    const value = name.replace(/\s+/g, '').toLowerCase();
    const department = await Department.create({ id, name, value });
    // console.log("department: ", department)
    if (!department) {
        return res.status(400).json(new ApiError(400, "Department Not Created"));
    }

    return res
        .status(201)
        .json(new ApiResponse(201, department, "Department Created Successfully"));
});

const deleteDepartment = AsyncHandler(async (req, res, next) => {
    const id = req.params.id;

    // Check for valid ID
    if (!id) {
        return res.status(400).json(new ApiError(400, "Please Enter a valid Department Id"));
    }

    // Find the department to delete
    const department = await Department.findOne({ "id": id });
    if (!department) {
        return res.status(404).json(new ApiError(404, "Department Not Found"));
    }

    // Delete the department
    await Department.deleteOne({ "id": id });

    const allDepartment = await Department.find();
    // console.log("allDepartment: ", allDepartment)

    const bulkOps = allDepartment.map((department, index) => ({
        updateOne: {
            filter: { _id: department._id },
            update: { $set: { id: index + 1 } }
        }
    }));

    // 
    await Department.bulkWrite(bulkOps);
    

    return res.status(200).json(new ApiResponse(200, department, "Department Deleted Successfully"));
});


const updateDepartment = AsyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const { name } = req.body;
    // console.log("id: ", id)
    // console.log("name: ", name)
    const department = await Department.findOne({ id: id });
    if (!department) {
        return res.status(404).json(new ApiError(404, "Department Not Found"));
    }
    const value = name.replace(/\s+/g, '').toLowerCase();
    const updateDepartment = await Department.updateOne({ id: id }, { $set: { name, value } });
    if (!updateDepartment) {
        return res.status(404).json(new ApiError(404, "Department Not Updated"));
    }
    return res
        .status(200)
        .json(new ApiResponse(200, department, "Department Updated Successfully"));
});

export {
    getDepartment,
    createDepartment,
    deleteDepartment,
    updateDepartment,
};