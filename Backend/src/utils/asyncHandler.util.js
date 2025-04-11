// Wrapper Function for controller to add error-handling
// When any controller is called it will pass to asyncHandler 
// asycHandler will return a async function 
// This return func will execute the original function 
// And if any error occur it will send res indicating error

export const asyncHandler = (fn) => {
    return async (req, res, next) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
          success: false,
          error: error.errors || [],
          message: error.message || "An unexpected error occurred",
          data: null
        });
      }
    };
  };
  