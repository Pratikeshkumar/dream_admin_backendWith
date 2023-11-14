const uuid = require('uuid')
const { redis } = require('../../config/redis')
const { promisify } = require('util')




const live_stream_view_handler = async (socket, io) => {

    socket.on('live_stream_view_join', async (data) => {
        let roomId = `live_stream:${data?.live_stream_id}`;
        socket.join(roomId)
        data.viewers_id = uuid.v4();
        data.createdAt = new Date()
        let active_data = JSON.stringify(data)
        const live_stream_view_key = `live_stream_view:${data?.live_stream_id}`
        await redis.lpush(live_stream_view_key, active_data)
        const live_stream_active_view_key = `live_stream_active_view:${data.live_stream_id}`
        await redis.lpush(live_stream_active_view_key, data?.user_id)
        const result = await redis.lrange(live_stream_active_view_key, 0, -1)
        const clientsInRoom = io.sockets.adapter.rooms.get(roomId)?.size;
        io.to(roomId).emit('live_stream_active_view', { result, clientsInRoom })
    })



    socket.on('live_stream_view_leave', async (data) => {
        let roomId = `live_stream:${data?.live_stream_id}`;
        socket.leave(roomId)
        const live_stream_active_view_key = `live_stream_active_view:${data.live_stream_id}`
        await redis.lrem(live_stream_active_view_key, 0, data?.user_id);
        const result = await redis.lrange(live_stream_active_view_key, 0, -1)
        const clientsInRoom = io.sockets.adapter.rooms.get(roomId)?.size;
        io.to(roomId).emit('live_stream_active_view', { result, clientsInRoom })
    })

}

const live_stream_like_handler = async (socket, io) => {
    socket.on('live_stream_like_handler', async (data) => {
        let roomId = `live_stream:${data?.live_stream_id}`;
        data.like_id = uuid.v4(),
            data.timestamp = new Date()
        const like_data = JSON.stringify(data)
        const key = `live_stream_like:${data?.live_stream_id}`
        await redis.lpush(key, like_data)
        io.to(roomId).emit('live_stream_like', data)
    })

}


const live_stream_rose_handler = async (socket, io) => {
    socket.on('live_stream_rose_handler', async (data) => {
        let roomId = `live_stream:${data?.live_stream_id}`;
        data.live_rose_id = uuid.v4()
        data.timestamp = new Date()
        const rose_data = JSON.stringify(data)
        const key = `live_stream_rose:${data?.live_stream_id}`
        await redis.lpush(key, rose_data)
        io.to(roomId).emit(`live_stream_rose`, data)

    })

}

const live_stream_gift_handler = async (socket, io) => {
    socket.on('live_stream_gift_handler', async (data) => {
        let roomId = `live_stream:${data?.live_stream_id}`;
        data.live_gift_id = uuid.v4()
        data.timestamp = new Date()
        const gift_data = JSON.stringify(data)
        const key = `live_stream_gift:${data?.live_stream_id}`
        await redis.lpush(key, gift_data)
        io.to(roomId).emit('live_stream_gift', data)
    })

}


const live_stream_comment_handler = async (socket, io) => {
    socket.on('live_stream_comment_handler', async (data) => {
        let roomId = `live_stream:${data?.live_stream_id}`;
        data.live_comment_id = uuid.v4()
        data.timestamp = new Date()
        const comment_data = JSON.stringify(data)
        const key = `live_stream_comment:${data?.live_stream_id}`
        await redis.lpush(key, comment_data)
        io.to(roomId).emit('live_stream_comment', data)
    })

}





module.exports = {
    live_stream_view_handler,
    live_stream_like_handler,
    live_stream_rose_handler,
    live_stream_comment_handler,
    live_stream_gift_handler
}