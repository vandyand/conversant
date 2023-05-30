
function createMessagesTable(DB) {
    return new Promise((resolve, reject) => {
        DB.run(
            `CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY NOT NULL,
          time INTEGER NOT NULL,
          sender_id INTEGER NOT NULL,
          body TEXT NOT NULL
        )`,
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

function loadMessages(DB) {
    return new Promise((resolve, reject) => {
        DB.all("SELECT * FROM messages", (err, rows) => {
            if (err) {
                console.error("Error loading messages from database:", err);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function saveMessage(message, DB) {
    return new Promise((resolve, reject) => {
        const { id, time, sender_id, body } = message;
        DB.run(
            "INSERT INTO messages (id, time, sender_id, body) VALUES (?, ?, ?, ?)",
            [id, time, sender_id, body],
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
    saveMessage,
    createMessagesTable,
    loadMessages,
};
