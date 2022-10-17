import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/hooks";
import { userActions } from "../../store/actions/userActions";

export default function Login() {
    const navigate = useNavigate();
    const [ state, dispatch ] = useStore();

    useEffect(() => {
        const google = window.google;
        google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: async (oauth_response) => {
                    const [
                        status_code, 
                        existingAccount,
                        email,
                        action,
                    ] = await userActions.userGoogleLogin({
                        credential: oauth_response.credential,
                    })();
                    
                    if (status_code === 200) {
                        if (existingAccount) {
                            dispatch(action);
                            navigate("/home");
                        } else {
                            //New account, require completing a registration form:
                            navigate("/register", {
                                state: {
                                    email: email,
                                }
                            });
                        }
                    }
            },
        });

        google.accounts.id.renderButton(
            document.getElementById("sign-in"),
            {
                size: "medium",
            }
        );
    }, [state.user]);
    
    return (
        <div id="login-page">
            <p>Login page</p>
            <div id="sign-in"></div>
        </div>
    )
} 