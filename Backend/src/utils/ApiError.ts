// Define common error codes for your e-commerce application
export enum ErrorCode {
    BAD_REQUEST = 400, // For invalid or missing request data
    UNAUTHORIZED = 401, // For authentication failures
    FORBIDDEN = 403, // For insufficient permissions
    NOT_FOUND = 404, // For resources that don't exist
    INTERNAL_SERVER_ERROR = 500, // For unexpected server errors
    // Add more error codes as needed for your specific app
  }
  
  // ApiError class with improved structure and type safety
  export class ApiError extends Error {
    readonly statusCode: ErrorCode;
    readonly message: string;
    readonly errors?: string[]; // Optional error details (e.g., validation errors)
    readonly success: boolean = false; // Always set to false for API errors
  
    constructor(
      statusCode: ErrorCode,
      message: string,
      errors?: string[]
    ) {
      super(message);
      this.statusCode = statusCode;
      this.message = message;
      this.errors = errors;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  // Utility function to create a standardized API error response
  export function createApiErrorResponse(error: ApiError): Record<string, any> {
    return {
      statusCode: error.statusCode,
      message: error.message,
      errors: error.errors, // Include error details if present
      success: error.success,
    };
  }
  