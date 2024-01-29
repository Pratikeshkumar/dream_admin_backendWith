const {
    Transaction,
    Gift,
    MessageSubscription,
    CommentRose,
    UserFriendTransaction,
    UserAdminTransaction,
    SuperAdminUserTransaction,
    HighestUsersDiamondsData
} = require('../models')
const logger = require('../utils/logger')
const { Op } = require('sequelize')
const Sequelize = require('sequelize')




// 1.  Details of the user transaction
// [
//     {
//       id: 1,
//       user_id: 11,
//       payments_id: null,
//       link: 'https://api.sandbox.paypal.com/v2/checkout/orders/7R014421MH338552P',
//       country_code: 'US',
//       email_address: 'sb-bmk1326827699@personal.example.com',
//       first_name: 'John',
//       last_name: 'Doe',
//       payer_id: 'GLBT434H9TVAN',
//       account_id: 'GLBT434H9TVAN',
//       account_status: 'VERIFIED',
//       amount_value: '3.80',
//       currency_code: 'USD',
//       reference_id: 'default',
//       status: 'COMPLETED',
//       address_line_1: '1 Main St',
//       admin_area_1: 'CA',
//       admin_area_2: 'San Jose',
//       postal_code: '95131',
//       dimanond_value: 156,
//       createdAt: 2023-12-05T05:35:08.000Z,
//       updatedAt: 2023-12-05T05:35:08.000Z
//     }
//   ]


// 2. Details of the gift
// [
//     {
//       id: 1,
//       diamonds: 10,
//       video_id: 11,
//       reciever_id: 11,
//       sender_id: 9,
//       createdAt: 2023-08-07T03:45:32.000Z,
//       updatedAt: 2023-08-07T03:45:32.000Z
//     }
//   ]


// 3. Details of the message subscription
// [
//     {
//       id: 1,
//       reciever_id: 5,
//       sender_id: 9,
//       no_of_diamond: 5000,
//       no_of_allowed_messages: 'one month',
//       expire: 0,
//       createdAt: 2023-08-05T07:24:01.000Z,
//       updatedAt: 2023-08-05T07:24:01.000Z,
//       userId: null
//     }
//   ]


// 4. Details of the comment rose
// [
//     {
//       id: 1,
//       diamonds: 10,
//       video_id: 8,
//       reciever_id: 32,
//       sender_id: 11,
//       comment_id: 67,
//       createdAt: 2023-08-29T00:48:51.000Z,
//       updatedAt: 2023-08-29T00:48:51.000Z
//     }
//   ]


// 5. Details of the user friend transaction
// [
//     {
//       id: 1,
//       transaction_id: 'e6634019-5b3b-4921-a1a3-cacb65bc3ce3',
//       diamond_value: 10,
//       sender_id: 11,
//       receiver_id: 9,
//       transaction_type: 'debit',
//       status: 'completed',
//       timestamp: 2023-11-28T22:50:06.000Z,
//       createdAt: 2023-11-28T22:50:06.000Z,
//       updatedAt: 2023-11-28T22:50:06.000Z
//     }
//   ]


// 6. Details of the user admin transaction
// [
//     {
//       id: 1,
//       transaction_id: 'a41c4f5f-c8b9-4bbc-9c4d-db1d67c61884',
//       video_id: null,
//       diamond_value: 200,
//       sender_id: 4,
//       receiver_id: 15,
//       transaction_type: 'credit',
//       status: null,
//       timestamp: 2023-11-10T04:43:07.000Z,
//       createdAt: 2023-11-10T04:43:07.000Z,
//       updatedAt: 2023-11-10T04:43:07.000Z
//     }
//   ]


// 7. Details of the superadmin transaction
// [
//     {
//       id: 1,
//       diamond_value: 1000,
//       receiver_id: 4,
//       transaction_id: '9e82e5ce-ceee-4dd5-9c3a-37578a4ee40d',
//       diamond_debited: 0,
//       video_id: null,
//       timestamp: 2023-11-09T23:51:20.000Z,
//       createdAt: 2023-11-09T23:51:20.000Z,
//       updatedAt: 2023-11-09T23:51:20.000Z
//     }
//   ]




