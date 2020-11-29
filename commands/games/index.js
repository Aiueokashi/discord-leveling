const {createBattle} = require("./minibattle")
exports.startBattle = async function (client, member, message) { return createBattle(client, member, message) }