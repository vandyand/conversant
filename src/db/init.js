const messages = require('./messages.js');
const agents = require('./agents.js');

async function initialize(DB) {
    console.log("initializeDatabase fn called *********************************\n");

    try {
        await messages.createMessagesTable(DB);
        await agents.createAgentsTable(DB);
        return "successfully initialized database";
    } catch (error) {
        console.error("Error initializing database:", error);
        return "failed to initialize database";
    }
}

module.exports = { initialize };