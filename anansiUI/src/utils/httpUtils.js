import axios from 'axios';

const backendURL = 'http://localhost:3000/';

export function userLogin(username, password) {
    return axios.post(`${backendURL}user/login/`, {
        username: username,
        password: password
    });
}

export function getTokenInfo(jwt) {
    return axios.post(`${backendURL}user/validate/`, {
        token: jwt
    });
}

export function getAllUsers() {
    return axios.post(`${backendURL}user/display-all/`);
}

export function viewItems() { // retrieves all contents of the catalog without criteria
    return axios.post(`${ backendURL }item/display-all/`);
}

export function createNewUser(firstName, lastName, email, username, password, phoneNumber, isAdmin, token) {
    return axios.post(`${backendURL}user/create/`, {
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

export function addNewItem(type, itemInfo, token) {
    return axios.post(`${backendURL}item/add/`, {
        type: type,
        itemInfo: itemInfo,
        token: token
    });
}

export function editItem(type, itemInfo, token) {
    return axios.post(`${backendURL}item/edit/`, {
        type: type,
        itemInfo: itemInfo,
        token: token
    });
}

export function deleteItem(id, itemInfo, token) {
    return axios.delete(`${backendURL}item/delete/`, {
        data: {
            id: id,
            itemInfo: itemInfo,
            token: token
        }
    });
}
