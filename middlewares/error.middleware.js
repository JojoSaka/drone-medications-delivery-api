// middleware/errorMiddleware.js
const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;

    console.error("🔥 Error:", err);

    // PostgreSQL unique constraint violation
    if (err.code === "23505") {
      const message = "Duplicate field value entered";
      error = new Error(message);
      error.statusCode = 400;
    }

    // Foreign key violation
    if (err.code === "23503") {
      const message = "Invalid reference: foreign key constraint violation";
      error = new Error(message);
      error.statusCode = 400;
    }

    // Not null violation
    if (err.code === "23502") {
      const message = "Missing required field: cannot be null";
      error = new Error(message);
      error.statusCode = 400;
    }

    // Invalid text representation (e.g., wrong data type)
    if (err.code === "22P02") {
      const message = "Invalid input syntax for type";
      error = new Error(message);
      error.statusCode = 400;
    }

    // Undefined table or column
    if (err.code === "42P01" || err.code === "42703") {
      const message = "Database schema error: undefined table or column";
      error = new Error(message);
      error.statusCode = 500;
    }

    // Default handler
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server Error",
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;