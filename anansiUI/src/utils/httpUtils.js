import axios from 'axios';

const backendURL = 'http://localhost:3000/';

export function userLogin(username, password) {
    return axios.post(`${backendURL}login/`, {
        username: username,
        password: password
    });
}

export function getTokenInfo(jwt) {
    return axios.post(`${backendURL}validate/`, {
        token: jwt
    });
}

export function getAllUsers() {
    return axios.post(`${backendURL}get-users/`);
}

export function viewItems() { // retrieves all contents of the catalog without criteria
    return axios.post(`${ backendURL }catalog-items/`);
}

export function createNewUser(firstName, lastName, email, username, password, phoneNumber, isAdmin, token) {
    return axios.post(`${backendURL}create-user/`, {
        userInfo: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            username: username,
            password: password,
            phoneNumber: phoneNumber,
            isAdmin: isAdmin
        },
        token: token
    });
}
