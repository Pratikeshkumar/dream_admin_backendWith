// add cities
// get cities
// update cities
// delete cities

const logger = require('../../utils/logger')
const {City} = require('../../models')

const addCities = async (req, res) => {
    logger.info('INFO -> ADDING CITIES API CALLED');
    try {
        const {
            id,
            name,
            state_id,
            state_code,
            country_id,
            country_code,
            latitude,
            longitude,
            flag,
            wikiDataId,
            active
        } = req.body;

        // Create a new city
        const newCity = await City.create({
          
            name,
            state_id,
            state_code,
            country_id,
            country_code,
            latitude,
            longitude,
            flag,
            wikiDataId,
            active
        });

        res.status(201).json({ message: 'City added successfully', data: newCity });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request', error });
    }
}


const getCities = async (req, res) => {
    logger.info('INFO -> GETTING CITIES API CALLED');
    try {
        const { page = 1, perPage = 30 } = req.query;

        // Calculate the offset based on the page and perPage values
        const offset = (page - 1) * perPage;

        // Retrieve cities with pagination
        const cities = await City.findAndCountAll({
            limit: perPage,
            offset,
        });

        res.status(200).json({
            message: 'Cities retrieved successfully',
            data: cities.rows,
            total: cities.count,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request', error });
    }
}



// const getCities = async (req, res) => {
//     logger.info('INFO -> GETTING CITIES API CALLED');
//     try {
//         // Retrieve all cities without pagination
//         const cities = await City.findAll();

//         res.status(200).json({
//             message: 'Cities retrieved successfully',
//             data: cities,
//         });
//     } catch (error) {
//         logger.error(error);
//         res.status(500).json({ message: 'Error generated while processing your request', error });
//     }
// }

const updateCities = async (req, res) => {
    logger.info('INFO -> UPDATING CITY API CALLED');
    try {
        const { id } = req.params; // Assuming you have an 'id' parameter in the route
        const updatedFields = req.body;

        // Find the city by ID
        const existingCity = await City.findByPk(id);

        if (!existingCity) {
            return res.status(404).json({ message: 'City not found' });
        }

        // Update the city properties
        Object.assign(existingCity, updatedFields);

        // Save the updated city to the database
        await existingCity.save();

        res.status(200).json({ message: 'City updated successfully', data: existingCity });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request', error });
    }
}


const deleteCities = async (req, res) => {
    logger.info('INFO -> DELETING CITY API CALLED');
    try {
        const { id } = req.params; // Assuming you have an 'id' parameter in the route

        // Find the city by ID
        const existingCity = await City.findByPk(id);

        if (!existingCity) {
            return res.status(404).json({ message: 'City not found' });
        }

        // Delete the city from the database
        await existingCity.destroy();

        res.status(200).json({ message: 'City deleted successfully' });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request', error });
    }
}


module.exports = {
    addCities,
    getCities,
    updateCities,
    deleteCities
}