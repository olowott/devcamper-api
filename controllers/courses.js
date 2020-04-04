const ErrorResponse = require('../utils/errorResponse'); // handle error
const asyncHandler = require('../middleware/async'); // async errors
const Course = require('../models/Course'); // models

//@desc     Get courses
//@route    GET /api/v1/bootcamps
//@rout     GET /api/v1/bootcamps/:bootcampId/courses
//@access   Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find();
  }
  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});
