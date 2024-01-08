const logger = require("../../utils/logger")
require('dotenv').config()
const stripe = require('stripe')(process?.env?.STRIPE_KEY_SECRET)

const create_setup_intent = async (req, res) => {
    logger.info('INFO -> SETTINGUP PAYMENTS INTENT FOR STRIPE API CALLED')
    try {
        const { email, id } = req.userData;
        const { amount } = req.body;
        const customer = await stripe.customers.create({ email: email });
        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customer.id },
            { apiVersion: '2023-08-16' }
        );
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'USD',
            customer: customer.id,
            payment_method_types: ['card']
        });
        res.status(200).json({
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customer.id,
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
        });
    } catch (error) {
        logger.error(error)
        res.status(500).json({ message: 'error generated while creating intent for payments', error })
    }
}


module.exports = {
    create_setup_intent
}