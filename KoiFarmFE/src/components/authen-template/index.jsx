import React, { Children } from "react";
import "./index.css";

function AuthenTemplate({ children }) {
  return (
    <div className="authen-template">
      <div className="authen-template___form">{children}</div>
    </div>
  );
}

export default AuthenTemplate;
