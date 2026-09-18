import jwt from "jsonwebtoken";

export const reqAuth = (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({
                message: "Access Denied"
            });
        }

        const token = authorization.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.SECRET
        );

        req.user = decoded;

        next();

    } catch (e) {
        return res.status(401).json({
            error: "Invalid or expired token"
        });
    }
};
