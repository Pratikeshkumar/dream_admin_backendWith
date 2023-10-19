// add gifts
// delete gifts
// edit gifts
// get gifts
const {Gift} = require('../../models')

const getGifts = async (req, res) => {
  try {
    const gifts = await Gift.findAll(); // Assuming Sequelize model Hobbies is set up correctly

    res.status(200).json({
      message: "Gifts retrieved successfully",
      data: gifts,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while processing your request", error });
  }
};
module.exports = {
  getGifts,
};
