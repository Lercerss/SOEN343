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
            Authorization: token ? `Bearer ${token}` : '',
        },
    };
    return {
        get: (url, options = {}) => axios.get(url, { ...defaultOptions, ...options }),
        post: (url, data, options = {}) => axios.post(url, data, { ...defaultOptions, ...options }),
        put: (url, data, options = {}) => axios.put(url, data, { ...defaultOptions, ...options }),
        delete: (url, options = {}) => axios.delete(url, { ...defaultOptions, ...options }),
    };
};

export function userLogin(username, password) {
    return axios.post(`${backendURL}user/login/`, {
        username: username,
        password: password
    });
}
export function userLogout(token) {
    return axios.post(`${backendURL}user/logout/`, {
        token: token
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

export function getUserProfile(username){
    var req = client(Cookies.get('jwt'));
    return req.get(`${backendURL}user/profile/${username}`);
}

export function viewItems(jwt, nPage, filters, ordering) {
    return axios.post(`${backendURL}item/display/`, {
        token: jwt,
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
