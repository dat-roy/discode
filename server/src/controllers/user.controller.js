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
                    'id', 'username', 'email', 'gender', 'avatar_url',
                ],
                where: {
                    email: email,
                },
            });
            //console.log(results);

            if (results.length !== 0) {
                const token = jwt.sign({ email: email }, JWTPrivateKey, { expiresIn: '3h' });
                const user_data = results[0];

                //Existing email
                res.status(200).json({
                    exist: true,
                    user_data, token,
                    message: "Login successfully",
                })
            } else {
                //New account
                res.status(200).json({
                    exist: false,
                    user_data: { email },
                    message: "New account",
                })
            }

        } catch (err) {
            console.error(err);
            res.status(500).json({
                exist: false,
                message: "An internal error from server",
                error: err.message,
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
         * * credential,
         */

        let { email, username, password, gender, credential } = req.body;
        try {
            const emailExists = await Users.checkExistence({ where: { email: email } });
            const usernameExists = await Users.checkExistence({ where: { username: username } });

            if (email && username && password && !emailExists && !usernameExists) {
                //Encrypt password with bcrypt
                const hashedPwd = await bcrypt.hash(password, saltRounds);
                if (!hashedPwd) {
                    throw new Error("Empty hashedPwd, an error occurred when hashing");
                }

                //Get avatar_url from credential 
                const avatar_url = (await getGooglePayload(credential)).picture;

                const result = await Users.create({
                    email, username,
                    password: hashedPwd,
                    gender, avatar_url,
                });
                const userRecord = await Users.findOne({ where: { id: result.insertId } });
                const user_data = pick(userRecord, "id", "email", "username", "gender", "avatar_url");
                //JWT sign
                const token = jwt.sign({ email: email }, JWTPrivateKey, { expiresIn: '3h' });
                return res.status(200).json({
                    validInfo: true,
                    saved: true,
                    emailExists, usernameExists,
                    user_data, token,
                })
            }

            return res.status(200).json({
                validInfo: false,
                saved: false,
                emailExists, usernameExists,
            })
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "An internal error from server",
                error: err.message,
            })
        }
    }

    //[GET] /api/user/get?id=
    //[GET] /api/user/get?username=
    async getUserByUniqueKey(req, res, next) {
        const id = parseInt(req.query.id);
        const { username } = req.query;

        if (!id && !username) {
            return res.status(200).json({
                message: "Empty query value",
                user_data: null,
            })
        }

        try {
            let whereClause;
            if (id && username) {
                whereClause = { id, username, }
            } else if (id) {
                whereClause = { id, }
            } else if (username) {
                whereClause = { username, }
            }
            const result = await Users.findOne({
                attributes: [
                    "id", "username", "email", "avatar_url", "description", "last_active",
                ],
                where: whereClause,
            })

            if (!result) {
                return res.status(200).json({
                    message: "Invalid id/username",
                    user_data: null,
                })
            }
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
}

module.exports = new userController()