import React, { useEffect, useState } from 'react';
import Select, { OnChangeValue, SingleValue } from 'react-select';
import { Company } from '../interfaces';

type selectOp = {
    label: string, 
    value: number
};
interface SelectProps {
    companyList: Company[];
    setCompany: React.Dispatch<React.SetStateAction<number>>;
    default?: selectOp;
};

const CompanySelect: React.FC<SelectProps> = (props) => {
    const companyOptions = props.companyList.map((company) => {
        let container: selectOp = {label: "", value: 0}; 

        container.label = company.companyName;
        container.value = company.companyId;

        return container;
    });
    const start = (props.default) ? props.default : companyOptions[0];
    const [selectedOption, setSelectedOption ] = useState<OnChangeValue<selectOp, false>>(start);

    //if option is ever null Company should be set to 0
    const handleChange = (option: SingleValue<selectOp>) => {
        (option != null) ? props.setCompany(option.value) : props.setCompany(0);
        setSelectedOption(option);
    }

    useEffect(() => {
        console.log("triggered")
        props.default && setSelectedOption(props.default);
    }, [props.default])
    
    return (
        <div>
            <label>Company: (Optional)</label>
            <Select
                value={selectedOption} 
                onChange={option => handleChange(option)}
                options={companyOptions}
            />
        </div>
    );
}

export default CompanySelect;