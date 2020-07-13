/*Modules*/
const express = require('express');
const morgan = require('morgan');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const dao = require('./dao.js');
/*SECRET AND EXPIRE TIME*/
const jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';
const expireTime = 300;

/*PORT*/
const PORT = 3001;
/*APP*/
app = new express();
app.use(morgan('combined'));
app.use(express.json());

/*ERROR OBJ*/
const dbError = { errors: [{ 'param': 'Server', 'msg': 'Database error' }] };
const authError = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };
const paymentError = { errors: [{ 'param': 'Server', 'msg': 'Payment error' }] };



/*LOGIN*/
app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    dao.checkUserPass(username, password).then((userObj) => {
        const token = jsonwebtoken.sign({ userID: userObj.userID }, jwtSecret, { expiresIn: expireTime });
        res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * expireTime });
        res.json(userObj);
    }).catch(
        // Delay response when wrong user/pass is sent to avoid fast guessing attempts
        (test) => new Promise((resolve) => {
            setTimeout(resolve, 1000)
        }).then(
            () => res.status(401).end()
        )
    );

})

app.use(cookieParser());

const csfrProtection = csrf({
    cookie: { httpOnly: true, sameSite: true }
});

/*LOGOUT*/
app.post('/api/logout', (req, res) => {
    res.clearCookie('token').end();
});



//GET ALL CARS FROM DB
app.get('/api/cars', (req, res) => {
    dao.listCars().then((cars) => { res.json(cars) })
        .catch((err) => res.status(503).json(dbError))
});
//GET DISTINCT BRANDS FROM DB
app.get('/api/brands', (req, res) => {
    dao.listBrands().then((brands) => { res.json(brands) })
        .catch((err) => res.status(503).json(dbError))
});


// For the rest of the code, all APIs require authentication
app.use(
    jwt({
        secret: jwtSecret,
        getToken: req => req.cookies.token
    })
);

// Provide an endpoint for the App to retrieve the CSRF token
app.get('/api/csrf-token', csfrProtection, (req, res) => {
    console.log(req.csrfToken() );
    res.json({ csrfToken: req.csrfToken() });
});

// To return a better object in case of errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json(authError);
    }
});

//GET PAST USER RENTALS
app.get('/api/user/past/rentals', (req, res) => {
    // Extract userID from JWT payload
    const userID = req.user && req.user.userID;
    dao.loadUserPastRentals(userID).then((rentalsObj) => {
        res.json(rentalsObj);
    }).catch((err) => res.status(503).json(dbError));
});


//GET FUTURE USER RENTALS
app.get('/api/user/future/rentals', (req, res) => {
    // Extract userID from JWT payload
    const userID = req.user && req.user.userID;
    dao.loadUserFutureRentals(userID).then((rentalsObj) => {
        res.json(rentalsObj);
    }).catch((err) => res.status(503).json(dbError));
});
//DELETE RENTAl
app.delete('/api/rental/:code', csfrProtection, (req, res) => {
    const userID = req.user && req.user.userID;
    dao.deleteRental(req.params.code)
        .then((result) => res.end())
        .catch((err) => res.status(503).json(dbError));
});


//POST AVAIABLE CARS
app.post('/api/avaiableCars', csfrProtection,(req, res) => {
    const filter = req.body;
    dao.numberOfAvaiableCars(filter).then((avaiableObj) => {
        res.json(avaiableObj);
    }).catch((err) => res.status(503).json(dbErrorObj));
});


//POST NEW RENTAL
app.post('/api/rentals', csfrProtection, (req, res) => {
    const userID = req.user && req.user.userID;
    const filter = req.body;
    dao.numberOfAvaiableCars(filter).then((avaiableObj) => {
        dao.createRental({
            idCar: avaiableObj.car.id,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            price: req.body.price,
            insurance: req.body.insurance,
            moreDriver: req.body.moreDriver,
            km: req.body.km,
        }, userID).then((result) => res.json(result)).catch((err) => res.status(503).json(dbError));
    }).catch((err) => res.status(503).json(dbError));
});


//Payment
app.post('/api/payment',csfrProtection,(req,res) =>{
    const userID = req.user && req.user.userID;
    const card = req.body.card;
    const accepted = {status : 'ok'};
    if(card.name && card.number && card.cvc){
        res.json(accepted);
    }else{
        res.status(503).json(paymentError);
    }
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));