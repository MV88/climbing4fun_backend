const errorTypes = {
  ValidationError: 422,
  UniqueViolationError: 409,
};

const errorMessages = {
  UniqueViolationError: "Already exists.",
};

function isAlreadyInUse({ message, columns, name }) {
  const inUseIndex = message.indexOf(" already in use");
  if (inUseIndex !== -1) {
    const fieldInUse = message.substr(0, inUseIndex);
    return [fieldInUse.toLowerCase()];
  }
  if (errorMessages[name]) {
    return columns;
  }
  return undefined;
}
const errorHandler = (error, req, res) => {
  const statusCode =
    res.statusCode === 200 ? errorTypes[error.name] || 500 : res.statusCode;
  res.status(statusCode);
  const alreadyUsed = isAlreadyInUse(error);
  console.log("error", error);
  res.json({
    status: statusCode,
    message: error.detail || error.message,
    stack: process.env.NODE_ENV === "production" ? "🍔" : error.stack,
    errors: error.errors || undefined,
    alreadyUsed,
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = {
  errorHandler,
  notFound,
};
