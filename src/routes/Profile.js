import { authService } from "fbase";
import React from "react";
import { useHistory } from "react-router-dom";


export default () => {
    // hook 사용하여 "/" url 변경
    const history = useHistory();
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };

    return (
        <>
        <button onClick ={onLogOutClick}>Log Out</button>
        </>
    );
};