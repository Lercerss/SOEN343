import axios from 'axios';

export function userLogin(username, password) {
    return axios.post('http://localhost:3000/login/', {
        username: username,
        password: password
    });
}
