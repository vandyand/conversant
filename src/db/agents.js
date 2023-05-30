function createAgentsTable(DB) {
    return new Promise((resolve, reject) => {
        DB.run(
            `CREATE TABLE IF NOT EXISTS agents (
                id TEXT PRIMARY KEY NOT NULL,
                ExtraversionIntroversion INTEGER NOT NULL,
                SensingIntuition INTEGER NOT NULL,
                ThinkingFeeling INTEGER NOT NULL,
                JudgingPerceiving INTEGER NOT NULL
              );`,
            (err) => {
                if (err) {
                    console.error("Error creating messages table:", err);
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
}

function loadAgents(DB) {
    return new Promise((resolve, reject) => {
        DB.all("SELECT * FROM agents", (err, rows) => {
            if (err) {
                console.error("Error loading agents from database:", err);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function saveAgent(agent, DB) {
    return new Promise((resolve, reject) => {
        const { id, ExtraversionIntroversion, SensingIntuition, ThinkingFeeling, JudgingPerceiving } = agent;
        DB.run(
            "INSERT INTO agents (id, ExtraversionIntroversion, SensingIntuition, ThinkingFeeling, JudgingPerceiving) VALUES (?, ?, ?, ?, ?)",
            [id, ExtraversionIntroversion, SensingIntuition, ThinkingFeeling, JudgingPerceiving],
            (err) => {
                if (err) {
                    console.error("Error saving message to database:", err);
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
}

module.exports = {
    saveAgent,
    createAgentsTable,
    loadAgents,
};

// async function saveMessagesToDB() {
//     try {
//         for (const message of messages) {
//             await saveMessage(message);
//         }
//     } catch (error) {
//         console.error("Error saving messages to database:", error);
//     }
// }

// export * from './db.js';