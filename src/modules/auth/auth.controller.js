import { User } from "../../../db/models/user.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import  jwt  from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { sendEmail } from "../../../utils/sendEmail.js";
import { resetPassTemplate, signUpTemplates } from "../../../utils/htmlTemplates.js";
import { Token } from "../../../db/models/token.model.js";
import Randomstring from "randomstring";
import { Cart } from "../../../db/models/cart.model.js";

export const register = asyncHandler(async (req, res, next) => {
  //data from request
  const { userName, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) return next(new Error("user already existed!", { cause: 409 }));

  //generate token
  const token = jwt.sign({ email }, process.env.TOKEN_SECRET);

  //create user
  await User.create({ ...req.body });

  //create confirmationLink

  const confirmationLink = `http://localhost:3000/auth/activate_account/${token}`;

  //send email
    const messageSend = await sendEmail({ to: email, subject: "Activation Account", html: signUpTemplates(confirmationLink) })
    if(!messageSend) return next(new Error("something went wrong!"))

    // const messageSend = 

    //send response
    return res.status(201).json({ success: true, message:"you email is activated check you email!"})
});

// activate account

export const activateAccount = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { email } = jwt.verify(token, process.env.TOKEN_SECRET);
  //find user and update
  let user = await User.findOneAndUpdate({ email }, { isConfirmed: true });
  //check user

  if (!user) return next(new Error("user notfound", { cause: 401 }));

  // create cart // TODO
     await Cart.create({user:user._id})
  //send response
  res.json({ success: true, message: "try to login!" });
});

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    // check user

    const user = await User.findOne({email})
    if (!user) return next(new Error("user not found or you password or email is wrong!", { cause: 401 }));

    // check activation
    if (!user.isConfirmed) return next(new Error("you should activate your account !", { cause: 401 }));

    // check password 
    let match = bcryptjs.compareSync(password, user.password);
    if (!match) return next(new Error("password is wrong!", { cause: 401 }));

    // generate token

    const token = jwt.sign({ email, id: user._id }, process.env.TOKEN_SECRET);

    // save token in tokenModel

    await Token.create({ token, user: user._id });
    
    // send response

    return res.json({success:true, message:{token}})
    
});

// forget code
export const forgetCodeVal = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    
    //check email 
    const user = await User.findOne({ email });
    if (!user) return next(new Error("Invalid email", { cause: 401 }));

    // generate forgetCode 
    const forgetCode = Randomstring.generate({
        charset: "numeric",
        length: 5,
    });

    user.forgetCode = forgetCode
    await user.save();

    // send forgetCode 
    const messageSend = await sendEmail({ to: email, subject: "Reset Password", html: resetPassTemplate(forgetCode) });
    if (!messageSend) return next(new Error("some thing went wrong!", { cause: 404 }));

    if (!user.isConfirmed) return next(new Error("activate your account first"));
    
    // send response

    return res.json({ success: true, message: "Check your Email!" });
    
});

// reset password

export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, password, forgetCode } = req.body;
    // check user

    const user = await User.findOne({ email });
    if (!user) return next(new Error("user not found!", { cause: 401 }));
    // check forgetCode 
    if (forgetCode !== user.forgetCode) return next(new Error("code is invalid!", { cause: 401 }));

    // hash password
    user.password = bcryptjs.hashSync(password, parseInt(process.env.SALT_ROUND));
    await user.save();
    
    // find all token of user
    const token = await Token.find({ user: user._id })
    
    //invalid all token 
    token.forEach(async (token) => {
        token.isValid = false
        await token.save()
    });
    // send response // redirect login front-end
    return res.json({success:true , message:"try to login again!"})
    
})