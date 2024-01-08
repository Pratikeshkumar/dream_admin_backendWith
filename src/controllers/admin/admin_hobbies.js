// add hobbies
// get hobbies
// update hobbies
// delete hobbies

const logger = require('../../utils/logger')
const {Hobbies} = require('../../models')



const addHobbies = async (req, res) => {
    logger.info('INFO -> ADDING HOBBIES API CALLED');
    try {
        const { name, category } = req.body;
           console.log(name,"name")
        if (!name || !category) {
            return res.status(400).json({ message: 'Name and category are required' });
        }

        // Create a new hobby

        const newHobby = await Hobbies.create({
            name,
            category,
        });
        console.log(newHobby,"newHobby")

        res.status(201).json({ message: 'Hobby added successfully', data: newHobby });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request', error });
    }
}


// const getHobbies = async (req, res) => {
//     logger.info('INFO -> GETTING HOBBIES API CALLED');
//     try {
//         const { page = 1, perPage = 15 } = req.query;

//         // Calculate the offset based on the page and perPage values
//         const offset = (page - 1) * perPage;

//         // Retrieve hobbies with pagination
//         const hobbies = await Hobbies.findAndCountAll({
//             limit: perPage,
//             offset,
//         });

//         res.status(200).json({
//             message: 'Hobbies retrieved successfully',
//             data: hobbies.rows,
//             total: hobbies.count,
//         });
//     } catch (error) {
//         logger.error(error);
//         res.status(500).json({ message: 'Error generated while processing your request', error });
//     }
// }
const getHobbies = async (req, res) => {
    try {
      const hobbies = await Hobbies.findAll(); // Assuming Sequelize model Hobbies is set up correctly
  
      res.status(200).json({
        message: 'Hobbies retrieved successfully',
        data: hobbies,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error while processing your request', error });
    }
  };
  
  
  
  
  
  


const updateHobbies = async (req, res) => {
    logger.info('INFO -> UPDATING HOBBY API CALLED');
    try {
        const { id } = req.params; // Assuming you have an 'id' parameter in the route
        const { name, category } = req.body;

        // Find the hobby by ID
        const existingHobby = await Hobbies.findByPk(id);

        if (!existingHobby) {
            return res.status(404).json({ message: 'Hobby not found' });
        }

        // Update the hobby properties
        existingHobby.name = name;
        existingHobby.category = category;

        // Save the updated hobby to the database
        await existingHobby.save();

        res.status(200).json({ message: 'Hobby updated successfully', data: existingHobby });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request', error });
    }
}


const deleteHobbies = async (req, res) => {
    logger.info('INFO -> DELETING HOBBY API CALLED');
    try {
        const { id } = req.params; // Assuming you have an 'id' parameter in the route

        // Find the hobby by ID
        const existingHobby = await Hobbies.findByPk(id);

        if (!existingHobby) {
            return res.status(404).json({ message: 'Hobby not found' });
        }

        // Delete the hobby from the database
        await existingHobby.destroy();

        res.status(200).json({ message: 'Hobby deleted successfully' });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error generated while processing your request', error });
    }
}


module.exports = {
    addHobbies,
    getHobbies,
    updateHobbies,
    deleteHobbies
}