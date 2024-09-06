import { Employee } from "../models/employee.model.js";
import { AsyncHandler } from "../utilis/AsyncHandler.js";
import { ApiError } from "../utilis/ApiError.js";
import { ApiResponse } from "../utilis/ApiResponse.js";

const getEmployee = AsyncHandler(async (req, res, next) => {
    const employee = await Employee.find();
    if (!employee.length > 0) {
        return res.status(404).json(new ApiError(404, "Employee Not Found"));
    }
    return res
        .status(201)
        .json(new ApiResponse(200, employee, "Employee Fetch Data Successfully"));
});


const createEmployee = AsyncHandler(async (req, res, next) => {
    const {
        firstName, lastName, email, phoneNumber, cnic, address, gender, dateOfBirth, designation,
        salary, contract, bankName, accountTitle, accountNumber, guardianName, guardianPhoneNumber,
        guardianRelationship
    } = req.body;

    // Check if any required field is missing
    if ([firstName, lastName, email, phoneNumber, cnic, address, gender, dateOfBirth, designation,
        salary, contract, bankName, accountTitle, accountNumber, guardianName, guardianPhoneNumber,
        guardianRelationship].some((field) => !field || field.toString().trim() === "")) {
        return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    // Check if the employee already exists
    const existedUser = await Employee.findOne({ $or: [{ cnic }, { email }] });
    console.log("existedUser: ", existedUser)
    if (existedUser) {
        return res.status(400).json(new ApiError(400, "Employee already exists"));
    }

    // Generate new employee ID
    const employeeCount = await Employee.countDocuments(); // More reliable way to count documents
    const id = employeeCount + 1;

    // Create new employee
    const employee = new Employee({
        id, firstName, lastName, email, phoneNumber, cnic, address, gender, dateOfBirth,
        designation, salary, contract, bankName, accountTitle, accountNumber, guardianName,
        guardianPhoneNumber, guardianRelationship
    });


    try {
        const createdEmployee = await employee.save();
        console.log("employee: ", employee)
        return res.status(201).json(new ApiResponse(201, createdEmployee, "Employee created successfully"));
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Handle Mongoose validation errors
            const validationErrors = Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message
            }));
            return res.status(400).json(new ApiError(400, "Validation errors", validationErrors));
        }
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
});


const updateEmployee = AsyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, phoneNumber, cnic, address, gender, dateOfBirth, designation, salary, contract, bankName, accountTitle, accountNumber, guardianName, guardianPhoneNumber, guardianRelationship } = req.body;
    const employeeId = req.params.id;
    const employee = await Employee.findById(employeeId);
    if (!employee) {
        return res.status(404).json(new ApiError(404, "Employee not found"));
    }
    const updatedEmployee = await Employee.findByIdAndUpdate(
        employeeId,
        {
            firstName,
            lastName,
            email,
            phoneNumber,
            cnic,
            address,
            gender,
            dateOfBirth,
            designation,
            salary,
            contract,
            bankName,
            accountTitle,
            accountNumber,
            guardianName,
            guardianPhoneNumber,
            guardianRelationship
        },
        { new: true }
    )
    if (!updatedEmployee) {
        return res.status(400).json(new ApiError(400, "Employee not updated"))
    }
})

const deleteEmployee = AsyncHandler(async (req, res) => {
    const id = req.params.id;
    console.log("id: ", id)
    console.log("reqbody: ", req.body)
    console.log("reqparams: ", req.params)
    // Check if ID is provided
    if (!id) {
        return res.status(400).json({ message: 'ID parameter is required' });
    }

    // Delete the employee
    const result = await Employee.deleteOne({ id: id });
    console.log("result: ", result)
    // Check if the deletion was successful
    if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Employee not found' });
    }

    // Fetch all remaining employees
    const allEmployees = await Employee.find();
    console.log("allEmployees: ", allEmployees)

    const bulkOps = allEmployees.map((employee, index) => ({
        updateOne: {
            filter: { _id: employee._id },
            update: { $set: { id: index + 1 } }
        }
    }));

    // 
    await Employee.bulkWrite(bulkOps);

    res.status(200).json({ message: 'Employee deleted and IDs updated successfully' });
});



export { getEmployee, createEmployee, deleteEmployee };