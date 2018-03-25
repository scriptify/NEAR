const { connectDb } = require(`./db/index`);
const { setup: setupRealtime } = require(`./realtime`);

async function main() {
    try {
        await connectDb();
    } catch (e) {
        console.log(`Error connecting to database.`, e);
        process.exit(1);
    }

    setupRealtime();

    console.log(`Server up and running.`);
}

main();