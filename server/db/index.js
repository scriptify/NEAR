const mongoose = require(`mongoose`);

function connectDb() {
    return new Promise((resolve, reject) => {
        const dbUrl = `mongodb://app:findpeople*_near_you2018@ds223019.mlab.com:23019/near`;
        mongoose.connect(dbUrl);
        const connection = mongoose.connection;
        connection.on(`error`, reject);
        connection.on(`open`, resolve);
    });
}

module.exports = {
    connectDb
}