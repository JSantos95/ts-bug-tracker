import React, { useState, useContext } from "react";
import { User, AddProps, Employees } from '../../interfaces';
import { UserContext } from "../userContext";
import { useQuery } from "react-query";
import { getAllCompanyUsersByToken, getUserByToken } from "../../api/bugTrackerApi";
import Spinner from "../utilities/spinner";

const AddBug: React.FC<AddProps> = ({ addBugMutation }) => {
    const [bugName, setBugName] = useState<string>('');
    const [type, setType] = useState<string>('Bug');
    const [description, setDescription] = useState<string>('');
    const [assigneeId, setAssigneeId] = useState<number>();
    const [priority, setPriority] = useState<string>('Low');
    const { user } = useContext(UserContext);

    //get all users by token
    const employeesQuery = useQuery('employees', () => getAllCompanyUsersByToken(user));
    const userQuery = useQuery('userData', () => getUserByToken(user));

    if(employeesQuery.isLoading || userQuery.isLoading){
        console.log("loading");
        return <ExceptionBox loading={true} />
    }

    if(employeesQuery.isError || userQuery.isError || employeesQuery.data === undefined || userQuery.data === undefined){
        console.log("error")
        return <ExceptionBox loading={false} />
    }
    
    console.log("success");
    let employees: Array<Employees> = employeesQuery.data.map(
        (user: User) => ({ "userId": user.userId, "username": user.username })
    );
    employees = [{"userId": 0, "username": "-"}, ...employees];

    //creates new bug and closes the popup
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const status = (assigneeId !== 0) ? "To Do" : "Unassigned"; 
        const bug = {
            bugName,
            type,
            description,
            status: status,
            priority,
            reporterId: userQuery.data.userId,
            assigneeId,
        }
        console.log(bug);

        //API Post Call 
        addBugMutation.mutate(bug);

        //reset form
        setBugName('');
        setType('Bug')
        setDescription('');
        setAssigneeId(0);
        setPriority('Low');
    }

    return (
        <div className="modal" tabIndex={-1} id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create A New Bug</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="container">
                            <form className="col-sm-12 mx-auto">
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
                                        onChange={e => setAssigneeId(Number(e.target.value))}
                                    >
                                        {employees.map((user) => <option key={user.userId} value={user.userId}>{user.username}</option>)}
                                    </select>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onSubmit}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ExceptionBox: React.FC<{loading: boolean}> = ({loading}) => {
    const content = loading ? <Spinner/>: <div>Error</div>;

    return(
        <div className="modal" tabIndex={-1} id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddBug;