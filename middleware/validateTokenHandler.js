const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];  // Extract the token from 'Bearer <token>'

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error("User is not authorized");
            }
            
            // Attach decoded user data to req.user for access in route handlers
            req.user = decoded.user;
            next();  // Proceed to the next middleware or route handler
        });
    } else {
        res.status(401);
        throw new Error("Authorization token is required");
    }
});

module.exports = validateToken;
