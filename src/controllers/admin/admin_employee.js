// add employee
// get employee 
// activate | deactivate employee
// delete employee



const logger = require('../../utils/logger');
const { Admin } = require('../../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');



const addEmployee = async (req, res) => {
    logger.info('INFO -> ADDING EMPLOYEE API CALLED');
    try {
        // Extract employee data from the request body
        const {
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            gender,
            role,
            active
        } = req.body;
        console.log(req.body, "reqbody")

        // Validate the data (you can add more validation as needed)
        if (!firstName || !lastName || !email || !password || !role) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const hashPassword = await bcrypt.hash(password, 10);


        // Create a new employee record in the "admin" table
        const newEmployee = await Admin.create({
            first_name:firstName,
            last_name:lastName,
            email,
            password: hashPassword,
            role,
            active: active || 1, // Set a default value if "active" is not provided
            phone_number:phoneNumber,
            gender,
        });

        res.status(201).json({ message: 'Employee added successfully', employee: newEmployee });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request' });
    }
};





const getEmployees = async (req, res) => {
    logger.info('INFO -> GET EMPLOYEES API CALLED');
    try {
        // Assuming "Admin" model has a "role" field that represents the employee's role
        const employees = await Admin.findAll({
            where: {
                role: {
                    [Op.or]: ['admin', 'assistant manager', 'manager']
                }
            }
        });

        res.status(200).json({ employees });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request' });
    }
};


// Function to activate an employee
const activateEmployee = async (req, res) => {
    logger.info('INFO -> ACTIVATE EMPLOYEE API CALLED');
    try {
        const { id } = req.params; // Assuming you pass the employee ID in the URL params

        // Find the employee by their ID
        const employee = await Admin.findByPk(id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Update the 'active' field to activate the employee
        employee.active = 1;
        await employee.save();

        res.status(200).json({ message: 'Employee activated successfully' });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request' });
    }
};

// Function to deactivate an employee
const deactivateEmployee = async (req, res) => {
    logger.info('INFO -> DEACTIVATE EMPLOYEE API CALLED');
    try {
        const { id } = req.params; // Assuming you pass the employee ID in the URL params

        // Find the employee by their ID
        const employee = await Admin.findByPk(id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Update the 'active' field to deactivate the employee
        employee.active = 0;
        await employee.save();

        res.status(200).json({ message: 'Employee deactivated successfully' });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request' });
    }
};


const deleteEmployee = async (req, res) => {
    logger.info('INFO -> DELETE EMPLOYEE API CALLED');
    try {
        const { id } = req.params; // Assuming you pass the employee ID in the URL params

        // Find the employee by their ID
        const employee = await Admin.findByPk(id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Delete the employee record
        await employee.destroy();

        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request' });
    }
};








module.exports = {
    addEmployee,
    getEmployees,
    activateEmployee,
    deactivateEmployee,
    deleteEmployee
}