const { Kafka, logLevel } = require('kafkajs')


const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
    logLevel: logLevel.NOTHING
})

const admin = kafka.admin()
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'dream_user' })


module.exports = {
    kafka,
    producer,
    consumer,
    admin
}

