const uuid = require('uuid')
const { redis } = require('../../config/redis')
const { promisify } = require('util')
const { User } = require('../../models')
const logger = require('../../utils/logger')



const live_stream_view_handler = async (socket, io) => {

    socket.on('owner_joining_the_room', async (data) => {
        let roomId = `live_stream:${data?.id}`;
        socket.join(roomId)
        console.log('roomId', roomId)
    })




    socket.on('live_stream_view_join', async (data) => {
        let roomId = `live_stream:${data?.live_stream_id}`;
        socket.join(roomId)
        data.viewers_id = uuid.v4();
        data.createdAt = new Date()
        let active_data = JSON.stringify(data)
        const live_stream_active_view_key = `live_stream_active_view:${data.live_stream_id}`
        const join_request_key = `live_join_request_accepted:${data?.live_stream_id}`;
        const result = await redis.lrange(live_stream_active_view_key, 0, -1)
        if (!result?.includes(data?.user_id)) {
            const live_stream_view_key = `live_stream_view:${data?.live_stream_id}`
            await redis.lpush(live_stream_view_key, active_data)
            await redis.lpush(live_stream_active_view_key, data?.user_id)
            let guests = await redis.lrange(join_request_key, 0, -1)
            guests = guests.map(guest => JSON.parse(guest));
            const clientsInRoom = io.sockets.adapter.rooms.get(roomId)?.size;
            io.to(roomId).emit('live_stream_active_view', { result, clientsInRoom, data, guests })
        }

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

const live_stream_share_handler = async (socket, io) => {
    socket.on('live_stream_share_handler', async (data) => {
        let roomId = `live_stream:${data?.live_stream_id}`;
        data.live_share_id = uuid.v4()
        data.timestamp = new Date()
        const share_data = JSON.stringify(data)
        const key = `live_stream_share:${data?.live_stream_id}`
        await redis.lpush(key, share_data)
        io.to(roomId).emit('live_stream_share', data)
    })
}



const live_join_request_handler = async (socket, io) => {

    socket.on('live_join_request_handler', async (data) => {
        logger.info('INFO -> JOIN REQUEST HANDLER API CALLED');
        let roomId = `live_stream:${data?.live_stream_id}`;

        console.log('roomId', roomId)
        data.live_join_request_id = uuid.v4();
        data.timestamp = new Date();

        // Check if user details are in the cache
        const userKey = `user:${data.user_id}`;
        let user = await redis.get(userKey);

        if (!user) {
            // Retrieve user details using user_id
            user = await User.findByPk(data?.user_id, {
                attributes: ['id', 'username', 'nickname', 'profile_pic'],
            });

            // Cache user details using Redis
            const user_data = JSON.stringify(user);
            await redis.set(userKey, user_data);
        } else {
            user = JSON.parse(user);
        }

        const join_request_data = JSON.stringify(data);
        const join_request_key = `live_join_request:${data?.live_stream_id}`;
        await redis.lpush(join_request_key, join_request_data);
        // console.log({...data, user})
        io.to(roomId).emit('live_join_request_notification', { ...data, user });
    });
};


const live_stream_join_request_accept_handler = async (socket, io) => {
    console.log('new data are displaying here for many things')
    socket.on('live_stream_join_request_accept_handler', async (data) => {
        let roomId = `live_stream:${data?.live_stream_id}`;
        const join_request_key = `live_join_request_accepted:${data?.live_stream_id}`;
        const join_request_data = JSON.stringify(data);
        await redis.lpush(join_request_key, join_request_data);
        io.to(roomId).emit('live_stream_join_request_accept', data);
    });
}






module.exports = {
    live_stream_view_handler,
    live_stream_like_handler,
    live_stream_rose_handler,
    live_stream_comment_handler,
    live_stream_gift_handler,
    live_stream_share_handler,
    live_join_request_handler,
    live_stream_join_request_accept_handler
}