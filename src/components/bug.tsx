import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { Bug as BugSchema } from "../interfaces";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faExpandAlt } from "@fortawesome/free-solid-svg-icons";

library.add(faExpandAlt);

const Bug: React.FC<{ bug: BugSchema }> = ({ bug }) => {

    const shade = classNames(
        "card", {
        "list-group-item-success": bug.priority === "Low",
        "list-group-item-warning": bug.priority === "Med",
        "list-group-item-danger": bug.priority === "High",
    })
    const link = "/view/" + bug.bugId;

    return (
        <div>
            <div className={shade}>
                <div className="card-body">
                    <h5 className="card-title">{ bug.bugName }</h5>
                    <div className="d-flex justify-content-between">
                        <p className="card-text text-truncate">{ bug.description }</p>
                        <Link to={link} className="text-dark text-end">
                            <FontAwesomeIcon icon={faExpandAlt} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Bug;