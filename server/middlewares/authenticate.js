const catchAsyncError = require('./catchAsyncError');
const User = require ('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const jwt = require ('jsonwebtoken');

exports.isAuthenticatedUser = catchAsyncError (async (req, res, next) => {
    const { token } = req.cookies

    if(!token){
        return next (new ErrorHandler ('login first to handle this resource'))
    }

    const decoded = jwt.verify( token , process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    next();

})

exports.authorizeRoles = (...roles) => {
    return (req, res , next) => {
        if(!roles.includes(req.user.role)){
            return next (new ErrorHandler (`Role ${req.user.role} is not allowed` , 401))
        }
        next()
    }
}