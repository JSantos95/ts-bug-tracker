import axios from "axios";
import { Navigate, useNavigate } from "react-router";
import React, { useState, useEffect, useContext } from "react";
import { User } from '../interfaces';
import { UserContext } from "./userContext";
import { apiBugBase } from "../api/bugApi";
import { authUser, getAllUserByCompany } from "../api/userApi";

const CreateBug: React.FC = () => {
    const [bugName, setBugName] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [type, setType] = useState<string>('Bug');
    const [description, setDescription] = useState<string>('');
    const [assginee, setAssginee] = useState<string>('');
    const [priority, setPriority] = useState<string>('Low');
    const [company, setCompany] = useState('');
    const [users, setUsers] = useState<Array<string>>(["-"]);
    const [toAuth, setToAuth] = useState<boolean>(false);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const bug = {
            bugName,
            reporter: username,
            type,
            description,
            priority,
            assginee,
        }
        console.log(bug);
        axios.post(apiBugBase, bug, { headers: { Authorization: `Bearer ${user}` } })
            .then((res: any) => console.log(res.data))
            .catch((err) => console.log("no user", err));
        navigate('/bug');
    }

    useEffect(() => {
        //get user info
        axios.post(authUser + user, {"token": user}, { headers: { Authorization: `Bearer ${user}` } })
            .then((res) => {
                setUsername(res.data.data.username);
                setCompany(res.data.data.company);
            })

        //get all users by company id
        axios.get(getAllUserByCompany + company, { headers: { Authorization: `Bearer ${user}` } })
            .then((res) => {
                const names: Array<string> = res.data.map((user: User) => user.username);
                setUsers(["-", ...names]);
            })
    }, [user, company])

    return (
        <div>
            {toAuth && <Navigate to="/user" />}
            {
                !user ?
                    <div className="container-fluid">
                        <div className="col-sm-5 mx-auto">
                            <h1>Sign In to see your bugs!</h1>
                            <button className="btn btn-primary" onClick={() => setToAuth(true)}>
                                Sign In
                            </button>
                        </div>
                    </div> :
                    <div className="container mt-4">
                        <h2 className="col-sm-5 mx-auto">Create A New Bug</h2>
                        <div className="container">
                            <form onSubmit={onSubmit} className="col-sm-5 mx-auto">
                                <div className="mb-3">
                                    <label htmlFor="bugName">Bug Name: </label>
                                    <input type="text" value={bugName} name="bugName"
                                        className="form-control" placeholder="Enter Bug Name"
                                        onChange={e => setBugName(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>Type: </label>
                                    <select className="form-control"
                                        onChange={e => setType(e.target.value)}
                                    >
                                        <option value={"Bug"}>Bug</option>
                                        <option value={"Task"}>Task</option>
                                        <option value={"Feature"}>Feature</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description">Description: </label>
                                    <textarea value={description} name="description"
                                        className="form-control" placeholder="Enter Description"
                                        onChange={e => setDescription(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>Priority: </label>
                                    <select className="form-control"
                                        onChange={e => setPriority(e.target.value)}
                                    >
                                        <option value={"Low"}>Low</option>
                                        <option value={"Med"}>Med</option>
                                        <option value={"High"}>High</option>
                                    </select>
                                </div>

                                <div className='mb-3'>
                                    <label>Assginee: (Optional)</label>
                                    <select className="form-control"
                                        onChange={e => setAssginee(e.target.value)}
                                    >
                                        {users.map((user, index) => <option key={index}>{user}</option>)}
                                    </select>
                                </div>

                                <input className="btn btn-primary" type="submit" />
                            </form>
                        </div>
                    </div>
            }
        </div>
    )
}

export default CreateBug;