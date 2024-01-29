// withdrawel request
// const { withdrawal_request} = require("../../models");
const withdrawal_request = require('../../models/withdrawal_request')
const logger = require('../../utils/logger')
const errorHandler = require("../../utils/errorObject");
const sequelize = require('sequelize');
const { sq } = require('../../config/db');
const { s3 } = require('../../config/aws')
const { literal } = require('sequelize')
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');

const getwithdrawrequest = async (req, res) => {
    logger.info('INFO -> Get withdraw_money_info API CALLED');
    try {
        const getwithdrawinfo = await withdrawal_request.findAll()

        // console.log(getinfo,'getinfogetinfo')
        res.status(200).json(getwithdrawinfo)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }


}
module.exports =
{
    getwithdrawrequest
}