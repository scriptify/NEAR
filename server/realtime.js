const app = require(`express`)();
const server = require(`http`).Server(app);
const io = require(`socket.io`)(server);
const request = require(`request`);

const PORT = process.env.PORT || 3001;

const { User } = require(`./db/models/index`);

server.listen(PORT);

let sockets = []; // Array holding sockets associated with userIds

function getRedirectUrl(url) {
    return new Promise((resolve) => {
        request.get(url, (err, res) => {
            resolve(res.request.uri.href);
        });
    });
}

async function findNear({ position, socket, userId }) {
    const user = await User.findOne({ _id: userId });
    if (!user) {
        return [];
    }

    // Update new position
    if (!(user.position.coordinates[0] === position[0] && user.position.coordinates[1] === position[1])) {
        user.position = {
            type: `Point`,
            coordinates: position
        };
        await user.save();
    }

    // Find people near user (radius: 500m)
    const users = await User.find({
        position: {
            $near: {
                $geometry: {
                    type: `Point`,
                    coordinates: [ user.position.coordinates[0], user.position.coordinates[1] ]
                },
                $maxDistance: 500,
                $minDistance: 0
            }
        }
    });

    const usersToEmit = users.map(({ _id, displayName, profilePictureUrl, gender, message }) => ({ _id, displayName, profilePictureUrl, gender, message }));

    socket.emit(`found-near`, usersToEmit);

}

async function setup() {
    // Delete all users on startup
    await User.remove({});

    io.on(`connection`, (socket) => {

        socket.on(`login`, async ({ displayName, position, gender, message }) => {
            const randomPictureUrl = `https://source.unsplash.com/random/800x800/?${gender}`;
            const profilePictureUrl = await getRedirectUrl(randomPictureUrl);

            const newUser = new User({
                profilePictureUrl,
                displayName,
                position: {
                    type: `Point`,
                    coordinates: position
                },
                gender,
                message
            });

            const { _id: userId } = await newUser.save();

            sockets.push({
                userId,
                socket
            });

            socket.emit(`logged-in`, userId);
    
            socket.on(`delete`, async () => {
                // Delete user
                await User.remove({ _id: newUser._id });
                sockets = sockets.filter(u => u.userId !== userId);
            });

            socket.on(`disconnect`, async () => {
                // Delete user
                await User.remove({ _id: userId });
                console.log(`DELETE`, userId);
                sockets = sockets.filter(u => u.userId !== userId);
            });
    
            socket.on(`find-near`, async (newPosition) => {
                await findNear({ position: newPosition, socket, userId });
            });

            socket.on(`ask-user`, async (userToAskId) => {
                // Ask user to have a chat
                // Find socket of that user
                const found = sockets.find(u => u.userId.equals(userToAskId));
                if (!found) {
                    socket.emit(`user-not-found`);
                    return;
                }
                const { socket: userToAskSocket } = found;
                // Notify that user that she got a request
                userToAskSocket.emit(`chat-request`, userId);
                // If she accepts the request with that id...
                userToAskSocket.once(`request-accepted`, (uId) => {
                    if (userId.equals(uId)) {
                        // ...send an event to the requester
                        socket.emit(`request-accepted`, uId);
                    }
                });

                userToAskSocket.once(`request-denied`, (uId) => {
                    if (userId.equals(uId)) {
                        socket.emit(`request-denied`, uId);
                    }
                });
            });

            socket.on(`send-chat-message`, ({ userId, message }) => {
                const found = sockets.find(u => u.userId.equals(userId));
                if (!found)
                    return;
                const { socket: socketToSendMsg } = found;
                socketToSendMsg.emit(`chat-message`, message);
            });

            await findNear({ position, socket, userId });
        });

    });

    return app;
}

module.exports = {
    setup
};