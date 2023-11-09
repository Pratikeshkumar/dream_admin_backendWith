// add countries
// get countries
// update countires
// delelte cointires

const logger = require('../../utils/logger')
const { Country } = require('../../models')

// const addCountries = async (req, res) => {
//     logger.info('INFO -> ADDING COUNTRIES API CALLED');
//     try {
//         const {
//             name,
//             iso3,
//             short_name,
//             phonecode,
//             capital,
//             currency,
//             native,
//             region,
//             subregion,
//             emoji,
//             emojiU,
//             flag,
//             wikiDataId,
//             active
//         } = req.body;
//         console.log(req.body)

//         // Create a new country
//         const newCountry = await Country.create({
//             name,
//             iso3,
//             short_name,
//             phonecode,
//             capital,
//             currency,
//             native,
//             region,
//             subregion,
//             emoji,
//             emojiU,
//             flag,
//             wikiDataId,
//             active,
//         });

//         res.status(201).json({ message: 'Country added successfully', data: newCountry });
//     } catch (error) {
//         logger.error(error);
//         res.status(500).json({ message: 'Error generated while processing your request', error });
//     }
// }
// const Country = require('../models/Country');

const addCountries = async (req, res) => {
  try {
    const { region, countries } = req.body;

    let countriesArray = countries; // Initialize with the input data

    // Check if countries is a string; if so, split it into an array
    if (typeof countries === 'string') {
      countriesArray = countries.split(',').map(country => country.trim());
    }

    // Create a new country record
    const newCountry = await Country.create({
      region,
      countries: countriesArray,
    });

    res.status(201).json({ message: 'Country added successfully', data: newCountry });
  } catch (error) {
    console.error('Error adding country:', error);
    res.status(500).json({ message: 'Error adding country', error });
  }
};

  


// const getCountries = async (req, res) => {
//     logger.info('INFO -> GETTING COUNTRIES API CALLED');
//     try {
//         const { page = 1, perPage = 10} = req.query;

//         // Calculate the offset based on the page and perPage values
//         const offset = (page - 1) * perPage;

//         // Retrieve countries with pagination
//         const countries = await Country.findAndCountAll({
//             limit: perPage,
//             offset,
//         });

//         res.status(200).json({
//             message: 'Countries retrieved successfully',
//             data: countries.rows,
//             total: countries.count,
//         });
//     } catch (error) {
//         logger.error(error);
//         res.status(500).json({ message: 'Error generated while processing your request', error });
//     }
// }
const getCountries = async (req, res) => {
    logger.info('INFO -> GETTING COUNTRIES API CALLED');
    try {
        // Retrieve all countries without pagination
        const countries = await Country.findAll();

        res.status(200).json({
            message: 'Countries retrieved successfully',
            data: countries,
            total: countries.length,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request', error });
    }
}

// const updateCountries = async (req, res) => {
//     logger.info('INFO -> UPDATING COUNTRY API CALLED');
//     try {
//         const { id } = req.params; // Assuming you have an 'id' parameter in the route
//         const updatedFields = req.body;

//         // Find the country by ID
//         const existingCountry = await Country.findByPk(id);

//         if (!existingCountry) {
//             return res.status(404).json({ message: 'Country not found' });
//         }

//         // Update the country properties
//         Object.assign(existingCountry, updatedFields);

//         // Save the updated country to the database
//         await existingCountry.save();

//         res.status(200).json({ message: 'Country updated successfully', data: existingCountry });
//     } catch (error) {
//         logger.error(error);
//         res.status(500).json({ message: 'Error generated while processing your request', error });
//     }
// }
const updateCountries = async (req, res) => {
    logger.info('INFO -> UPDATING COUNTRY API CALLED');
    try {
        const { id } = req.params; // Assuming you have an 'id' parameter in the route
        const updatedFields = req.body;

        // Find the country by ID
        const existingCountry = await Country.findByPk(id);``

        if (!existingCountry) {
            return res.status(404).json({ error: 'Country not found' });
        }

        // Validate and update the country properties
        // Example: You can add validation logic here based on your requirements

        // Update the country properties
        Object.assign(existingCountry, updatedFields);

        // Save the updated country to the database within a transaction
        await sequelize.transaction(async (transaction) => {
            await existingCountry.save({ transaction });
        });

        res.status(200).json({ message: 'Country updated successfully', data: existingCountry });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Error generated while processing your request', message: error.message });
    }
};



const deleteCountries = async (req, res) => {
    logger.info('INFO -> DELETING COUNTRY API CALLED');
    try {
        const { id } = req.params; // Assuming you have an 'id' parameter in the route

        // Find the country by ID
        const existingCountry = await Country.findByPk(id);

        if (!existingCountry) {
            return res.status(404).json({ message: 'Country not found' });
        }

        // Delete the country from the database
        await existingCountry.destroy();

        res.status(200).json({ message: 'Country deleted successfully' });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request', error });
    }
}



module.exports = {
    addCountries,
    getCountries,
    updateCountries,
    deleteCountries
}
