export const errorHandler = (err, req, res, next) => {
    const statusCode = Number.isInteger(err?.statusCode) ? err.statusCode : 500

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message: err?.message || "Internal server error",
        errors: err?.errors || [],
    })
}
