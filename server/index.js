const express = require(`express`);
const path = require(`path`);
const { connectDb } = require(`./db/index`);
const { setup: setupRealtime } = require(`./realtime`);

async function main() {
    try {
        await connectDb();
    } catch (e) {
        console.log(`Error connecting to database.`, e);
        process.exit(1);
    }

    const app = await setupRealtime();
    app.use(express.static(path.join(__dirname, `public`)));

    console.log(`Server up and running.`);
}

main();