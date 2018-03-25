const app = require(`express`)();
const server = require(`http`).Server(app);
const io = require(`socket.io`)(server);
const request = require(`request`);

const { User } = require(`./db/models/index`);

server.listen(3001);

function getRedirectUrl(url) {
    return new Promise((resolve) => {
        request.get(url, (err, res) => {
            resolve(res.request.uri.href);
        });
    });
}

async function findNear({ position, socket, user }) {
    // Update new position
    user.position.coordinates = position;
    await user.save();

    // Find people near newUser (radius: 500m)
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

    const usersToEmit = users.map(({ _id, displayName, profilePictureUrl, gender }) => ({ _id, displayName, profilePictureUrl, gender }));

    socket.emit(`found-near`, usersToEmit);

}

function setup() {
    io.on(`connection`, (socket) => {

        socket.on(`login`, async ({ displayName, position, gender }) => {
            const randomPictureUrl = `https://source.unsplash.com/random/800x800/?${gender}`;
            const profilePictureUrl = await getRedirectUrl(randomPictureUrl);

            const newUser = new User({
                profilePictureUrl,
                displayName,
                position: {
                    type: `Point`,
                    coordinates: position
                },
                gender
            });
    
            socket.emit(`logged-in`);
    
            socket.on(`delete`, async () => {
                // Delete user
                await User.remove({ _id: newUser._id });
            });

            socket.on(`disconnect`, async () => {
                // Delete user
                await User.remove({ _id: newUser._id });
            });
    
            socket.on(`find-near`, async (newPosition) => {
                await findNear({ position: newPosition, socket, user: newUser });
            });

            await findNear({ position, socket, user: newUser });
        });

    });
}

module.exports = {
    setup
};