import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import ErrorText from "../../components/utilities/errorText";

import CreateUser from "./createUser";
import Login from "./login";

const Auth: React.FC<{isLogin: boolean}> = ({ isLogin }) => {
    const [loggin, setLoggin] = useState<boolean>(true);
    const [expired, setExpired] = useState(false);
    const { state } = useLocation();

    useEffect(() => {
        setLoggin(isLogin);
        if (state !== null) {
            setExpired(state.expired);
        }
    }, [isLogin, state])
    
    return (
        <div className="container mt-4">
            <div className="col-sm-5 mx-auto">
                <div className="d-flex justify-content-between">
                    { loggin ? <h1>Login</h1> : <h1>Register</h1>}
                    <button className="btn btn-link" onClick={() => setLoggin(!loggin)}>
                        { loggin ? "Register" : "Login" }
                    </button>
                </div>
                { loggin ? <Login /> : <CreateUser /> }
                { expired && <ErrorText message="Session Expired. Please Sign In Again" /> }
            </div>
        </div>
    )
}

export default Auth;