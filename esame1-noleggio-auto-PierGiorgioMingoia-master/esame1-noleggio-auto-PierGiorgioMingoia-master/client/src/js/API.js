import { Car } from './Car';



const BASEURL = '/api';



/*LOGIN*/
async function userLogin(username, password) {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, password: password }),
        }).then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj); })
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) })
            } else {
                //ERROR
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}
async function getCSRFToken() {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/csrf-token').then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj); })
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function userLogout() {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                reject(null);
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

/*CARS*/
async function getAllCars() {
    //REST API GET /cars
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/cars', {
            method: 'GET',
        }).then((response) => {
            const status = response.status;
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj.map((c) => Car.from(c))) })
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { obj.status = status; reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    })
}


/*Brands*/
async function getAllBrands() {
    //REST API GET /cars
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/brands', {
            method: 'GET',
        }).then((response) => {
            const status = response.status;
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj) })
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { obj.status = status; reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    })
}


/*RENTALS*/
async function getPastUserRental() {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/user/past/rentals', {
            method: 'GET',
        }).then((response) => {
            const status = response.status;
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj) })
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { obj.status = status; reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function getFutureUserRental() {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/user/future/rentals', {
            method: 'GET',
        }).then((response) => {
            const status = response.status;
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj) })
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { obj.status = status; reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function deleteRental(rental, csrfToken) {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/rental/' + rental.id, {
            method: 'DELETE',
            headers: {
                'X-CSRF-Token': csrfToken,
            },
        }).then((response) => {
            const status = response.status;
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { obj.status = status; reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });

}

/*AVAIABLE CARS*/
async function getAvaiableCars(filter, csrfToken) {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/avaiableCars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            },
            body: JSON.stringify({ startDate: filter.startDate, endDate: filter.endDate, category: filter.category }),
        }).then((response) => {
            const status = response.status;
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj) })
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { obj.status = status; reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

//STUB API
async function checkCreditCard(card, price, csrfToken) {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            },
            body: JSON.stringify({ card: card, price: price }),
        }).then((response) => {
            const status = response.status;
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj) })
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { obj.status = status; reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        });
    });
}

async function insertNewRental(rental, csrfToken) {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/rentals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            },
            body: JSON.stringify(rental),
        }).then((response) => {
            const status = response.status;
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj) })
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { obj.status = status; reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors)
    })
}

const API = { getAllCars, getAllBrands, userLogin, userLogout, getCSRFToken, getPastUserRental, getFutureUserRental, deleteRental, getAvaiableCars, insertNewRental, checkCreditCard };
export default API;