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
            client_id: "402489531361-0mispvglt1dlsuo58em8eao7bia0nkvv.apps.googleusercontent.com",
            callback: (oauth_response) => {
                (async () => {
                    const [
                        status_code, 
                        existingAccount,
                        email,
                        action,
                    ] = await userActions.userGoogleLogin({
                        credential: oauth_response.credential,
                    })();
                    
                    // console.log(status_code);
                    // console.log(existingAccount);
                    // console.log(email);
                    // console.log(action);

                    if (status_code === 200) {
                        if (existingAccount) {
                            dispatch(action);
                            navigate("/home");
                        } else {
                            //New account, require completing a registration form:
                            dispatch(action);
                            navigate("/register", {email: email});
                        }
                    }
                })()
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