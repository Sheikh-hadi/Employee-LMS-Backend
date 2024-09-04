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
    const { firstName, lastName, email, phoneNumber, cnic, address, gender, dateOfBirth, designation, salary, contract, bankName, accountTitle, accountNumber, guardianName, guardianPhoneNumber, guardianRelationship } = req.body;

    if ([firstName, lastName, email, phoneNumber, cnic, address, gender, dateOfBirth, designation, salary, contract, bankName, accountTitle, accountNumber, guardianName, guardianPhoneNumber, guardianRelationship].some((field) => field?.toString().trim() === "")) {
        return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    const existedUser = await Employee.findOne({
        $or: [{ cnic }, { email }]
    });
    console.log(existedUser);
    if (existedUser) {
        return res.status(400).json(new ApiError(400, "Employee already exists"));
    }
   const employeeList = await Employee.find();
   const id = employeeList.length + 1;

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
        guardianRelationship
    });

    const createdEmployee = await Employee.findById(employee._id);
    console.log(createdEmployee);
    if (!createdEmployee) {
        return res.status(400).json(new ApiError(400, "Employee not created"));
    }
    return res
        .status(201)
        .json(new ApiResponse(201, createdEmployee, "Employee created successfully"));
})

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



export { getEmployee, createEmployee };