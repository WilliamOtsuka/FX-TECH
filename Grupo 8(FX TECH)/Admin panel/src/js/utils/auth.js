export function getToken() {
    // Retrieve the token from localStorage or any other storage mechanism
    return localStorage.getItem('token');
}

export function getUser() {
    // Retrieve the user information from localStorage or any other storage mechanism
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}



export function clearAuth() {
    // Clear the authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
}