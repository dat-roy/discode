const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const Users = require('../models/users.model');

const { pick } = require('../utils/object-handler');
const { getGooglePayload } = require('../services/google-auth.service');

// [JWT sign]
// Default algorithm: HMAC SHA256
const JWTPrivateKey = process.env.JWT_PRIVATE_KEY;

// [Bcrypt] 
const saltRounds = 10;

class userController {
    //[POST] /api/user/auth/google-login
    async verifyGoogleLogin(req, res, next) {
        /**
         * Request body:
         * * credential: from google sign-in service. 
         */        
        try {
            const email = (await getGooglePayload(req.body.credential)).email;
            const results = await Users.findAll({
                attributes: [
                    'id', 'username', 'email', 'gender', 'birthday', 'avatar_url',
                ],
                where: {
                    email: email,
                },
            });
            console.log(results);

            if (results.length !== 0) {
                const token = jwt.sign({ email: email}, JWTPrivateKey, { expiresIn: '3h'});
                const user_data = results[0];

                //Existing email
                res.status(200).json({
                    exist: true,
                    user_data: user_data,
                    token: token,
                    message: "Login successfully",
                })
            } else {
                //New account
                res.status(200).json({
                    exist: false, 
                    user_data: {
                        email: email, 
                    }, 
                    token: null,
                    message: "New account",
                })
            }
            
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                exist: false,
                user_data: null,
                token: null,
                message: "An internal error from server",
            })
        }
    }

    //[POST] /api/user/auth/register
    async registerNewAccount(req, res, next) {
        /**
         * Request body:
         * * email, 
         * * username, 
         * * password,
         * * gender, 
         * * birthday,
         * * credential,
         */    

        let { email, username, password, gender, birthday, credential } = req.body;
        try {
            const emailExists = await Users.checkExistence({ where: {email: email} });
            const usernameExists = await Users.checkExistence({ where: {username: username} });

            if (email && username && password && !emailExists && !usernameExists) {
                //Encrypt password with bcrypt
                const hashedPwd = await bcrypt.hash(password, saltRounds);
                if (! hashedPwd) {
                    throw new Error("Empty hashedPwd, an error occurred when hashing");
                }

                //Get avatar_url from credential 
                const avatar_url = (await getGooglePayload(credential)).picture;

                const result = await Users.create({
                    email: email, 
                    username: username, 
                    birthday: birthday,
                    password: hashedPwd, 
                    gender: gender, 
                    avatar_url: avatar_url, 
                });
                if (! result) {
                    throw new Error("Error when inserting into `users` table");
                }
                const userRecord = await Users.findOne({ where: {id: result.insertId} });
                if (! userRecord) {
                    throw new Error("Error when searching from `users` table");
                }
                const user_data = pick(userRecord, "id", "email", "username", "birthday", "gender", "avatar_url");
                //JWT sign
                const token = jwt.sign({ email: email}, JWTPrivateKey, { expiresIn: '3h'});
                return res.status(200).json({
                    validInfo: true, 
                    saved: true,
                    emailExists: emailExists,
                    usernameExists: usernameExists,
                    user_data: user_data, 
                    token: token,
                })
            }

            return res.status(200).json({
                validInfo: false,
                saved: false,
                emailExists: emailExists,
                usernameExists: usernameExists,
                user_data: null, 
                token: null,
            })
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                message: "An internal error from server",
            })
        }
    }

    //[GET] /api/user/get?username=
    async getUserByUsername(req, res, next) {
        if (Object.keys(req.query)[0] !== 'username') {
            return res.status(400).json({
                message: "Invalid query key",
                user_data: null, 
            })
        }
        const username = req.query.username;
        if (!username || username === '') {
            return res.status(200).json({
                message: "Empty query value",
                user_data: null,
            })
        }

        try {
            const result = await Users.findOne({
                attributes: [
                    "id", "username", "email", "birthday", "avatar_url"
                ], 
                where: {
                    username: username,
                }
            })

            if (! result) {
                return res.status(200).json({
                    message: "Invalid user ID", 
                    user_data: null,
                })
            }
            console.log(result);
            res.status(200).json({
                message: "Get user successfully", 
                user_data: result
            });
        } catch (err) {
            console.log(err.message);
            res.status(500).json({
                message: "Internal Server Error", 
            })
        }
    }

    //[POST] /api/user/get-me
    getLoggedInUserData(req, res, next) {
        const user = req.user;
        if (user) {
            res.status(200).json({
                message: 'Get user data successfully',
                user_data: user,
            })
        } else {
            res.status(404).json({
                message: 'Something went wrong',
                user_data: null,
            })
        }
    }
}

module.exports = new userController()