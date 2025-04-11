// The ApiResponse class is used to structure the response for an API endpoint.
export class ApiResponse {
    constructor(statusCode , data , message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400 // If statuscode lower than 400 than true else false
    }
}