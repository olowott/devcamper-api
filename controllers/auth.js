const ErrorResponse = require('../utils/errorResponse'); // handle error
const asyncHandler = require('../middleware/async'); // async errors
const User = require('../models/User'); //  linking model

//@desc     Register user
//@route    GET /api/v1/auth/register
//@access   Public

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //Create user
  const user = await User.create({
    name,
    email,
    password,
    role
  });

  //create token
  const token = user.getSignedJwtToken();

  res.status(200).json({ sucess: true, token });
});
