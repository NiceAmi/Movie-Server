const jwt = require('jsonwebtoken');
const usersModel = require('../Models/usersModel');

const findUser = async (token) => {
    let tokenResponse = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    if (tokenResponse) {
        let { userName } = tokenResponse;
        let user = await usersModel.find({ userName: userName });
        user = user[0];
        if (user) {
            return user;
        } else {
            return "user not found";
        }
    }
};

const getAllUsers = async (token) => {
    let validate = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    if (validate) {
        let users = await usersModel.find({});
        if (users) {
            return users;
        } else {
            return "No users found";
        }
    }
    return [];
};

const getUserById = async (token, userId) => {
    let validate = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    if (validate) {
        let user = await usersModel.findById(userId);
        if (user) {
            return user;
        } else {
            return "No user found";
        }
    }
};

const updateUser = async (token, userId, obj) => {
    try {
        let validate = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
        if (validate) {
            await usersModel.findByIdAndUpdate(userId, obj);
            return "User updated successfully";
        }
    } catch (error) {
        console.error("Error updating user:", error);
        return "Error updating user";
    }
}

const addNewUser = async (token, userId, newUser) => {
    try {
        const validate = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
        if (validate) {
            if (userId !== newUser.createdBy) {
                return { error: "Unauthorized access" };
            }
            const user = new usersModel(newUser);
            await user.save();
            return { message: "New user added successfully" };
        }
    } catch (error) {
        console.error("Error adding new user:", error);
        return { error: "Internal Server Error" };
    }
}

const deleteUser = async (token, requesterId, userIdToDelete) => {
    try {
        const validate = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
        if (validate) {
            if (requesterId !== userIdToDelete) {
                return { error: "Unauthorized access" };
            }
            await usersModel.findByIdAndDelete(userIdToDelete);
            return { message: "User deleted successfully" };
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        return { error: "Internal Server Error" };
    }
}

module.exports = {
    findUser, getUserById, updateUser, getAllUsers, addNewUser, deleteUser
};