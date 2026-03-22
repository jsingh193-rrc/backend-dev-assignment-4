import { HTTP_STATUS } from "../../../constants/httpConstants";

export class AppError extends Error {
    constructor(
        public message: string,
        public code: string,
        public statusCode: number
    ) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

export class AuthenticationError extends AppError {
    constructor(
        message: string,
        code: string = "AUTHENTICATION_ERROR",
        statusCode: number = HTTP_STATUS.UNAUTHORIZED
    ) {
        super(message, code, statusCode);
    }
}


export class AuthorizationError extends AppError {
    constructor(
        message: string,
        code: string = "AUTHORIZATION_ERROR",
        statusCode: number = HTTP_STATUS.FORBIDDEN
    ) {
        super(message, code, statusCode);
    }
}

export class ValidationError extends AppError {
    constructor(
        message: string,
        code: string = "VALIDATION_ERROR",
        statusCode: number = HTTP_STATUS.BAD_REQUEST
    ) {
        super(message, code, statusCode);
    }
}


export class NotFoundError extends AppError {
    constructor(
        message: string,
        code: string = "NOT_FOUND",
        statusCode: number = HTTP_STATUS.NOT_FOUND
    ) {
        super(message, code, statusCode);
    }
}


export class ServerError extends AppError {
    constructor(
        message: string,
        code: string = "SERVER_ERROR",
        statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
    ) {
        super(message, code, statusCode);
    }
}
