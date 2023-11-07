// add employee
// get employee 
// activate | deactivate employee
// delete employee



const logger = require('../../utils/logger');
const { Admin } = require('../../models');
const bcrypt = require('bcrypt');


const addEmployee = async (req, res) => {
    logger.info('INFO -> ADDING EMPLOYEE API CALLED');
    try {
        // Extract employee data from the request body
        const {
            first_name,
            last_name,
            email,
            password,
            role,
            active,
            phone_number,
            gender,
        } = req.body;

        // Validate the data (you can add more validation as needed)
        if (!first_name || !last_name || !email || !password || !role) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const hashPassword = await bcrypt.hash(password, 10);


        // Create a new employee record in the "admin" table
        const newEmployee = await Admin.create({
            first_name,
            last_name,
            email,
            password: hashPassword,
            role,
            active: active || 1, // Set a default value if "active" is not provided
            phone_number,
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
        
        // Retrieve all employee records from the "admin" table
        const employees = await Admin.findAll();

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
