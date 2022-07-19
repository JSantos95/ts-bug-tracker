import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { UserContext } from "./userContext";
import { Navigate } from "react-router";

import { getAllCompanyUsersByToken, updateBug } from "../api/bugTrackerApi";
import { Bug as BugSchema, Employees, User as UserSchema } from "../interfaces";

import Spinner from "./utilities/spinner";
interface editProps {
    id: string | undefined, 
    bug: BugSchema,
    toggle: Dispatch<SetStateAction<boolean>>,
}

const EditBug: React.FC<editProps> = ({id, bug, toggle}) => {
    const [bugName, setBugName] = useState<string>('');
    const [reporterId, setReporterId] = useState<number>(0);
    const [type, setType] = useState<string>('Bug');
    const [description, setDescription] = useState<string>('');
    const [assigneeId, setAssigneeId] = useState<number>(0);
    const [status, setStatus] = useState<string>('');
    const [priority, setPriority] = useState<string>('Low');
    const { user } = useContext(UserContext);
    const queryClient = useQueryClient();

    //set useState
    useEffect(() => {
        setBugName(bug.bugName);
        setType(bug.type);
        setDescription(bug.description);
        setPriority(bug.priority);
        setStatus(bug.status);
        setReporterId(bug.reporterId);
        setAssigneeId(bug.assigneeId);
    }, [bug]);

    useEffect(() => {
        //there's a assginee, so it can't be unassigned 
        if (assigneeId !== 0  && status === "Unassigned") {
            console.log("terms met, change status");
            setStatus("To Do");
        }

        //there's no assginee, so its unassigned 
        if (assigneeId === 0 && status !== "Unassigned") {
            setStatus("Unassigned");
        }
    }, [assigneeId, status])

    //once updated, update the bug data
    const saveMutation = useMutation((updatedBug: BugSchema) => updateBug(updatedBug, user), {
        onSuccess: data => {
            console.log("updated data: ", data);
            queryClient.setQueriesData('bug', {
                bugId: Number(id),
                bugName,
                type,
                description,
                status,
                priority,
                reporterId,
                assigneeId
            });
            toggle(true);
        }
    });

    const {isLoading, isError, data} = useQuery('coworkers', () => getAllCompanyUsersByToken(user));
    if(isLoading) {
        return <Spinner />;
    }
    if(isError === undefined || isError) {
        return <Navigate to="/"/>;
    }
    const coworkers: Array<Employees> = [
        {"userId": 0, "username": "-"}, 
        ...data.map((user: UserSchema) => ({ "userId": user.userId, "username": user.username }))
    ];

    const saveBug = (e: React.FormEvent) => {
        e.preventDefault();
        const newBug: BugSchema = {
            bugId: Number(id),
            bugName,
            type,
            description,
            status,
            priority,
            reporterId,
            assigneeId
        }
        console.log(newBug);
        saveMutation.mutateAsync(newBug)
    }

    return(
        <div className="mx-auto col-sm-5 mt-4">
            <h1>Editing: {bugName} </h1>
            <form className="container" onSubmit={saveBug}>
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
                        value={type}
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
                    <label>Status: </label>
                    <select className="form-control"
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                    >
                        <option value={"Unassigned"}>Unassigned</option>
                        <option value={"To Do"}>To Do</option>
                        <option value={"In Progress"}>In Progress</option>
                        <option value={"QA"}>QA</option>
                        <option value={"Complete"}>Complete</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label>Priority: </label>
                    <select className="form-control"
                        value={priority}
                        onChange={e => setPriority(e.target.value)}
                    >
                        <option value={"Low"}>Low</option>
                        <option value={"Med"}>Med</option>
                        <option value={"High"}>High</option>
                    </select>
                </div>

                <div className='mb-3'>
                    <label>Assginee: </label>
                    <select className="form-control"
                        value={assigneeId}
                        onChange={e => setAssigneeId(Number(e.target.value))}
                    >
                        {coworkers.map((user) => <option key={user.userId} value={user.userId}>{user.username}</option>)}
                    </select>
                </div>
                <input className="btn btn-primary me-1" type="submit" value="Save" />
                <button type="button" className="btn btn-secondary me-1" onClick={() => toggle(true)}>Cancel</button>
            </form>
        </div>
    )
}

export default EditBug;