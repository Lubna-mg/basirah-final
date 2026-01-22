/**
 * Middleware: Route Not Found (404)
 */
export const notFound = (req, res, next) => {
  const error = new Error(`مسار غير موجود - ${req.originalUrl}`);
  res.status(404);
  return next(error);
};

/**
 * Middleware: Global Error Handler
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    console.error("Error:", err.message);
  }

  res.status(statusCode).json({
    message: err.message,
    errorType: err.name || "UnknownError",
    stack: isProduction ? undefined : err.stack,
  });
};
