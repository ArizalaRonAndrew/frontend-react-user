import axios from "axios";

export const AuthService = {
    BASE_URL: "http://localhost:5000/api/v1/admin",

    async register(username, password) {
        try {
            const response = await axios.post(
                `${this.BASE_URL}/register`,
                { username, password }
            );
            return response.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || "Registration failed.");
        }
    },

    async login(username, password) {
        try {
            const response = await axios.post(
                `${this.BASE_URL}/login`,
                { username, password }
            );
            return response.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || "Login failed.");
        }
    },

    async getCurrentUser(token) {
        try {
            const response = await axios.get(
                `${this.BASE_URL}/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            return response.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || "Failed to fetch user.");
        }
    },

    async updateUser(token, userData) {
        try {
            const response = await axios.put(
                `${this.BASE_URL}/update`,
                userData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            return response.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || "Update failed.");
        }
    },

    async deleteUser(token, userId) {
        try {
            const response = await axios.delete(
                `${this.BASE_URL}/delete/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            return response.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || "Delete failed.");
        }
    },

    logout() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
    },

    setSession(token, user) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
    },

    getToken() {
        return localStorage.getItem("authToken");
    },
    
    // NEW: Helper to safely retrieve the user's ID
    getCurrentUserID() {
        const user = localStorage.getItem("user");
        if (user) {
            try {
                const userData = JSON.parse(user);
                // Assuming the user object stored in localStorage has an 'id' or 'userID' field
                return userData.id || userData.userID; 
            } catch (e) {
                console.error("Error parsing user data from localStorage:", e);
                return null;
            }
        }
        return null;
    }
};