/* **************************************
 * Intentionally throw an error
 * **************************************/
function throwError(req, res, next) {
  try {
    throw new Error("This is an intentional 500 error!")
  } catch (err) {
    err.status = 500
    next(err) // send to error-handling middleware
  }
}

module.exports = { throwError }
