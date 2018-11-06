import axios from 'axios';

const backendURL = 'http://localhost:3000/';
var appInterceptor;

axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response.status === 401 && appInterceptor) {
            appInterceptor();
        }
        return Promise.reject(error);
    }
);

export function setAppInterceptor(interceptor) {
    appInterceptor = interceptor;
}

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

export function getAllUsers(jwt) {
    return axios.post(`${backendURL}user/display-all/`, {
        token: jwt
    });
}

export function viewItems(jwt, nPage, filters, sorting) {
    // retrieves all contents of the catalog without criteria
    return axios.post(`${backendURL}item/display/`, {
        token: jwt,
        nPage: nPage,
        filters: filters,
        sorting: sorting
    });
}

export function createNewUser(
    firstName,
    lastName,
    email,
    username,
    password,
    phoneNumber,
    isAdmin,
    token
) {
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

export function deleteItem(type, itemInfo, token) {
    return axios.delete(`${backendURL}item/delete/`, {
        data: {
            type: type,
            itemInfo: itemInfo,
            token: token
        }
    });
}
