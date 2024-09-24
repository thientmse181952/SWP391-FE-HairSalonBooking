import React, { ReactNode } from "react";
import "./index.scss";

interface AuthenTemplateProps {
  children: ReactNode;
}

const AuthenTemplate: React.FC<AuthenTemplateProps> = ({ children }) => {
  return (
    <div className="authen-template">
      <div className="authen-template__form">{children}</div>
    </div>
  );
};

export default AuthenTemplate;
