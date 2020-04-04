const express = require('express');
const dotenv = require('dotenv'); // store access keys
const morgan = require('morgan'); // middleware Op
const colors = require('colors'); // color console code Op
const connectDB = require('./config/db'); // bring in connection to mongoDB Db
const errorHandler = require('./middleware/error'); //costum middleware error using express

// load env vars
dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

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

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

//error handle middleware
app.use(errorHandler);

//Dev loggin middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
