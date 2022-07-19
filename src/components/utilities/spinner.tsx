import React from "react";

const Spinner: React.FC = () => {
    return (
        <div className="text-center mt-1">
            <div className="spinner-border text-primary" style={{ "width": "3rem", "height": "3rem" }} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default Spinner;