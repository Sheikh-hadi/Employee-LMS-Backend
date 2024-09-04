class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    // Override the toJSON method to include the message in the response
    toJSON() {
        return {
            statusCode: this.statusCode,
            data: this.data,
            success: this.success,
            errors: this.errors,
            message: this.message // Ensure the message is included here
        };
    }
}

export { ApiError };
