/**
 * Global error handler middleware.
 * Catches all unhandled errors and returns a consistent JSON response.
 */
// eslint-disable-next-line no-unused-vars
export const globalErrorHandler = (err, req, res, _next) => {
  console.error(`[ERROR] ${err.message}`);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: "Something went wrong",
    message: process.env.NODE_ENV === "production" ? "Internal Server Error" : message,
  });
};
