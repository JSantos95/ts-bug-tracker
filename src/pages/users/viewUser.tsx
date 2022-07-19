import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

import { Company as CompanySchema } from "../../interfaces";
import { UserContext } from "../../components/userContext";
import { apiCompanyBase, apiCompanyParam } from "../../api/companyAPI";
import { apiUserBase, authUser } from "../../api/userApi";
import CompanySelect from "../../components/companySelect";
import CompanyInput from "../../components/companyInput";

const ViewUser: React.FC = () => {
    const [toggleCompanyInput, setToggleCompanyInput] = useState(false);
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [company, setCompany] = useState<string>('');
    const [companyList, setCompanyList] = useState<CompanySchema[]>([]);
    const [newCompanyName, setNewCompanyName] = useState('');
    const [cId, setCId] = useState<number>(0);
    const [id, setId] = useState<number>(0);
    const [password, setPassword] = useState<string>('');
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    //call to the db for users and company info
    useEffect(() => {
        //get User Data
        axios.post(authUser + user, {"token": user}, { headers: { Authorization: `Bearer ${user}` } })
            .then((res) => {
                //console.log(res.data);
                setPassword(res.data.password);
                setUsername(res.data.username);
                setEmail(res.data.email);
                setId(res.data.userId);
                setCId(res.data.company);

                //get Company Name 
                if(res.data.company !== 0) {
                    axios.get(apiCompanyParam + res.data.company, { headers: { Authorization: `Bearer ${user}` } })
                        .then((result) => {
                            setCompany(result.data.companyName);   
                        }) 
                        .catch((err) => {
                            console.error(err);
                        })
                }
            })
            .catch((err) => {
                console.log(err);
                setUser('');
            });
        //get all Company
        axios.get(apiCompanyBase, { headers: { Authorization: `Bearer ${user}` } })
            .then((res) => {
                setCompanyList(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
    }, [user, setUser])

    const saveUser = (e: React.FormEvent) => {
        e.preventDefault();
        var nextCompanyId = cId;
        //if company is new, create a new one and get the id
        if(toggleCompanyInput === true){
            const postCompany = {"companyName": newCompanyName, "owner": id}
            axios.post(apiCompanyBase, postCompany, { headers: { Authorization: `Bearer ${user}` } })
                .then((res) => {
                    console.log(res.data);
                    nextCompanyId = res.data.id;
                })
                .catch((err) => console.error(err));
        }  

        const updateUser = {"userId": id, password, email, username, "company": nextCompanyId};
        console.log("updating to: ", updateUser);
        axios.put(apiUserBase, updateUser, { headers: { Authorization: `Bearer ${user}` } })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div className="container mt-4">
            <form className="col-sm-5 mx-auto" onSubmit={saveUser}>
                <h1>User Profile</h1>
                <div className="mb-3">
                    <label htmlFor="username">Username: </label>
                    <input type="text" value={username} name="username"
                        className="form-control"
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email">Email: </label>
                    <input type="text" value={email} name="email"
                        className="form-control"
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    {
                        toggleCompanyInput ?
                        <CompanyInput newCompany={newCompanyName} setNewCompany={setNewCompanyName} /> :
                        <CompanySelect companyList={companyList} setCompany={setCId} 
                        default={ {label: company, value: cId} } /> 
                    }
                    <div className="form-check form-switch">
                        <input 
                            className="form-check-input mt-2" type="checkbox" id="flexSwitchCheckDefault"
                            checked={toggleCompanyInput} onChange={() => setToggleCompanyInput(!toggleCompanyInput)}
                        />
                        <label className="form-text" htmlFor="flexSwitchCheckDefault">Create New Company</label>
                    </div> 
                </div>
                
                <button type="button" className="btn btn-secondary me-1" onClick={() => navigate("/bug")}>Back</button>
                <input className="btn btn-primary me-1" type="submit" value="Save" />
            </form>
        </div>
    )
}

export default ViewUser;