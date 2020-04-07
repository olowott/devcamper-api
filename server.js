const path = require('path');
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const dotenv = require('dotenv'); // store access keys
const morgan = require('morgan'); // middleware Op
const colors = require('colors'); // color console code Op
const connectDB = require('./config/db'); // bring in connection to mongoDB Db
const errorHandler = require('./middleware/error'); //costum middleware error using express
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');

// load env vars
dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

//Cookie Parser
app.use(cookieParser());

//run the server
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

//Handle unhandled promise rejections like server connection errors
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server & exit process
  server.close(() => process.exit(1));
});

//Sanitise dats
// To remove data, use:
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent Xss attacks
app.use(xss());

//Rate limiting
const limiter = rateLimit({
  windowsMs: 10 * 60 * 1000, //10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// File uploading middleware
app.use(fileUpload());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

//error handle middleware
app.use(errorHandler);

//Dev loggin middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