const getTimeToTimeHighestDiamondUser = async (beforeTimeInHours, type) => {
    logger.info('INFO -> CRON JOB RUNNING FOR GETTING TIME TO TIME HIGHEST DIAMOND USER')
    try {
        const currentTime = new Date();
        const beforeOneHourTime = new Date()
        beforeOneHourTime.setHours(beforeOneHourTime.getHours() - beforeTimeInHours)

        let transaction = [],
            gift = [],
            messageSubscription = [],
            commentRose = [],
            userFriendTransaction = [],
            userAdminTransaction = [],
            superAdminUserTransaction = []


        const giftSenderMap = new Map()
        const giftReceiverMap = new Map()




        transaction = await Transaction.findAll({
            where: {
                createdAt: {
                    [Op.between]: [beforeOneHourTime, currentTime]
                }
            },
            attributes: { include: [[Sequelize.fn('sum', Sequelize.col('dimanond_value')), 'total_diamond']] },
            group: ['user_id']
        })
        transaction = JSON.parse(JSON.stringify(transaction))

        transaction.forEach((transaction) => {
            if (giftReceiverMap.has(transaction.user_id)) {
                giftReceiverMap.set(transaction.user_id, giftReceiverMap.get(transaction.user_id) + Number(transaction.total_diamond))
            }
            else {
                giftReceiverMap.set(transaction.user_id, Number(transaction.total_diamond))
            }
        })



        gift = await Gift.findAll({
            where: {
                createdAt: {
                    [Op.between]: [beforeOneHourTime, currentTime]
                }
            },
            attributes: ['sender_id', 'reciever_id',
                [Sequelize.fn('sum', Sequelize.col('diamonds')), 'total_diamonds_received'],
                [Sequelize.fn('sum', Sequelize.col('diamonds')), 'total_diamonds_sent']],
            group: ['reciever_id', 'sender_id']
        })
        gift = JSON.parse(JSON.stringify(gift))


        gift.forEach((gift) => {
            if (giftSenderMap.has(gift.sender_id)) {
                giftSenderMap.set(gift.sender_id, giftSenderMap.get(gift.sender_id) + Number(gift.total_diamonds_sent))
            }
            else {
                giftSenderMap.set(gift.sender_id, Number(gift.total_diamonds_sent))
            };

            if (giftReceiverMap.has(gift.reciever_id)) {
                giftReceiverMap.set(gift.reciever_id, giftReceiverMap.get(gift.reciever_id) + Number(gift.total_diamonds_received))
            }
            else {
                giftReceiverMap.set(gift.reciever_id, Number(gift.total_diamonds_received))
            }
        })



        messageSubscription = await MessageSubscription.findAll({
            where: {
                createdAt: {
                    [Op.between]: [beforeOneHourTime, currentTime]
                }
            },
            attributes: ['sender_id', 'reciever_id',
                [Sequelize.fn('sum', Sequelize.col('no_of_diamond')), 'total_diamonds_sent'],
                [Sequelize.fn('sum', Sequelize.col('no_of_diamond')), 'total_diamonds_received']],
            group: ['reciever_id', 'sender_id']
        })
        messageSubscription = JSON.parse(JSON.stringify(messageSubscription))

        messageSubscription.forEach((messageSubscription) => {
            if (giftSenderMap.has(messageSubscription.sender_id)) {
                giftSenderMap.set(messageSubscription.sender_id, giftSenderMap.get(messageSubscription.sender_id) + Number(messageSubscription.total_diamonds_sent))
            }
            else {
                giftSenderMap.set(messageSubscription.sender_id, Number(messageSubscription.total_diamonds_sent))
            };

            if (giftReceiverMap.has(messageSubscription.reciever_id)) {
                giftReceiverMap.set(messageSubscription.reciever_id, giftReceiverMap.get(messageSubscription.reciever_id) + Number(messageSubscription.total_diamonds_received))
            }
            else {
                giftReceiverMap.set(messageSubscription.reciever_id, Number(messageSubscription.total_diamonds_received))
            }
        })



        commentRose = await CommentRose.findAll({
            where: {
                createdAt: {
                    [Op.between]: [beforeOneHourTime, currentTime]
                }
            },
            attributes: ['sender_id', 'reciever_id',
                [Sequelize.fn('sum', Sequelize.col('diamonds')), 'total_diamonds_sent'],
                [Sequelize.fn('sum', Sequelize.col('diamonds')), 'total_diamonds_received']],
            group: ['reciever_id', 'sender_id']
        })
        commentRose = JSON.parse(JSON.stringify(commentRose))

        commentRose.forEach((commentRose) => {
            if (giftSenderMap.has(commentRose.sender_id)) {
                giftSenderMap.set(commentRose.sender_id, giftSenderMap.get(commentRose.sender_id) + Number(commentRose.total_diamonds_sent))
            }
            else {
                giftSenderMap.set(commentRose.sender_id, Number(commentRose.total_diamonds_sent))
            };

            if (giftReceiverMap.has(commentRose.reciever_id)) {
                giftReceiverMap.set(commentRose.reciever_id, giftReceiverMap.get(commentRose.reciever_id) + Number(commentRose.total_diamonds_received))
            }
            else {
                giftReceiverMap.set(commentRose.reciever_id, Number(commentRose.total_diamonds_received))
            }
        }
        )




        userFriendTransaction = await UserFriendTransaction.findAll({
            where: {
                createdAt: {
                    [Op.between]: [beforeOneHourTime, currentTime]
                }
            },
            attributes: ['sender_id', 'receiver_id',
                [Sequelize.fn('sum', Sequelize.col('diamond_value')), 'total_diamonds_sent'],
                [Sequelize.fn('sum', Sequelize.col('diamond_value')), 'total_diamonds_received']],
            group: ['receiver_id', 'sender_id']
        })
        userFriendTransaction = JSON.parse(JSON.stringify(userFriendTransaction))

        userFriendTransaction.forEach((userFriendTransaction) => {
            if (giftSenderMap.has(userFriendTransaction.sender_id)) {
                giftSenderMap.set(userFriendTransaction.sender_id, giftSenderMap.get(userFriendTransaction.sender_id) + Number(userFriendTransaction.total_diamonds_sent))
            }
            else {
                giftSenderMap.set(userFriendTransaction.sender_id, Number(userFriendTransaction.total_diamonds_sent))
            };

            if (giftReceiverMap.has(userFriendTransaction.receiver_id)) {
                giftReceiverMap.set(userFriendTransaction.receiver_id, giftReceiverMap.get(userFriendTransaction.receiver_id) + Number(userFriendTransaction.total_diamonds_received))
            }
            else {
                giftReceiverMap.set(userFriendTransaction.receiver_id, Number(userFriendTransaction.total_diamonds_received))
            }
        }
        )



        userAdminTransaction = await UserAdminTransaction.findAll({
            where: {
                createdAt: {
                    [Op.between]: [beforeOneHourTime, currentTime]
                }
            },
            attributes: ['sender_id', 'receiver_id',
                [Sequelize.fn('sum', Sequelize.col('diamond_value')), 'total_diamonds_sent'],
                [Sequelize.fn('sum', Sequelize.col('diamond_value')), 'total_diamonds_received']],
            group: ['receiver_id', 'sender_id']
        })
        userAdminTransaction = JSON.parse(JSON.stringify(userAdminTransaction))

        userAdminTransaction.forEach((userAdminTransaction) => {
            if (giftReceiverMap.has(userAdminTransaction.receiver_id)) {
                giftReceiverMap.set(userAdminTransaction.receiver_id, giftReceiverMap.get(userAdminTransaction.receiver_id) + Number(userAdminTransaction.total_diamonds_received))
            }
            else {
                giftReceiverMap.set(userAdminTransaction.receiver_id, Number(userAdminTransaction.total_diamonds_received))
            }
        }
        )



        superAdminUserTransaction = await SuperAdminUserTransaction.findAll({
            where: {
                createdAt: {
                    [Op.between]: [beforeOneHourTime, currentTime]
                }
            },
            attributes: ['receiver_id',
                [Sequelize.fn('sum', Sequelize.col('diamond_value')), 'total_diamonds_received']],
            group: ['receiver_id']
        })
        superAdminUserTransaction = JSON.parse(JSON.stringify(superAdminUserTransaction))

        superAdminUserTransaction.forEach((superAdminUserTransaction) => {
            if (giftReceiverMap.has(superAdminUserTransaction.receiver_id)) {
                giftReceiverMap.set(superAdminUserTransaction.receiver_id, giftReceiverMap.get(superAdminUserTransaction.receiver_id) + Number(superAdminUserTransaction.total_diamonds_received))
            }
            else {
                giftReceiverMap.set(superAdminUserTransaction.receiver_id, Number(superAdminUserTransaction.total_diamonds_received))
            }
        }
        )


        // console.log('transaction', transaction)
        // console.log('gift', gift)
        // console.log('messageSubscription', messageSubscription)
        // console.log('commentRose', commentRose)
        // console.log('userFriendTransaction', userFriendTransaction)
        // console.log('userAdminTransaction', userAdminTransaction)

        const transactionSenderMap = [...giftSenderMap.entries()]
        await HighestUsersDiamondsData.create({
            type: type,
            data: transactionSenderMap,
            transaction_type: 'sender'
        })
        const transactionReceiverMap = [...giftReceiverMap.entries()]
        await HighestUsersDiamondsData.create({
            type: type,
            data: transactionReceiverMap,
            transaction_type: 'receiver'
        })


    } catch (error) {
        logger.error("Error generated while processing the request", error)
    }

}

module.exports = {
    getTimeToTimeHighestDiamondUser
}