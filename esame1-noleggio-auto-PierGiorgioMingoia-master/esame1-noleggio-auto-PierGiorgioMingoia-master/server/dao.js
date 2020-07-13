/*MODULES*/
const bcrypt = require('bcrypt');
const moment = require('moment');
const sqlite = require('sqlite3');

/*DB*/
const db = new sqlite.Database('db/noleggio.db', (err) => {
    if (err) throw err;
});

/*LOGIN*/
exports.checkUserPass = function (user, pass) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT username, password FROM users WHERE username = ?';
        db.all(sql, [user], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows.length === 0) {
                reject(null);
                return;
            }
            const passwordDb = rows[0].password;
            bcrypt.compare(pass, passwordDb, function (err, res) {
                if (err)
                    reject(err);
                else {
                    if (res) {
                        resolve({
                            userID: rows[0].username,
                        });
                        return;
                    } else {
                        reject(null);
                        return;
                    }
                }
            });
        });
    });
}

/*Cars list*/
exports.listCars = function () {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM cars';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const cars = rows.map((c) => ({ id: c.id, brand: c.brand, model: c.model, category: c.category }));
            resolve(cars);
        });
    })
}

/*List of Brands*/
exports.listBrands = function () {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT DISTINCT(brand) FROM cars';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const brands = rows.map((b) => b);
            resolve(brands);
        })
    })
}


/*RENTALS*/
exports.loadUserPastRentals = function (userID) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM rentals R, cars C WHERE idUser= ? AND C.id=R.idCar ';
        db.all(sql, [userID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows.length === 0) {
                resolve([]);
                return;
            }
            const date = moment();
            const rentals = rows.map((r) => ({ id: r.id, idUser: r.idUser, idCar: r.model+' '+r.brand, startDate: r.startDate, endDate: r.endDate, price: r.price, km: r.km, insurance: r.insurance, moreDriver: r.moreDriver }));
            const tmp = rentals.filter((r) => moment(r.startDate).isBefore(date));
            resolve(tmp);
            return;
        });
    });
}

/*GET FUTURE RENTALS*/
exports.loadUserFutureRentals = function (userID) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT R.id, idUser, model, brand, startDate, endDate, price, km, insurance, moreDriver FROM rentals R, cars C WHERE idUser= ? AND C.id=R.idCar';
        db.all(sql, [userID], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows.length === 0) {
                resolve([]);
                return;
            }
            const date = moment();
            const rentals = rows.map((r) => ({ id: r.id, idUser: r.idUser, idCar: r.model+' '+r.brand, startDate: r.startDate, endDate: r.endDate, price: r.price, km: r.km, insurance: r.insurance, moreDriver: r.moreDriver }));
            const tmp = rentals.filter((r) => moment(r.startDate).isAfter(date));
            resolve(tmp);
            return;
        });
    });
}

exports.deleteRental = function (rentalId) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM rentals WHERE id = ? ';
        db.run(sql, [rentalId], (err) => {
            if (err) {
                reject(err);
                return;
            } else
                resolve(null)
        })
    })
}


/*AVAIABLE CARS*/
exports.numberOfAvaiableCars = function (filter) {
    return new Promise((resolve, reject) => {
        //get cars
        const sql = 'SELECT * FROM cars';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const cars = rows.map((c) => ({ id: c.id,  category: c.category }));
            const r_sql = 'SELECT id, idCar, startDate, endDate FROM rentals';
            db.all(r_sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const rentals = rows.map((r) => ({ id: r.id, idCar: r.idCar, startDate: r.startDate, endDate: r.endDate }));
                let tmp = cars.filter((c) => c.category == filter.category);
                let cAll = tmp.length;
                let tmpR = rentals.filter((r) => isOverlapping(r.startDate, r.endDate, filter.startDate, filter.endDate));
                tmp = tmp.filter((c) => {
                    let found = false
                    tmpR.forEach((r) => {
                        if (r.idCar == c.id)
                            found = true;
                    })
                    if (found)
                        return false;
                    else
                        return true;
                });
                let lowN = false;
                if(tmp.length<cAll/100*10){
                    lowN = true;
                }
                const avaiableObj = {
                    n: tmp.length,
                    car: tmp[Math.floor(Math.random() * tmp.length)], 
                    lowN:  lowN         
                }
                resolve(avaiableObj);
            });
        });
    });
}

/*Create rental */
exports.createRental = function (rental, userID) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO rentals(idUser,idCar,startDate,endDate,price,km,insurance,moreDriver) VALUES(?,?,?,?,?,?,?,?)';
        rental.insurance = rental.insurance ? 1 : 0;
        rental.moreDriver = rental.moreDriver ? 1 : 0;
        db.run(sql, [userID, rental.idCar, rental.startDate, rental.endDate, rental.price, rental.km, rental.insurance, rental.moreDriver], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve({success: true});
        });
    });
}

/*Check if 2 interval overlap */
function isOverlapping(startDate1, endDate1, startDate2, endDate2) {
    return moment(startDate1).isSameOrBefore(endDate2) &&
        moment(startDate2).isSameOrBefore(endDate1);
}