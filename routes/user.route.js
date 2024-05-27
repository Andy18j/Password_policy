// const express = require("express")

// const {userModel} = require("../model/user.model")
// const {passwordPolicyModel} = require("../model/passwordpolicy.model")
// const { validatePassword } = require("../routes/passwordpolicy.route")
// const bcrypt = require("bcrypt")
// const jwt = require("jsonwebtoken")
// require("dotenv").config()

// const userRouter = express.Router()

// const defaultPasswordPolicy = {
//     min_length: 12,
//     uppercase_required: 2,
//     lowercase_required: 6,
//     number_required: 2,
//     specialcharacter_required: 2,
//     password_history_count: 3
// };

// // userRouter.post("/signup",async(req,res)=>{
// //     try{
// //         const {Email,Password,Confirm_Password} = req.body
// //         const hashed = await bcrypt.hash(Password,8)
// //         const newUser = userModel({
// //             Email,Password:hashed,Confirm_Password:hashed
// //         })
// //         await newUser.save()
// //         res.status(200).json({msg:"user are ragisterd sucessfullyy..",newUser})

// //     }
// //     catch(err){
// //         res.status(402).json({msg:"Something went wrong for ragistaring the user data"})
// //         console.log(err)
// //     }
// // })

// // userRouter.post("/signup", async (req, res) => {
// //     try {
// //         // Retrieve the password policy from the database
// //         let policy = await passwordPolicyModel.findOne();

// //         // If no policy document found, use default policy
// //         if (!policy) {
// //             policy = defaultPasswordPolicy;
// //         }

// //         // Extract password from request body
// //         const { Email, Password, Confirm_Password } = req.body;

// //         if (Password !== Confirm_Password) {
// //             return res.status(400).json({ msg: "Password and Confirm Password do not match." });
// //         }

// //         // Validate password against policy
// //         const isValidPassword = await validatePassword(Password, policy);

// //         // If password does not meet policy requirements, return error response
// //         if (!isValidPassword) {
// //             return res.status(400).json({ msg: "Password does not meet the policy requirements." });
// //         }

// //         // Hash the password
// //         const hashedPassword = await bcrypt.hash(Password, 8);

// //         // Create a new user with hashed password
// //         const newUser = new userModel({
// //             Email,
// //             Password: hashedPassword,
// //             Confirm_Password: hashedPassword // Confirm_Password should be hashed, assuming it's the same as Password
// //         });

// //         // Save the new user to the database
// //         await newUser.save();

// //         // Send success response
// //         res.status(200).json({ msg: "User registered successfully.", user: newUser });
// //     } catch (error) {
// //         // Send error response
// //         console.error("Error registering user:", error);
// //         res.status(500).json({ msg: "Internal server error" });
// //     }
// // });

// userRouter.post("/signup", async (req, res) => {
//     try {
//         let policy = await passwordPolicyModel.findOne();
//         if (!policy) {
//             policy = defaultPasswordPolicy;
//         }

//         // Extract password from request body
//         const { Email, Password, Confirm_Password } = req.body;

//         const existingUser = await userModel.findOne({ Email });
//         if (existingUser) {
//             return res.status(400).json({ msg: "Email already exists. Please try another email address." });
//         }


//         if (Password !== Confirm_Password) {
//             return res.status(400).json({ msg: "Password and Confirm Password do not match." });
//         }

       

//         // Validate password against policy
//         const validation = await validatePassword(Password, policy);

//         // If password does not meet policy requirements, return error response
//         if (!validation.isValid) {
//             return res.status(400).json({ msg:validation.msg });
//         }
//         const hashedPassword = await bcrypt.hash(Password, 8);

//         const newUser = new userModel({
//             Email,
//             Password: hashedPassword,
//             Confirm_Password: hashedPassword,
//             passwordHistory: [hashedPassword]
//         });

        

