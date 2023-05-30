require("dotenv").config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const prompt = require('./prompt.js');
const db = require('./db/index.js');
const sqlite3 = require('sqlite3').verbose();

const app = express();

const DB = new sqlite3.Database('./db.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

const trimmedRand = () => Math.floor(Math.random() * 100);
const getRandAgentInfo = () => {
  return {
    "id": crypto.randomUUID(),
    "ExtraversionIntroversion": trimmedRand(),
    "SensingIntuition": trimmedRand(),
    "ThinkingFeeling": trimmedRand(),
    "JudgingPerceiving": trimmedRand(),
  }
}

const postOpenAI = async (prompt, model = "gpt-3.5-turbo", temperature = 0.7) => {
  console.log("postOpenAI fn called. prompt(prop): ", prompt);
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: model,
        messages: [{ role: "user", content: prompt }],
        temperature: temperature,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    const rtn = response.data.choices[0].message.content.trim();
    console.log("postOpenAI rtn: ", rtn);
    return rtn;
  } catch (error) {
    console.error("Error generating text:", error);
    return null;
  }
};

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.post("/converse", async (req, res) => {
  console.log("/converse endpoint called");

  await db.initialize(DB);

  let agentInfo = await db.loadAgents(DB)[0];
  let message = await db.loadMessages(DB)[0];

  console.log("agentInfo BEFORE: ", agentInfo);
  console.log("message BEFORE: ", message);

  if (!agentInfo) {
    agentInfo = getRandAgentInfo();
    await db.saveAgent(agentInfo, DB);
  }

  if (!message) {
    messageBody = "testing testing 1 2 3. is this working? testing...";
    message = {
      id: crypto.randomUUID(),
      time: Date.now(),
      sender_id: 3000,
      body: messageBody,
    }
    db.saveMessage(message, DB);
  }

  console.log("agentInfo AFTER: ", agentInfo, typeof agentInfo);
  console.log("message AFTER: ", message);

  const newPrompt = prompt.getMessagePrompt(message, agentInfo);

  console.log("newPrompt: ", newPrompt);

  const newMessageBody = await postOpenAI(newPrompt);

  console.log("newMessageBody: ", newMessageBody);

  const newMessage =
    newMessageBody &&
    newMessageBody !== "NO_RESPONSE" && {
      id: crypto.randomUUID(),
      time: Date.now(),
      sender_id: 3000,
      body: newMessageBody,
    };

  console.log("newMessage:", newMessage);

  if (newMessage) {
    await db.saveMessage(newMessage, DB);
  }
  res.json({ message: newMessage });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong.");
});

const serverInstance = app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});

// Close server instance on termination
process.on("SIGINT", async () => {
  serverInstance.close();
  DB.close();
});