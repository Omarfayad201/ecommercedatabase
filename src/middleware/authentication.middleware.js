import { Token } from "../../db/models/token.model.js";
import { User } from "../../db/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import  jwt  from "jsonwebtoken";
export const isAuthenticated = asyncHandler(async (req, res, next) => {
    // check token
    let token = req.headers["token"];
    // check bearer key
    if (!token || !token.startsWith(process.env.BEARER_KEY)) return next(new Error("valid token is required!"));
    // extract payload
    token = token.split(process.env.BEARER_KEY)[1];
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    //check token in data base
    const isToken = await Token.findOne({ token, isValid: true });
    if (!isToken) return next(new Error("invalid token", { cause: 401 }));

    //check user existence

    const user = await User.findById(payload.id);
    if (!user) return next(new Error("user not found", { cause: 401 }));

    //pass user
    req.user = user
    
    return next();

});