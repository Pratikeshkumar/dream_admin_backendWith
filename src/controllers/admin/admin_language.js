// add language 
// get language 
// update langauge
// edit language


const logger = require('../../utils/logger')
const { Language } = require('../../models')


const addLanguage = async (req, res) => {
    logger.info('INFO -> LANGUAGE ADDING API CALLED');
    try {
        const { name, code } = req.body;
        console.log(req.body)

        // Check if the required fields are provided
        if (!name || !code) {
            return res.status(400).json({ message: 'Name and code are required fields' });
        }

        // Check if a language with the same code already exists
        const existingLanguage = await Language.findOne({ where: { code } });
        if (existingLanguage) {
            return res.status(409).json({ message: 'Language with the same code already exists' });
        }

        // Create a new language
        const newLanguage = await Language.create({ name, code });

        res.status(201).json({ message: 'Language added successfully', data: newLanguage });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing the request', error });
    }
}


const getLanguage = async (req, res) => {
    logger.info('INFO -> LANGUAGE ADDING API CALLED')
    try {

        const { page, perPage } = req.query;

        console.log(Number(page), Number(perPage))

        // Calculate the offset based on the page and perPage values
        const offset = (Number(page) - 1) * Number(perPage);

        // Query the database with pagination
        const languages = await Language.findAll({
            limit: Number(perPage),
            offset,
        });

        // You can also retrieve the total count of languages for pagination
        const totalCount = await Language.count();

        res.status(200).json({
            message: 'Languages retrieved successfully',
            data: languages,
            total: totalCount,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing the request', error });
}
}




const updateLanguage = async (req, res) => {
    logger.info('INFO -> LANGUAGE UPDATE API CALLED');
    try {
        const { id } = req.params; // Assuming you have an 'id' parameter in the route
        const { name, code } = req.body;

        // Check if the language with the specified ID exists
        const existingLanguage = await Language.findByPk(id);

        if (!existingLanguage) {
            return res.status(404).json({ message: 'Language not found' });
        }

        // Update the language properties
        existingLanguage.name = name;
        existingLanguage.code = code;

        // Save the updated language to the database
        await existingLanguage.save();

        res.status(200).json({ message: 'Language updated successfully', data: existingLanguage });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing the request', error });
    }
}


const deleteLanguage = async (req, res) => {
    logger.info('INFO -> LANGUAGE DELETE API CALLED');
    try {
        const { id } = req.params; // Assuming you have an 'id' parameter in the route

        // Check if the language with the specified ID exists
        const existingLanguage = await Language.findByPk(id);

        if (!existingLanguage) {
            return res.status(404).json({ message: 'Language not found' });
        }

        // Delete the language from the database
        await existingLanguage.destroy();

        res.status(200).json({ message: 'Language deleted successfully' });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing the request', error });
    }
}



module.exports = {
    addLanguage,
    getLanguage,
    updateLanguage,
    deleteLanguage
}