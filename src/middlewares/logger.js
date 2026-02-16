const logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request ke ${req.url}`);
    next();
};

module.exports = logger;