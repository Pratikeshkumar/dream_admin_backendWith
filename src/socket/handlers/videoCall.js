

module.exports = (socket, io) => {

    socket.on('join-room', (data) => {
        socket.join(data.room)
        console.log('One People Joined In Room Id', data.room)
        io.to(data.room).emit('join-room', {
            message: 'One People Joined In Room Id',
            room: data.room
        })
    })



    socket.on("candidate", (data) => {
        console.log(data.from, 'Send thier Ice candidate');
        io.to(data.room).emit('candidate', {
            type: 'candidate',
            from: data.from,
            to: data.to,
            room: data.room,
            candidate: data.candidate,
        })
    })



    socket.on("offer", (data) => {
        console.log(data.from, 'Send thier offer ');
        io.to(data.room).emit('offer', {
            type: 'offer',
            from: data.from,
            to: data.to,
            room: data.room,
            sdp: data.sdp,
        })
    })


    socket.on("answer", (data) => {
        console.log(data.from, 'Send thier offer ');
        io.to(data.room).emit('answer', {
            type: 'answer',
            from: data.from,
            to: data.to,
            room: data.room,
            sdp: data.sdp,
        })
    })


};
