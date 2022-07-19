import React from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBug, faUser, faLayerGroup } from "@fortawesome/free-solid-svg-icons";

library.add(faBug, faUser, faLayerGroup);

const Home: React.FC = () => {
    let navigate = useNavigate();
    const signup = () => {
        navigate('/user', { state: { newUser: true, expired: false } });
    }

    return (
        <div>
            <div className="masthead" style={{ height: "80vh", display: "grid", placeItems: "center" }}>
                <div className="d-flex mb-5 flex-column" style={{ zIndex: "1100" }}>
                    <h1 className="mx-auto" >Bug Tracker</h1>
                    <p className="mx-auto">Track All Of Your Bugs And Tasks Here!</p>
                    <div className="mx-auto">
                        <button type="button" className="btn btn-primary btn-lg" onClick={signup}>Sign Up</button>
                    </div>
                </div>
            </div>
            <section className="features-icons bg-light text-center pt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                                <div className="mx-auto mb-2"><FontAwesomeIcon icon="bug" size="6x" /></div>
                                <h3>Create</h3>
                                <p className="lead mb-0">Create and Catalog your Bugs, Tasks, or Features</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                                <div className="mx-auto mb-2"><FontAwesomeIcon icon="layer-group" size="6x" /></div>
                                <h3>Maintain</h3>
                                <p className="lead mb-0">Track and Save the progress of your bug through 5 development stages</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="features-icons-item mx-auto mb-0 mb-lg-3">
                                <div className="mx-auto mb-2"><FontAwesomeIcon icon="user" size="6x" /></div>
                                <h3>Easy to Use</h3>
                                <p className="lead mb-0">Create an account and your ready to start!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="container" id="Soon">
                <div className="d-flex mt-5 mb-5 flex-column">
                    <h1 className="mx-auto">Features Coming Soon</h1>
                    <p className="mx-auto">Here are some features we're working on: </p>
                    <ul className="mx-auto list-group list-group-flush">
                        <li className="list-group-item">User Account Features</li>
                        <li className="list-group-item">Password Reset</li>
                        <li className="list-group-item">Groups to code with your team/company</li>
                        <li className="list-group-item">Due Dates</li>
                        <li className="list-group-item">Email Noifications</li>
                    </ul>
                </div>
            </section>
        </div>
    )
}

export default Home;