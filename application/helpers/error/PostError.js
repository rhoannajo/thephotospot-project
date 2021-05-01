class PostError extends Error {
    constructor(message, redirectURL, status) {
        super(message);
        this.redirectURL = ridirectURL;
        this.status = status;
    }

    getMessage() {
        return this.message;
    }

    getRedirectURL() {
        return this.getRedirectURL;
    }

    getStatus() {
        return this.status;
    }
}

module.exports = PostError;