
module.exports = class command {
    constructor(client, info) {
        this.client = client;
        this.info = info;
        this._responses = new Set();
    }

    run(message, args) {
        throw new Error('error');
    }
}