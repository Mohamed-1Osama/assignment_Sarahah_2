const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { env, rateLimit: rateLimitCfg } = require('./config/env');
const routes = require('./routes');
const { notFoundHandler, globalErrorHandler } = require('./middlewares/error.middleware');

const app = express();


app.use(helmet()); 
app.use(
  cors({
    origin: env === 'production' ? []  : true,
    credentials: true, 
  })
);
app.use(mongoSanitize()); 
app.use(xssClean()); 
app.use(hpp()); 

app.use(
  rateLimit({
    windowMs: rateLimitCfg.windowMs,
    max: rateLimitCfg.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
  })
);


app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
if (env !== 'test') app.use(morgan(env === 'development' ? 'dev' : 'combined'));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/v1', routes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
