
// add occupations
// get occupations
// update occupation
// delete occuaption

const logger = require('../../utils/logger')
const { Occupations } = require('../../models')



const addOccupations = async (req, res) => {
    logger.info('INFO -> ADDING OCCUPATIONS API CALLED');
    try {
        const industryData = req.body;


        // console.log(industryData)


        const occuaption = industryData[0]?.occupations?.map(item => ({ pr: 1, item: item?.name }))

        console.log(occuaption)




        // if (!industryData || !industryData.industry || !industryData.occupations || industryData.occupations.length === 0) {
        //     return res.status(400).json({ message: 'Invalid industry data' });
        // }

        // Create the parent occupation (industry)
        let newIndustry = await Occupations.create({
            name: industryData[0].industry,
        });


        newIndustry = JSON.parse(JSON.stringify(newIndustry))

        const parentId = newIndustry?.id;

        console.log('parentId', parentId)

        const occu = await Occupations.bulkCreate(industryData[0]?.occupations?.map(item => ({ name: item.name, parentId: parentId })))



        res.status(201).json({ message: 'Occupation added successfully' });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request', error });
    }
};









// const getOccupations = async (req, res) => {
//     logger.info('INFO -> GETTING OCCUPATIONS API CALLED');
//     try {
//         const { page = 1, perPage = 10 } = req.query;

//         // Calculate the offset based on the page and perPage values
//         const offset = (page - 1) * perPage;

//         // Retrieve all occupations, including nested ones, with pagination
//         const occupations = await Occupations.findAndCountAll({
//             include: [
//                 { model: Occupations, as: 'children' }, // Include nested occupations
//                 { model: User }, // Include associated user data if needed
//             ],
//             limit: perPage,
//             offset,
//         });

//         res.status(200).json({
//             message: 'Occupations retrieved successfully',
//             data: occupations.rows, // List of occupations
//             total: occupations.count, // Total count of occupations
//         });
//     } catch (error) {
//         logger.error(error);
//         res.status(500).json({ message: 'Error generated while processing your request', error });
//     }
// }
const getOccupations = async (req, res) => {
    logger.info('INFO -> GETTING OCCUPATIONS API CALLED');
    try {
        // Retrieve occupations from the database
        const occupations = await Occupations.findAll();

        // Check if any occupations were found
        if (!occupations || occupations.length === 0) {
            return res.status(404).json({ message: 'No occupations found' });
        }

        // Return the list of occupations
        res.status(200).json({ occupations });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request', error });
    }
};






const updateOccupation = async (req, res) => {
    logger.info('INFO -> UPDATING OCCUPATION API CALLED');
    try {
        const { id } = req.params; // Assuming you have an 'id' parameter in the route
        const { name, description, parentId } = req.body;

        // Find the occupation by ID
        const existingOccupation = await Occupations.findByPk(id);

        if (!existingOccupation) {
            return res.status(404).json({ message: 'Occupation not found' });
        }

        // Update the occupation properties
        existingOccupation.name = name;
        existingOccupation.description = description;
        existingOccupation.parentId = parentId;

        // Save the updated occupation to the database
        await existingOccupation.save();

        res.status(200).json({ message: 'Occupation updated successfully', data: existingOccupation });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request', error });
    }
}


const deleteOccupation = async (req, res) => {
    logger.info('INFO -> DELETING OCCUPATION API CALLED');
    try {
        const { id } = req.params; // Assuming you have an 'id' parameter in the route

        // Find the occupation by ID
        const existingOccupation = await Occupations.findByPk(id);

        if (!existingOccupation) {
            return res.status(404).json({ message: 'Occupation not found' });
        }

        // Delete the occupation from the database
        await existingOccupation.destroy();

        res.status(200).json({ message: 'Occupation deleted successfully' });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request', error });
    }
}


module.exports = {
    addOccupations,
    getOccupations,
    updateOccupation,
    deleteOccupation
}