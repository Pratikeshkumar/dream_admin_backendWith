const uuid = require('uuid')
const { redis } = require('../../config/redis')
const { promisify } = require('util')




const live_stream_view_handler = async (socket, io) => {

    socket.on('live_stream_view_join', async (data) => {
        let roomId = `live_stream_view:${data?.live_stream_id}`;
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
        let roomId = `live_stream_view:${data?.live_stream_id}`;
        socket.leave(roomId)
        const live_stream_active_view_key = `live_stream_active_view:${data.live_stream_id}`
        await redis.lrem(live_stream_active_view_key, 0, data?.user_id);
        const result = await redis.lrange(live_stream_active_view_key, 0, -1)
        const clientsInRoom = io.sockets.adapter.rooms.get(roomId)?.size;
        io.to(roomId).emit('live_stream_active_view', { result, clientsInRoom })
    })





}





module.exports = {
    live_stream_view_handler
}