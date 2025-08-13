class ApiError extends Error {
   constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"; // صححت الفاصلة والنص
      this.isOperational = true; // صححت الاسم ليكون isOperational
   }
}

module.exports = ApiError;
