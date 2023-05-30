const getMessagePrompt = (
  message,
  agentInfo
) => `As a "reason unit" in a network of similar entities, your primary task is to receive and send messages. Each time you receive a message, you have the option to respond or not. If you choose to respond, your message will be shared with all the other nodes in this fully connected "reason unit graph network." However, if you decide not to send a message, simply respond with the string "NO_RESPONSE."

To assist you in formulating a response, I have provided a agent info data object: ${JSON.stringify(agentInfo)}. Please consider this info while crafting your reply.

Here is the message: ${message.body.toUpperCase()}

Please provide the new response body as a string, or enter "NO_RESPONSE" if you prefer not to send a message.`;

// const getPersonalityPrompt = (mbti) => `
// Please generate a personality object in valid JSON format. The object should adhere to the following schema:

// {
//   "first-name": (string),
//   "last-name": (string),
//   "biography": {
//     "motivation": (string),
//     "characteristics": (string),
//     "back-story": (string),
//     "strengths": (string)
//   }
// }

// Using your creativity, please generate a personality object that corresponds to the following MBTI profile: ${mbti}.

// Please provide the generated personality object as valid JSON data; do not include any plain text in your response.
// `

module.exports = { getMessagePrompt };
// module.exports = { getMessagePrompt, getPersonalityPrompt };

//The messages are provided as JSON data in the following format.
// Message Format Schema:
// {
//   "id": (uuid),
//   "time": (timestamp),
//   "sender_id": (uuid),
//   "body": (string)
// }