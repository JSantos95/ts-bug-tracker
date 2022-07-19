import React, { useContext } from "react";
import { Navigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "react-query";

import Bug from "../../components/bug";
import AddBug from "../../components/popups/addBug";
import { UserContext } from "../../components/userContext";
import { addBug, getAllBugsByToken, getUserByToken } from "../../api/bugTrackerApi";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Spinner  from "../../components/utilities/spinner";
import { Bug as BugSchema } from "../../interfaces";

library.add(faPlus);

const BugList: React.FC = () => {
    const { user } = useContext(UserContext);
    const queryClient = useQueryClient();
    
    const {data: userData, isLoading: userLoading} = useQuery('userInfo', () => getUserByToken(user));
    const { isLoading, isError, data } = useQuery('bugs', () => getAllBugsByToken(user));

    const addBugMutation = useMutation((bug: BugSchema) => addBug(bug, user), {
        onSuccess: () => {
            queryClient.invalidateQueries("bugs");
        }
    })

    if(isLoading || userLoading){
        return <Spinner />;
    }

    if(isError || data === undefined || userData === undefined){
        return <Navigate to="/user" state={{ newUser: false, expired: true }} />
    }
    
    const unassignedList = data
    .filter((bug) => bug.status === "Unassigned")
    .map((bug) => <Bug key={bug["bugId"]} bug={bug} />)

    const toDoList = data
        .filter((bug) => bug.status === "To Do")
        .map((bug) => <Bug key={bug["bugId"]} bug={bug} />)

    const inProgressList = data
        .filter((bug) => bug.status === "In Progress")
        .map((bug) => <Bug key={bug["bugId"]} bug={bug} />)

    const qaList = data
        .filter((bug) => bug.status === "QA")
        .map((bug) => <Bug key={bug["bugId"]} bug={bug} />)

    const completeList = data
        .filter((bug) => bug.status === "Complete")
        .map((bug) => <Bug key={bug["bugId"]} bug={bug} />)
    
    return (
        <div>
            <div className="container my-4 bugList">
                <div className="d-flex justify-content-between align-items-baseline">
                    <h1 className="text-capitalize">{userData.username} Bug List</h1>
                    <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <FontAwesomeIcon icon={faPlus} size="2x" />
                    </button>
                </div>
                <AddBug addBugMutation={addBugMutation}/> 
                <br />
                <div className="d-grid gap-5">
                    <div className="row row-col-auto pt-1 justify-content-center" style={{ minHeight: "20vh" }}>
                        {(toDoList.length > 0) &&
                            <ul className="list-group col-sm-4">
                                <h4 className="align-self-center mt-2 mb-3">To Do</h4>
                                {toDoList}
                            </ul>
                        }
                        {(inProgressList.length > 0) &&
                            <ul className="list-group col-sm-4">
                                <h4 className="align-self-center mt-2 mb-3">In Progress</h4>
                                {inProgressList}
                            </ul>
                        }
                        {(qaList.length > 0) &&
                            <ul className="list-group col-sm-4">
                                <h4 className="align-self-center mt-2 mb-3">Waiting On QA</h4>
                                {qaList}
                            </ul>
                        }
                    </div>
                    {(unassignedList.length > 0) &&
                        <div className="row row-cols border-top pt-1">
                            <ul className="list-group col">
                                <h4 className="align-self-center mt-2 mb-3">Unassgined</h4>
                                <div className="row row-cols-1 row-cols-sm-3">
                                    {unassignedList}
                                </div>
                            </ul>
                        </div>
                    }
                    {(completeList.length > 0) &&
                        <div className="row row-cols border-top pt-1">
                            <ul className="list-group col">
                                <h4 className="align-self-center mt-2 mb-3">Completed</h4>
                                <div className="row row-cols-1 row-cols-sm-3">
                                    {completeList}
                                </div>
                            </ul>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default BugList;