const app = require(`express`)();
const server = require(`http`).Server(app);
const io = require(`socket.io`)(server);

const { User } = require(`./db/models/index`);

server.listen(3001);

function setup() {
    io.on(`connection`, (socket) => {

        socket.on(`login`, async ({ displayName, position }) => {
            const newUser = new User({
                displayName,
                position: {
                    type: `Point`,
                    coordinates: position
                },
            });
    
            socket.emit(`logged-in`);
    
            socket.on(`delete`, async () => {
                // Delete user
                await User.remove({ _id: newUser._id });
            });
    
            socket.on(`find-near`, async (newPosition) => {
                // Update new position
                newUser.position.coordinates = newPosition;
                await newUser.save();

                // Find people near newUser (radius: 500m)
                const users = await User.find({
                    position: {
                        $near: {
                            $geometry: {
                                type: `Point`,
                                coordinates: [ newUser.position.coordinates[0], newUser.position.coordinates[1] ]
                            },
                            $maxDistance: 500,
                            $minDistance: 0
                        }
                    }
                });

                socket.emit(`found-near`, users.map(({ displayName, _id })  => { displayName, _id }));
    
            });
        });

    });
}

module.exports = {
    setup
};