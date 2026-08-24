import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import User from "../../models/auth/UserModel.js";

export const registerUser = asyncHandler(async (req, res) =>
{
    const {name, email, password} = req.body;

    if(!name || !email || !password)
    {
        res.status(400).json({ message: "All fields are required"});
    }

    const userExists = await User.findOne({email});

    if(userExists)
    {
        return res.status(400).json({message: "User already exits"});
    }
    
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({name, email, password: hashPassword});

})