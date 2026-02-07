import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;
export function tokenValidated(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).send('Access denied. No token provided')
    }
    try {
        const payload = jsonwebtoken.verify(token, JWT_SECRET);
        console.log('Payload: ', payload.user)
        req.headers.user = payload.user;
        const userObject = JSON.parse(payload.user);
        req.userId = userObject.id
        //console.log('User ID: ', userObject.id)
        return next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({message: "Token inválido"})
    }
}
