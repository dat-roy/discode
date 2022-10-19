import ActionTypes from "./constants";
import {
    handleGoogleLoginAPI, handleRegisterAPI,
} from "../../services/auth";

class UserActions {
    userLoginSuccess = (payload) => ({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: payload,
    })

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

                let action = null;
                if (response.status === 200) {
                    if (response.data.exist) {
                        action = this.userLoginSuccess(response.data);
                    }
                }
                //console.log(response.data);
                return [
                    response.status,
                    response.data.exist, 
                    response.data.user_data.email,
                    action,
                ];
            } catch (err) {
                console.error(err);
            }
        };
    }

    userRequestRegistration = (data) => {
        return async () => {
            try {
                const response = await handleRegisterAPI(data);

                let action = null;
                if (response.status === 200) {
                    action = this.userLoginSuccess(response.data);
                } else {
                    
                }

                return [
                    action,
                ];
            } catch (err) {
                console.error(err);
            }
        }
    }

    userLoginByToken = () => {

    }

    userLogout = () => {

    }
}

export const userActions = new UserActions();