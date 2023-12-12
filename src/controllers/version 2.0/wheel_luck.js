// purchasing wheel luck : TODO 
// getting wheel luck    : TODO

const { DataTypes } = require('sequelize');
const { WheelLuck, User } = require('../../models')
const logger = require('../../utils/logger')
const generateUniqueNumber = require('../../utils/unique12DigitGenerator')
const { Op } = require('sequelize')




const purchaseWheelLuck = async (req, res) => {
    logger.info('PURCHASE WHEEL LUCK API CALLED')
    try {
        const { id } = req.userData;
        const {
            no_of_tickets,
            diamonds,
        } = req.body;
        const ticket = []

        for (let i = 0; i < no_of_tickets; i++) {
            const ticket_no = generateUniqueNumber()
            ticket.push(ticket_no)
        }

        let user = await User.findOne({ where: { id } })
        if (user.wallet < diamonds) {
            return res.status(400).json({ success: false, message: 'Not enough diamonds' })
        }
        user.wallet = user.wallet - diamonds
        await user.save()

        const wheel_luck = await WheelLuck.create({
            user_id: id,
            no_of_tickets,
            diamonds,
            ticket_no: ticket
        })
        return res.status(200).json({ success: true, message: 'Wheel luck purchased successfully', data: wheel_luck })
    } catch (error) {
        logger.error('Error in purchaseWheelLuck API while purchasing wheel luck: ', error)
        return res.status(500).json({ success: false, message: 'Something went wrong', error: error.message })
    }
}


const getWheelLuck = async (req, res) => {
    logger.info('GET WHEEL LUCK API CALLED')
    try {
        const { id } = req.userData;
        const currentDate = new Date();
       
        let DateFromStartingMonths = new Date();
        DateFromStartingMonths.setDate(1);


        let wheel_luck = await WheelLuck.findAll({
            where: {
                user_id: id,
                createdAt: {
                    [Op.gte]: DateFromStartingMonths,
                    [Op.lte]: currentDate
                }
            }
        })
        wheel_luck = wheel_luck.map((item) => {
            item.ticket_no = JSON.parse(item.ticket_no.split(','))
            return item;
        });

        return res.status(200).json({ success: true, message: 'Wheel luck fetched successfully', data: wheel_luck });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Something went wrong', error: error.message });
    }
}



module.exports = {
    purchaseWheelLuck,
    getWheelLuck
};