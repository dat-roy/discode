const path = require('path');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();

// Google Auth
const { OAuth2Client } = require('google-auth-library');
const { connect } = require('http2');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// [JWT sign]
// Default algorithm: HMAC SHA256
const JWTPrivateKey = process.env.JWT_PRIVATE_KEY;


const dbConnection = require("../config/db/index.db");
const conn = dbConnection();
conn.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
})


class userController {

    // //[GET] /user/login
    // login(req, res, next) {
    //     res.json({
    //         message: 'hello hello',
    //     })
    // }

    //[POST] /api//user/auth/google-login
    async verifyGoogleLogin(req, res, next) {
        const client = new OAuth2Client(GOOGLE_CLIENT_ID)
        
        const google_token = req.body.credential;
        try {
            const ticket = await client.verifyIdToken({
                idToken: google_token,
                audience: GOOGLE_CLIENT_ID,
            })

            const payload = ticket.getPayload()
            const email = payload.email;
            
            //Else: redirect to an sign-in page.
            let sql = `SELECT * FROM users WHERE email=` 
            + conn.escape(email);
            conn.query(
                sql, function(error, results, fields) {
                    if (error) {
                        return error;
                    }

                    if (results.length !== 0) {
                        console.log(results);
                        const token = jwt.sign({ email: email}, JWTPrivateKey, { expiresIn: '3h'});
                        const user_data = {
                            user_id: results[0].user_id,
                            username: results[0].username, 
                            email: results[0].email,
                            gender: results[0].gender, 
                            birthday: results[0].birthday,
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
                }
            );
            
        } catch (err) {
            res.status(500).json({
                exist: false,
                user_data: null,
                token: null,
                message: 'Error: ' + err.message,
            })
        }
    }

    //[GET] /api/user/logout
    logout(req, res, next) {
        res.clearCookie('session-token')
        res.status(200).json({
            message: 'Logout successfully',
        })
    }

    //[POST] /api/user/get-me
    getLoggedInUserData(req, res, next) {
        const user = req.user
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