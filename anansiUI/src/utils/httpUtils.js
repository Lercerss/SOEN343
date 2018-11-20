import axios from 'axios';
import Cookies from 'js-cookie';
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

const client = (token = null) => {
    const defaultOptions = {
        headers: {
            Authorization: token ? `Bearer ${token}` : ''
        }
    };
    return {
        get: (url, options = {}) => axios.get(url, { ...defaultOptions, ...options }),
        post: (url, data, options = {}) => axios.post(url, data, { ...defaultOptions, ...options }),
        put: (url, data, options = {}) => axios.put(url, data, { ...defaultOptions, ...options }),
        delete: (url, options = {}) => axios.delete(url, { ...defaultOptions, ...options })
    };
};

export function userLogin(username, password) {
    let req = client(Cookies.get('jwt'));
    return req.post(`${backendURL}user/login/`, {
        username: username,
        password: password
    });
}
export function userLogout(token) {
    let req = client(Cookies.get('jwt'));
    return req.post(`${backendURL}user/logout/`);
}

export function getTokenInfo() {
    let req = client(Cookies.get('jwt'));
    return req.get(`${backendURL}user/validate/`);
}

export function getAllUsers() {
    let req = client(Cookies.get('jwt'));
    return req.get(`${backendURL}user/display-all/`);
}

export function getUserProfile(username) {
    let req = client(Cookies.get('jwt'));
    return req.get(`${backendURL}user/profile/${username}`);
}

export function viewItems(nPage, filters, ordering) {
    let req = client(Cookies.get('jwt'));
    return req.post(`${backendURL}item/display/`, {
        nPage: nPage,
        filters: filters,
        ordering: ordering
    });
}

export function createNewUser(
    firstName,
    lastName,
    email,
    username,
    password,
    phoneNumber,
    isAdmin
) {
    let req = client(Cookies.get('jwt'));
    return req.post(`${backendURL}user/create/`, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: password,
        phoneNumber: phoneNumber,
        isAdmin: isAdmin
    });
}

export function addNewItem(type, itemInfo) {
    let req = client(Cookies.get('jwt'));
    return req.post(`${backendURL}item/add/`, {
        type: type,
        itemInfo: itemInfo
    });
}

export function editItem(type, itemInfo) {
    let req = client(Cookies.get('jwt'));
    return req.post(`${backendURL}item/edit/`, {
        type: type,
        itemInfo: itemInfo
    });
}

export function deleteItem(type, itemInfo) {
    let req = client(Cookies.get('jwt'));
    return req.delete(`${backendURL}item/delete/`, {
        data: {
            type: type,
            itemInfo: itemInfo
        }
    });
}

export function loanCopies(items) {
    let req = client(Cookies.get('jwt'));
    return req.post(`${backendURL}item/loan`, {
        items: items
    });
}
