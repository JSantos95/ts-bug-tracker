import React, { useContext, useState } from "react";
import { useMutation } from "react-query";
import { login } from "../../api/bugTrackerApi";
import { User as UserSchema } from "../../interfaces";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../components/userContext";
import ErrorText from "../../components/utilities/errorText";
import Spinner from "../../components/utilities/spinner";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [logging, setLogging] = useState<boolean>(false);
    const [failedLogIn, setFailedLogIn] = useState<boolean>(false);

    const loginMutation = useMutation((thisUser: UserSchema) => login(thisUser), {
        onError:() => {
            setFailedLogIn(true);
        },
        onSuccess: (data) => {
            sessionStorage.setItem('token', data);
            setUser(data);
            navigate('/bug');
        }
    })

    const authentication = async (e: React.FormEvent) => {
        e.preventDefault();
        setLogging(true);
        const thisUser: UserSchema = {
            username,
            password,
        }
        loginMutation.mutateAsync(thisUser);
        console.log(logging);
        setLogging(false);
    }

    if(loginMutation.isLoading) {
        return <Spinner />
    }

    return (
        <div className="container-fluid">
            <form onSubmit={authentication}>
                <div className="mb-3">
                    <label htmlFor="username">Username: </label>
                    <input type="text" value={username} name="username"
                        className="form-control" placeholder="Enter Username"
                        onChange={e => setUsername(e.target.value)} required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password">Password: </label>
                    <input type="password" value={password} name="password"
                        className="form-control" placeholder="Enter Password"
                        minLength={5} required
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                {failedLogIn && <ErrorText message="Incorrect Email or Password. Try Again" />}

                <div className="d-grid gap-2">
                    <input className="btn btn-primary" type="submit" value="Login" />
                </div>
            </form>
        </div>
    )
}

export default Login;