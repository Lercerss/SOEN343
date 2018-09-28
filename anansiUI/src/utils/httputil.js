import axios from 'axios';

export function userLogin(username, password) {
    return axios.post('http://localhost:3000/login/', {
        username: username,
        password: password
    });
}
export function getTokenInfo(jwt) {
    return axios.post('http://localhost:3000/validate/', {
        token: jwt
    });
}
export function createNewUser(firstName, lastName, email, username, password, phoneNumber, isAdmin) {
    return axios.post('http://localhost:3000/login/', {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: password,
        phoneNumber: phoneNumber,
        isAdmin: isAdmin
    });
}
