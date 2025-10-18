export const successResponse = (res, message, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res,
  message = "Something Went Wrong",
  statusCode = 500,
  error = {}
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};
