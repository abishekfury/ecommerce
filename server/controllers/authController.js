const catchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/userModel");
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwt')
const crypto = require('crypto')
const sendEmail = require('../utils/email');


//register user -/api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password, avatar } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar,
    });

    sendToken(user, 201, res)

});

//login user -/api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
 
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 401));
    }

    //finding the user database
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid email or password'), 401);
    }

    if (!await user.isValidPassword(password)) {
        return next(new ErrorHandler('Invalid email or password'), 401);
    }

    sendToken(user, 201, res)

});


//Logout - /api/v1/logout
exports.logoutUser = (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
        .status(200)
        .json({
            success: true,
            message: "Loggedout"
        })

}

//Forgot Password - /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404))
    }

    const resetToken = user.getResetToken();
    await user.save({ validateBeforeSave: false })

    let BASE_URL = process.env.FRONTEND_URL;
    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }


    //Create reset url
    const resetUrl = `${BASE_URL}/password/reset/${resetToken}`;

    const message = `Your password reset url is as follows \n\n 
    ${resetUrl} \n\n If you have not requested this email, then ignore it.`;

    try {
        sendEmail({
            email: user.email,
            subject: "JVLcart Password Recovery",
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message), 500)
    }

})

//Reset Password - /api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: {
            $gt: Date.now()
        }
    })

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or expired'));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match'));
    }

    user.password = req.body.password; findByIdAndUpdate
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false })
    sendToken(user, 201, res)

})

//get user profile
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(201).json({
        success: true,
        user
    })
})

//change Password - /api/v1/password/change
exports.changePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')

    //check old password
    if (!await user.isValidPassword(req.body.oldPassword)) {
        return next(new ErrorHandler('OldPassword is Incorrect'))
    }

    user.password = req.body.password;
    await user.save();

    res.status(200).json({
        success: true,
    })
})

//Update profile -
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true
    })

    res.status(201).json({
        success: true,
        user
    })
})

//Admin -- get all users --  {{base_url}}/api/v1/admin/users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find()
    res.status(200).json({
        success: true,
        users
    })
})


//Admin -- get specific users --  {{base_url}}/api/v1/admin/user
exports.getUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User not Found with this id ${req.params.id}`))
    }
    res.status(200).json({
        success: true,
        user
    })
})


//Admin -- update user data -- {{base_url}}/api/v1/admin/user/:id
exports.updateUser = catchAsyncError(async (req, res, next) => {

    const updateData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        user
    })
})

//Admin -- delete user data --  {{base_url}}/api/v1/admin/user/:id
exports.deleteUser = catchAsyncError(async (req, res, next) => {

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User not Found with this id ${req.params.id}`))
    }
    await user.remove();

    res.status(200).json({
        success: true,
        user
    })
})

