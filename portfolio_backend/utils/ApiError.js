function ApiError(statusCode, message = "something went wrong", errors = [], stack = "") {

    let error = new Error(message);
    error.statusCode = statusCode;
    error.data = null;
    error.message = message;
    error.success = false;
    error.errors = errors;

    if(stack){
        error.stack = stack;
    } else {
        Error.captureStackTrace(error, ApiError);
    }

    return error;
}

export default ApiError;



// class ApiError extends Error {
//     constructor(
//         statusCode,
//         message = "something went wrong",
//         errors = [],
//         stack = ""
//     ){
//         super(message)
//         this.statusCode = statusCode
//         this.data = null,
//         this.message = message 
//         this.success = false,
//         this.errors = errors

//         if(stack){
//             this.stack = stack
//         } else {
//             Error.captureStackTrace(this, this.constructor)
//         }
//     }
// }

// export default {ApiError};