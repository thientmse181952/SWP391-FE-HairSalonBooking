

import React, { ReactNode } from 'react'
import "./index.scss";

interface AddTemplateProps {
    children: ReactNode;
}

const AddTemplate: React.FC<AddTemplateProps> = ({ children })=> {
    return (
    <div className="add-template">
        <div className="add-template__form"> {children} </div>
        </div>
    );
};

export default AddTemplate;