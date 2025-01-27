// Node.js provide built in error class for different errors

export class ApiError extends Error {
    constructor(statusCode, message = "Something went Wrong", errors = [], stack = "") {
        super(message , errors);  // Set the error message in the parent class (Error)
        this.statusCode = statusCode;  // HTTP status code for the error (e.g., 404, 500)
        this.errors = errors;  // Extra error details (like an array of validation errors)
        this.success = false;  // Indicate failure since it's an error
        this.data = null;  // Set data to null by default
        this.stack = stack;
        // Set the stack trace (optional, you can pass your own stack)
        // stack is a property that stores the stack trace—a record of where the error occurred in the code.
    }   
}