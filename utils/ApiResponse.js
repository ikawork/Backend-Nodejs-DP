module.exports = {
    success: (res, data) => {
      res.status(200).json({
        success: true,
        data
      });
    },
    failure: (res, err, message, statusCode) => {
      res.status(statusCode || 500).json({
        success: false,
        error: err,
        message
      });
    }
  }