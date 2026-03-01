
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    let authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(400).json({ message: "Invalid token" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(400).json({ message: "Invalid token" });
        }

        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;