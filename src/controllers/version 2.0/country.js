const logger = require("../../utils/logger")
const { Country } = require('../../models')
const { City } = require('../../models')
const errorHandling = require("../../utils/errorObject")



const getAllcountries = async (req, res, next) => {
    logger.info('INFO -> GETTING ALL COUNTRY DETAILS API CALLED')
    try {
        let country = await Country.findAll({})
        if (!country) throw errorHandling('there is not no country in the db')
        country = JSON.parse(JSON.stringify(country))
        res.status(200).json({
            message: 'successfull',
            payload: country
        })
    } catch (error) {
        logger.error(error)
        res.status(500).json({ message: 'error while geting the country details, Please try again after sometime' })
    }
}




const getCitiesbyCode = async (req, res, next) => {
    logger.info('INFO -> GETTING CITIES BY COUNTRY CODE API CALLED')
    try {
        const { country_code } = req.params;
       
        let cities = await City.findAll({
            where: { country_code }
        })
        if (!cities) throw errorHandling('not found')
        cities = JSON.parse(JSON.stringify(cities))
        res.status(200).json({
            message: 'successfull',
            payload: cities
        })
    } catch (error) {
        logger.error(error)
        res.status(500).json({ message: 'error while getting the cities details, Please try again after some time' })
    }
}


module.exports = {
    getAllcountries,
    getCitiesbyCode
}

