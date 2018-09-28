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
export function getAllUsers() {
    return axios.post('http://localhost:3000/getUsers');
}
