const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

//Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    //set toekn from bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }
  // set toekn from cookie
  //   else if(req.cookies.token){
  //     token = req.cookies.token
  //   }

  //Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorise to access this route', 401));
  }

  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorise to access this route', 401));
  }
});

//Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorised to access this route`,
          403
        )
      );
    }
    next();
  };
};
