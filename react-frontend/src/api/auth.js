import axiosInstance from "./axiosInstance";

/*Login Authentication and validations handled + API call*/

const validateLoginInput = (username, password) => {
    // Check if both fields are provided
    if (!username || !password) {
        throw new Error("Please enter both your username and password.");
    }

    // Type validation
    if (typeof username !== 'string' || typeof password !== 'string') {
        throw new Error("Invalid input. Username and password must be text.");
    }

    // Trim whitespace and check for empty values
    if (username.trim().length === 0) {
        throw new Error("Username cannot be empty or contain only spaces.");
    }
    if (password.trim().length === 0) {
        throw new Error("Password cannot be empty or contain only spaces.");
    }

    // Username validation
    if (username.includes(' ')) {
        throw new Error("Username cannot contain spaces. Please remove any spaces.");
    }
    if (username.length < 3 || username.length > 15) {
        throw new Error("Username must be between 3 and 15 characters long.");
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        throw new Error("Username can only include letters, numbers, and underscores.");
    }

    // Password validation
    if (password.length < 8 || password.length > 20) {
        throw new Error("Password must be between 8 and 20 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
        throw new Error("Password must include at least one uppercase letter (e.g., A).");
    }
    if (!/[a-z]/.test(password)) {
        throw new Error("Password must include at least one lowercase letter (e.g., a).");
    }
    if (!/[0-9]/.test(password)) {
        throw new Error("Password must include at least one number (e.g., 1).");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        throw new Error("Password must include at least one special character (e.g., @, #, or !).");
    }

    return null;
};

export const login = async (username, password) => {
    // Validate input
    const validationLoginError = validateLoginInput(username, password);
    if (validationLoginError) {
        throw validationLoginError;
    }

    try {
        const response = await axiosInstance.post('/login', {
            username,
            password,
        });
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        if (error.response) {
            if (error.response.status === 401) {
                throw new Error("Invalid username or password");
            }
            throw new Error("Login failed. Please try again later.");
        }
        throw new Error("Network error. Please check your connection.");
    }
};

/*End of Login Authentication and validations handled*/

/*SignUp Authentication and validations handle + API call*/
const validateSignUpInput = (username, email, phone, nationalID, password) => {
    if (!username || !email || !phone || !nationalID || !password) {
        throw new Error("All fields are required. Please fill out every field.");
    }

    // Type validation
    if (typeof username !== 'string' || typeof email !== 'string' || typeof phone !== 'string' || typeof nationalID !== 'string' || typeof password !== 'string') {
        throw new Error("Invalid input. All fields must be text.");
    }

    // Username validation
    if (username.includes(' ')) {
        throw new Error("Username cannot contain spaces. Please remove any spaces.");
    }
    if (username.length < 3 || username.length > 15) {
        throw new Error("Username must be between 3 and 15 characters long.");
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        throw new Error("Username can only include letters, numbers, and underscores.");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
    if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address (e.g., user@example.com).");
    }

    // Password validation
    if (password.length < 8 || password.length > 20) {
        throw new Error("Password must be between 8 and 20 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
        throw new Error("Password must include at least one uppercase letter (e.g., A).");
    }
    if (!/[a-z]/.test(password)) {
        throw new Error("Password must include at least one lowercase letter (e.g., a).");
    }
    if (!/[0-9]/.test(password)) {
        throw new Error("Password must include at least one number (e.g., 1).");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        throw new Error("Password must include at least one special character (e.g., @, #, or !).");
    }

    // Phone number validation
    if (!/^\d{10,15}$/.test(phone)) {
        throw new Error("Phone number must be between 10 and 15 digits and contain only numbers.");
    }

    // National ID validation
    if (!/^[a-zA-Z0-9]+$/.test(nationalID)) {
        throw new Error("National ID can only include letters and numbers.");
    }
    if (nationalID.length < 5 || nationalID.length > 20) {
        throw new Error("National ID must be between 5 and 20 characters long.");
    }

    return null;
};

export const signup = async (username, email, phone, nationalID, password) => {
    // Validate input
    const validationSignUpError = validateSignUpInput(username, email, phone, nationalID, password);
    if (validationSignUpError) {
        throw validationSignUpError;
    }

    try {
        const response = await axiosInstance.post('/signup', {
            username,
            email,
            phone,
            national_id: nationalID, // Match the backend field name
            password,
        });
        return response.data;
    } catch (error) {
        console.error("Signup error:", error);
        if (error.response) {
            if (error.response.status === 400) {
                throw new Error("Signup failed. Please check your input and try again.");
            }
            throw new Error("Signup failed. Please try again later.");
        }
        throw new Error("Network error. Please check your connection.");
    }
};

export const getCurrentUser = async () => {
    const response = axiosInstance.get('/current');
    return response;
};