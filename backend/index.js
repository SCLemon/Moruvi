const express = require('express');
const compression = require('compression');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.set('trust proxy', 'loopback, 192.168.0.1'); 


const rateLimit = require('express-rate-limit');

// 不受限速
const whitelistRoutes = [
    '/api/image',
];

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 分鐘
    max: 200,
    message: 'Too many requests from this account, please try again after a minute.',
    keyGenerator: (req, res) => {
        return req.headers['x-user-token'];
    },
    skip: (req, res) => {
        return whitelistRoutes.some(route => req.path.startsWith(route));
    },
    handler: (req, res, next, options) => {
        return res.redirect('/');
    }
});

app.use(limiter);

app.use((req, res, next) => {
  next();
});


// 初始化資料庫
const { connectToDatabase, disconnectFromDatabase } = require('./db/db');
connectToDatabase();

process.on('SIGINT', function() {
    disconnectFromDatabase();
    process.exit(0);
});

const loginRouter = require('./routes/loginRouter');
app.use(loginRouter);

const mileStoneRouter = require('./routes/mileStoneRouter');
app.use(mileStoneRouter);

const overviewRouter = require('./routes/overviewRouter');
app.use(overviewRouter);

const {router: serviceWorkerRouter} = require('./routes/service-worker/serviceWorkerRouter')
app.use(serviceWorkerRouter)

app.listen(3008,()=>{
    console.log('server is running on port 3008')
})

// 避免系統中斷
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});