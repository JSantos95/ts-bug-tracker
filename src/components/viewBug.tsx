import React, { useContext, useState } from "react";
import { useNavigate, Navigate, useParams } from "react-router";
import { UserContext } from "./userContext";
import { useMutation, useQuery } from "react-query";

import { getBugsById, deleteBug as deleteBugById } from "../api/bugTrackerApi";

import Checker from "./popups/checker";
import Spinner from "./utilities/spinner";
import EditBug from "./editBug";

const ViewBug: React.FC = () => {
    const [viewMode, setMode] = useState<boolean>(true);
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { id } = useParams() as { id: string };

    const deleteMutation = useMutation(() => deleteBugById(id, user))
    const {isLoading, isError, data} = useQuery('bug', () => getBugsById(id, user));
    
    if(isLoading) {
        return <Spinner />;
    }
    if(isError === undefined || isError) {
        return <Navigate to="/"/>;
    }
    
    const deleteBug = () => {
        console.log("Deleting");
        deleteMutation.mutate();
        window.location.href = "/bug";
    }

    return (
        <div>
            {
                viewMode ?
                    <div className="mx-auto ps-3 pe-1 overflow-hidden mt-4">
                        <div className="row justify-content-md-center">
                            <div className="col-lg-6 col-xl-4">
                                <div className="card mx-auto">
                                    <div className="card-body py-3 px-4">
                                        <h4 className="card-title text-center">{ data.bugName }</h4>
                                        <div className="mb-1">
                                            <div className="fw-bold fs-6"> Description: </div> 
                                            <div> { data.description } </div>
                                        </div>
                                        <div className="mb-1">
                                            <div className="fw-bold fs-6"> Priority: </div> 
                                            <div> { data.priority } </div>
                                        </div>
                                        <div>
                                            <div className="fw-bold fs-6"> Status: </div> 
                                            <div> { data.status } </div>
                                        </div>
                                    </div>
                                    <div className="card-footer text-muted">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <button type="button" className="btn btn-secondary me-1" onClick={() => navigate('/bug')}>Back</button>
                                                <button type="button" className="btn btn-primary" onClick={() => setMode(false)}>Edit</button>
                                            </div>
                                            <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteBox">Delete</button>
                                        </div>
                                    </div>
                                    <Checker message={"Are You Sure You Want To Delete This " + data.type + "?"} doThis={deleteBug} idTag="deleteBox" />
                                </div>
                            </div>
                        </div>
                    </div> :
                    <EditBug id={id} bug={data} toggle={setMode} />
            }
        </div>
    )
}

export default ViewBug;