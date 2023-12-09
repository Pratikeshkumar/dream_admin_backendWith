const Redis = require('ioredis')

const redis = new Redis()

const testRedisConnection = async () => {
    redis.ping()
        .then(() => {
            console.log('Successfully connected the redis')
        })
        .catch((err) => {
            console.log('Error generating while connecting to redis')
        })
}


module.exports = {
    redis,
    testRedisConnection
}