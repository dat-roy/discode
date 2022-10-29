const jwt = require('jsonwebtoken');
const dbConnection = require("../config/db/index.db");
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const dotenv = require('dotenv');
dotenv.config();

// [Google Auth]
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// [JWT sign]
// Default algorithm: HMAC SHA256
const JWTPrivateKey = process.env.JWT_PRIVATE_KEY;

// [Bcrypt] 
const saltRounds = 10;

class userController {
    //[POST] /api//user/auth/google-login
    async verifyGoogleLogin(req, res, next) {
        /**
         * Request body:
         * * credential: from google sign-in service. 
         */
        const client = new OAuth2Client(GOOGLE_CLIENT_ID)
        
        const google_token = req.body.credential;
        try {
            const ticket = await client.verifyIdToken({
                idToken: google_token,
                audience: GOOGLE_CLIENT_ID,
            })
            const payload = ticket.getPayload()
            const email = payload.email;
            
            let sql = `SELECT * FROM users WHERE email=` 
            + mysql.escape(email);

            const results = await dbConnection.query(sql);

            if (results.length !== 0) {
                console.log(results);
                const token = jwt.sign({ email: email}, JWTPrivateKey, { expiresIn: '3h'});
                const user_data = {
                    id: results[0].id,
                    username: results[0].username, 
                    email: results[0].email,
                    gender: results[0].gender, 
                    birthday: results[0].birthday,
                    avatar_url: results[0].avatar_url,
                };

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
            console.error(err);
            res.status(500).json({
                exist: false,
                user_data: null,
                token: null,
                message: "An external error from server",
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
            const foundEmails = await dbConnection.query( 
                `SELECT email FROM users WHERE email=` + mysql.escape(email)
            );
            //console.log(foundEmails);
            const emailExists = (foundEmails.length != 0) ? true : false;
            
            const foundUsernames = await dbConnection.query(
                `SELECT email FROM users WHERE username=` + mysql.escape(username)
            );
            const usernameExists = (foundUsernames.length != 0) ? true : false;
            
            console.log(emailExists);
            console.log(usernameExists);
                
            console.log(email);
            console.log(username);
            console.log(password);
            if (email && username && password && !emailExists && !usernameExists) {
                //Encrypt password with bcrypt
                const hashedPwd = await bcrypt.hash(password, saltRounds);
                if (! hashedPwd) {
                    throw new Error("Empty hashedPwd, an error occurred when hashing");
                }

                //Date formatter

                //Gender formatter
                const genderTypes = ['m', 'f', 'o'];
                if (! genderTypes.includes(gender)) {
                    gender = 'o';
                }

                //Get avatar_url from credential 
                const client = new OAuth2Client(GOOGLE_CLIENT_ID); 
                const ticket = await client.verifyIdToken({
                    idToken: credential,
                    audience: GOOGLE_CLIENT_ID,
                })
                const payload = ticket.getPayload()
                const avatar_url = payload.picture;
                //const avatar_url = null;
                
                //* mysql.escape() can help change `undefined` to `NULL` 
                //  before inserting into database.
                //* Caution: mysql.escape('yyyy-mm-dd') = 'yyyy-mm-dd'
                const result = await dbConnection.query(
                    `INSERT INTO users(id, email, username, birthday, password, gender, avatar_url)\
                    VALUES (NULL, ${mysql.escape(email)}, ${mysql.escape(username)},\
                    ${(birthday) ? birthday : null}, ${mysql.escape(hashedPwd)},\
                    ${mysql.escape(gender)}, ${mysql.escape(avatar_url)})`
                )

                //result: {
                //     "fieldCount":,
                //     "affectedRows":,
                //     "insertId":,
                //     "info":"",
                //     "serverStatus":,
                //     "warningStatus":
                // }
                if (! result) {
                    throw new Error("Error when inserting into `users` database");
                }
                const userRows = await dbConnection.query(
                    `SELECT * FROM users WHERE id=${result.insertId}`
                )
                
                if (! userRows) {
                    throw new Error("Error when searching from `users` table");
                }
                console.log(userRows);

                //JWT sign
                const token = jwt.sign({ email: email}, JWTPrivateKey, { expiresIn: '3h'});
                return res.status(200).json({
                    validInfo: true, 
                    saved: true,
                    emailExists: emailExists,
                    usernameExists: usernameExists,
                    user_data: {
                        id: userRows[0].id,
                        username: userRows[0].username, 
                        birthday: userRows[0].birthday,
                        gender: userRows[0].gender,
                        avatar_url: userRows[0].avatar_url,
                    },
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
            console.error(err);
            res.status(500).json({
                message: "An external error from server",
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