//         await newUser.save();
//         res.status(200).json({ msg: "User registered successfully.", user: newUser });
//     } catch (error) {
//         console.error("Error registering user:", error);
//         res.status(500).json({ msg: "Internal server error" });
//     }
// });

// userRouter.post("/login",async(req,res)=>{
//     try{
//         const {Email,Password}=req.body
//         const newuser = await userModel.findOne({Email})
//         if (!newuser){
//             return res.status(501).json({msg:"The user are not found in database"})
//         }
//         const pass = await bcrypt.compare(Password,newuser.Password)
//         if (!pass){
//             return res.status(501).json({msg:"Incorrect password..Try again"})
//         }
//         const token = jwt.sign({userId:newuser._id},process.env.key)
//         res.status(201).json({msg:"Login Sucessfully..",newuser,token:token})

//     }
//     catch(err){
//         res.status(402).json({msg:"Invalid Credentials"})
//     }
// })


const express = require("express");
const { userModel } = require("../model/user.model");
const { passwordPolicyModel } = require("../model/passwordpolicy.model");
const { validatePassword } = require("../routes/passwordpolicy.route");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userRouter = express.Router();

const defaultPasswordPolicy = {
    min_length: 12,
    uppercase_required: 2,
    lowercase_required: 6,
    number_required: 2,
    specialcharacter_required: 2,
    password_history_count: 3
};

userRouter.post("/signup", async (req, res) => {
    try {
        let policy = await passwordPolicyModel.findOne();
        if (!policy) {
            policy = defaultPasswordPolicy;
        }

        // Extract password from request body
        const { Email, Password, Confirm_Password } = req.body;

        const existingUser = await userModel.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ msg: "Email already exists. Please try another email address." });
        }

        if (Password !== Confirm_Password) {
            return res.status(400).json({ msg: "Password and Confirm Password do not match." });
        }

        // Validate password against policy
        const validation = await validatePassword(Password, policy);

        if (!validation.isValid) {
            return res.status(400).json({ msg: validation.msg });
        }

        const hashedPassword = await bcrypt.hash(Password, 8);

        const newUser = new userModel({
            Email,
            Password: hashedPassword,
            Confirm_Password: hashedPassword,
            passwordHistory: [hashedPassword]
        });

        await newUser.save();
        res.status(200).json({ msg: "User registered successfully.", user: newUser });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

userRouter.post("/login", async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const user = await userModel.findOne({ Email });

        if (!user) {
            return res.status(401).json({ msg: "User not found." });
        }

        const isMatch = await bcrypt.compare(Password, user.Password);

        if (!isMatch) {
            return res.status(401).json({ msg: "Incorrect password." });
        }

        const token = jwt.sign({ userId: user._id }, process.env.KEY);
        res.status(200).json({ msg: "Login successful.", user, token });
    } catch (error) {
        res.status(500).json({ msg: "Internal server error." });
    }
});

userRouter.post("/updatePassword", async (req, res) => {
    try {
        const { Email, newPassword, confirmNewPassword } = req.body;

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ msg: "New password and confirm new password do not match." });
        }

        const user = await userModel.findOne({ Email });
        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }

        let policy = await passwordPolicyModel.findOne();
        if (!policy) {
            policy = defaultPasswordPolicy;
        }

        const validation = await validatePassword(newPassword, policy);
        if (!validation.isValid) {
            return res.status(400).json({ msg: validation.msg });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 8);

        if (user.passwordHistory.includes(hashedNewPassword)) {
            return res.status(400).json({ msg: "You cannot reuse an old password." });
        }

        if (user.passwordHistory.length >= policy.password_history_count) {
            user.passwordHistory.shift(); // Remove the oldest password
        }

        user.passwordHistory.push(hashedNewPassword);
        user.Password = hashedNewPassword;
        user.Confirm_Password = hashedNewPassword;

        await user.save();

        res.status(200).json({ msg: "Password updated successfully.", user });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});




module.exports = {
    userRouter
}