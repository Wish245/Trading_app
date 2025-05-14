import axiosInstance from "./axiosInstance";

export const getUserProfile = async () => {
    const {data} = await axiosInstance.get('/profile/me');
    return data;
};

export const updateUsername = async (newUsername) => {
    const {data} = await axiosInstance.put('/profile/username',{
        username: newUsername,
    });

    return data;
    
}

export const updateEmail = async (newEmail) => {
    const {data} = await axiosInstance.put('/profile/email',{
        email: newEmail,
    });

    return data;
}

export const updatePhone = async (newPhone) => {
    const {data} = await axiosInstance.put('/profile/email',{
        phone: newPhone,
    });

    return data;
}

// export const getUserPrimaryContacts = async () => {
//     const {data} = await axiosInstance.get('/contact/primary');
//     return data;
// };
// export const getUserSecondaryContacts =async () => {
//     const{data} = await axiosInstance.get('/contact/secondary');
// };

// export const validateUsername = (username) => {
//     if (typeof username !== 'string') {
//         throw new Error ("Invalid input. All fields must be text.");
//     }
//     if (username.includes(' ')) {
//         throw new Error("Username cannot contain spaces. Please remove any spaces.");
//     }
//     if (username.length < 3 || username.length > 15) {
//         throw new Error("Username must be between 3 and 15 characters long.");
//     }
//     if (!/^[a-zA-Z0-9_]+$/.test(username)) {
//         throw new Error("Username can only include letters, numbers, and underscores.");
//     }

//     return null;
// };

// export const validateContact = (email, phone) => {
//     if (typeof email !== 'string' || typeof phone !== 'string') {
//         throw new Error("Invalid input. All fields must be text.");
//     }
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
//     if (!emailRegex.test(email)) {
//         throw new Error("Please enter a valid email address (e.g., user@example.com).");
//     }
//     if (!/^\d{10,15}$/.test(phone)) {
//             throw new Error("Phone number must be between 10 and 15 digits and contain only numbers.");
//     }
// }