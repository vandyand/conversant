const init = require('./init.js');
const messages = require('./messages.js');
const agents = require('./agents.js');

module.exports = {
    ...init,
    ...messages,
    ...agents
}