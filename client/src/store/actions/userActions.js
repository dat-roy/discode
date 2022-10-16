import ActionTypes from "./constants";
import {
    handleGoogleLoginAPI,
} from "../../services/auth";

class UserActions {
    userLoginSuccess = (payload) => {
        console.log("Call me");
        return {
            type: ActionTypes.LOGIN_SUCCESS,
            payload: payload,
        };
    }

    userLogoutSuccess = () => ({
        type: ActionTypes.LOGOUT_SUCCESS,
    })

    userRegisterSuccess = (payload) => ({
        type: ActionTypes.REGISTER_SUCCESS,
        payload: payload,   
    })

    userGoogleLogin = (data) => {
        return async () => {
            try {
                const response = await handleGoogleLoginAPI(data);
                console.log(response);
                console.log(response.status);
                console.log(response.headers);

            } catch (err) {
                console.err(err);
            }
        };
    }

    userLoginByToken = () => {

    }

    userLogout = () => {

    }
}

export const userActions = new UserActions();