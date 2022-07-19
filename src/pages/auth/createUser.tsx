import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "react-query";
import { Navigate } from "react-router";

import { Company as CompanySchema, User as UserSchema } from "../../interfaces";
import { UserContext } from "../../components/userContext";
import CompanySelect from "../../components/companySelect";
import { getAllCompanys, register } from "../../api/bugTrackerApi";

import Spinner from "../../components/utilities/spinner";
import ErrorText from "../../components/utilities/errorText";

// if newUser prop is true this form will register a user, else for login 
const CreateUser: React.FC = () => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [company, setCompany] = useState<number>(0);
    const [logging, setLogging] = useState<boolean>(false);
    const [failedLogIn, setFailedLogIn] = useState<boolean>(false);

    const registerMutation = useMutation((thisUser: UserSchema) => register(thisUser), {
        onError:() => {
            setFailedLogIn(true);
        },
        onSuccess: (data) => {
            sessionStorage.setItem('token', data);
            setUser(data);
            navigate('/bug');
        }
    })

    //Get All Companys
    const {isLoading: companyLoading, isError: companyError, data: companyData} = useQuery('companys', getAllCompanys);
    if(companyLoading) {
        return <Spinner />;
    }
    if(companyData === undefined || companyError) {
        return <Navigate to="/"/>;
    }
    var employersList = companyData.map((com: CompanySchema) => ({"companyId" : com.companyId, "companyName": com.companyName}));
    employersList = ([{"companyId" : 0, "companyName": ""}, ...employersList]);

    //register 
    const authentication = async (e: React.FormEvent) => {
        e.preventDefault();
        setLogging(true);
        const thisUser: UserSchema = {
            username,
            password,
            email,
            company
        }
        registerMutation.mutateAsync(thisUser)
        console.log(logging);
        setLogging(false);
    }

    if(registerMutation.isLoading) {
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
                    <span id="passwordHelpInline" className="form-text">
                        Must at least 5 characters long
                    </span>
                </div>
                <div>
                    <div className="mb-3">
                        <label htmlFor="email">Email: </label>
                        <input type="email" value={email} name="email"
                            className="form-control" placeholder="Enter Email"
                            onChange={e => setEmail(e.target.value)} required
                        />
                    </div>
                    <div className="mb-3">
                        <CompanySelect companyList={employersList} setCompany={setCompany}/>
                    </div>
                </div>
                {failedLogIn && <ErrorText message="Incorrect Email or Password. Try Again" />}
                <div className="d-grid gap-2">
                    <input className="btn btn-primary" type="submit" value="Register" />
                </div>
            </form>
        </div>
    )
}

export default CreateUser;