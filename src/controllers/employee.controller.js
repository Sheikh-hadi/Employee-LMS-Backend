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
    console.log("req.body in createEmployee", req.body)
    console.log("req.body in createEmployee", req.user)
    const {
        firstName, lastName, email, phoneNumber, cnic, address, gender, dateOfBirth, designation,
        salary, contract, bankName, accountTitle, accountNumber, guardianName, guardianPhoneNumber,
        guardianRelationship
    } = req.body;


    if ([firstName, lastName, email, phoneNumber, cnic, address, gender, dateOfBirth, designation,
        salary, contract, bankName, accountTitle, accountNumber, guardianName, guardianPhoneNumber,
        guardianRelationship].some((field) => !field || field.toString().trim() === "")) {
        return res.status(400).json(new ApiError(400, "All fields are required"));
    }


    const existedUser = await Employee.findOne({ $or: [{ cnic }, { email }] });
    // console.log("existedUser in createEmployee: ", existedUser)
    if (existedUser) {
        return res.status(400).json(new ApiError(400, `${existedUser.firstName} ${existedUser.lastName} already exists with\nThis Email: ${existedUser.email}`
        ));
    }

    // Generate new employee ID
    const employeeCount = await Employee.countDocuments();
    // console.log("employeeCount in createEmployee: ", employeeCount)
    const id = employeeCount + 1;
    // console.log("id: ", id)

    // Create new employee
    const employee = await Employee.create({
        id,
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
        guardianRelationship,
        author: req.user.fullName,
    });


    try {
        let createdEmployee = await Employee.findOne({ "id": employee.id })
        console.log("createdEmployee in createEmployee: ", createdEmployee)
        return res.status(201).json(new ApiResponse(201, createdEmployee, `${createdEmployee.firstName} ${createdEmployee.lastName} with this mail is ${createdEmployee.email} created successfully`));
    } catch (error) {
        if (error.name === 'ValidationError') {

            const validationErrors = Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message
            }));
            console.log("validationErrors: ", validationErrors)
            return res.status(400).json(new ApiError(400, "Validation errors", validationErrors));
        }
        console.log("error: ", error)
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
});


const updateEmployee = AsyncHandler(async (req, res) => {
    const id = req.params.id;
    // console.log("id: ", id)
    // console.log("reqbody: ", req.body)
    // console.log("reqparams: ", req.params)
    // Check if ID is provided
    if (!id) {
        return res.status(400).json({ message: 'ID parameter is required' });
    }
    // Find the employee by ID
    const employee = await Employee.findOne({ id: id });
    // console.log("employee: ", employee)
    if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
    }
    // Update the employee
    const updatedEmployee = await Employee.findOneAndUpdate(
        { "id": id },
        { $set: req.body.formValue },
        { new: true }
    );
    console.log("updatedEmployee: ", updatedEmployee)
    if (!updatedEmployee) {
        return res.status(404).json({ message: 'Employee not found' });
    }
    return res.status(200).json({ message: `${updatedEmployee.firstName} ${updatedEmployee.lastName} updated successfully`, updatedEmployee });
})

const deleteEmployee = AsyncHandler(async (req, res) => {
    const id = req.params.id;
    console.log("id: ", id)
    // console.log("reqbody: ", req.body)
    // console.log("reqparams: ", req.params)
    // Check if ID is provided
    if (!id) {
        return res.status(400).json({ message: 'ID parameter is required' });
    }

    // Find the employee by ID
    const employee = await Employee.findOne({ id: id });
    console.log("employee: ", employee)
    if (!employee) {
        return res.status(404).json({ message: "Employee Not Found" });
    }
    // Delete the employee
    const result = await Employee.deleteOne({ "id": id });
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

    res.status(200).json({
        message: `${employee.firstName} ${" "} ${employee.lastName}
         which id: ${id}  deleted successfully`
    });
});



export { getEmployee, createEmployee, deleteEmployee, updateEmployee };