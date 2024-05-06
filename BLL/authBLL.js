const bcrypt = require('bcryptjs');
const usersModel = require('../Models/usersModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { writeToLogFile } = require('../logger');

const registerUser = async (obj) => {
    let { userName, email } = obj;
    let validate = await usersModel.find({ userName: userName });

    if (validate.length == 0) {
        validate = await usersModel.find({ email: email });
    }

    validate = validate[0];

    if (!validate) {
        let { password } = obj;
        let encryptedPassword = await bcrypt.hash(password + process.env.SECRET_KEY_PASSWORD, 10);
        obj.password = encryptedPassword;
        let user = new usersModel(obj);
        await user.save()
        return "User created successfully";
    } else {
        return "User Name or Email already exist, please try another name or email.";
    }
}

const logInUser = async (obj) => {

    let { userName } = obj;
    let user = await usersModel.find({ userName: userName });
    user = user[0];
    if (!user) {
        return "User not found";
    } else {
        let validatePass = await bcrypt.compare(obj.password + process.env.SECRET_KEY_PASSWORD, user.password);
        if (validatePass == false) {
            return "invaild password";
        } else {
            let token = jwt.sign({ ...obj, userId: user._id }, process.env.SECRET_TOKEN_KEY, { expiresIn: "3h" });
            console.log(token);
            console.log("User details:", user);
            return token;
        }
    }
}

module.exports = { registerUser, logInUser };



