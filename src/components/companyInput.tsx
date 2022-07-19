import React from "react";  

interface InputProps {
    newCompany: string,
    setNewCompany: React.Dispatch<React.SetStateAction<string>>;
}

const CompanyInput: React.FC<InputProps> = ({ newCompany, setNewCompany}) => {
    return (
        <div>
            <label>New Company: (Optional)</label>
            <input type="email" value={newCompany} name="company"
                className="form-control" placeholder="Enter New Company Name"
                onChange={e => setNewCompany(e.target.value)} 
            />
        </div>
    )
}

export default CompanyInput;